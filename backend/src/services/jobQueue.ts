import prisma from '../lib/prisma';
import {
  processMedia,
  deleteMediaFile,
  getMediaMetadata,
} from './mediaProcessing';
import { extractKeyFromUrl, uploadToR2, deleteFromR2, DEFAULT_CONFIG } from './r2Storage';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type JobType = 'audio-extraction' | 'waveform-generation' | 'video-transcode' | 'full-processing';

interface ProcessingJob {
  id: string;
  trackId: string;
  type: JobType;
  status: JobStatus;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory job queue
const jobQueue: ProcessingJob[] = [];
let isProcessing = false;

// R2 client for downloads
const getR2Client = () => {
  const R2_ENDPOINT = process.env.R2_ENDPOINT;
  const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
  const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

  return new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT || 'https://your-r2-account.r2.dev',
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID || '',
      secretAccessKey: R2_SECRET_ACCESS_KEY || '',
    },
  });
};

/**
 * Download file from R2 to local storage
 */
async function downloadFromR2(url: string): Promise<string> {
  const key = extractKeyFromUrl(url);
  if (!key) {
    throw new Error('Invalid R2 URL');
  }

  const filename = url.split('/').pop() || `${uuidv4()}_${key.split('/').pop()}`;
  const localPath = path.join(__dirname, '../../uploads', filename);

  console.log(`[JobQueue] Downloading from R2: ${key} -> ${localPath}`);

  try {
    const client = getR2Client();
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
    
    // Fetch the file
    const response = await fetch(signedUrl);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(localPath, Buffer.from(buffer));

    console.log(`[JobQueue] Downloaded: ${localPath}`);
    return localPath;
  } catch (error: any) {
    console.error(`[JobQueue] Download failed:`, error.message);
    throw error;
  }
}

import { v4 as uuidv4 } from 'uuid';

/**
 * Add a processing job to the queue
 */
export async function enqueueProcessingJob(
  trackId: string,
  type: JobType
): Promise<ProcessingJob> {
  const job: ProcessingJob = {
    id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    trackId,
    type,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  jobQueue.push(job);
  console.log(`[JobQueue] Job enqueued: ${job.id} (${type}) for track ${trackId}`);

  // Update track status
  await prisma.track.update({
    where: { id: trackId },
    data: { processingStatus: 'pending' },
  });

  // Start processing if not already running
  if (!isProcessing) {
    processQueue();
  }

  return job;
}

/**
 * Process jobs from the queue
 */
async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  console.log('[JobQueue] Starting queue processor');

  while (jobQueue.length > 0) {
    const job = jobQueue.find(j => j.status === 'pending');
    if (!job) break;

    job.status = 'processing';
    job.updatedAt = new Date();

    try {
      console.log(`[JobQueue] Processing job: ${job.id}`);

      const track = await prisma.track.findUnique({
        where: { id: job.trackId },
      });

      if (!track) {
        throw new Error(`Track not found: ${job.trackId}`);
      }

      // Process based on job type
      if (job.type === 'full-processing') {
        await processTrackFull(track);
      } else if (job.type === 'waveform-generation') {
        await generateWaveformForTrack(track);
      }

      job.status = 'completed';
      console.log(`[JobQueue] Job completed: ${job.id}`);

    } catch (error: any) {
      job.status = 'failed';
      job.error = error.message;
      console.error(`[JobQueue] Job failed: ${job.id}`, error.message);

      await prisma.track.update({
        where: { id: job.trackId },
        data: {
          processingStatus: 'failed',
          processingError: error.message,
        },
      });
    }

    job.updatedAt = new Date();
  }

  isProcessing = false;
  console.log('[JobQueue] Queue processor finished');
}

/**
 * Process a track with full pipeline (video -> audio + waveform + transcoded)
 */
async function processTrackFull(track: any) {
  const originalVideoUrl = track.originalVideoUrl;
  
  if (!originalVideoUrl) {
    throw new Error('No original video URL found');
  }

  // Download from R2
  const localPath = await downloadFromR2(originalVideoUrl);

  // Process the video
  const result = await processMedia(localPath, 'video/mp4');

  // Clean up local file
  const localFilename = localPath.split('/').pop();
  if (localFilename) {
    deleteMediaFile(localFilename);
  }

  // Update track with processed data
  await prisma.track.update({
    where: { id: track.id },
    data: {
      processedAudioUrl: result.audioUrl,
      transcodedVideoUrl: result.transcodedVideoUrl,
      waveformData: result.waveformData ? JSON.stringify(result.waveformData) : null,
      waveformPeaks: result.waveformPeaks,
      processingStatus: 'completed',
      processingError: null,
    },
  });

  console.log(`[JobQueue] Track ${track.id} processed successfully`);
}

/**
 * Generate waveform for an audio track
 */
async function generateWaveformForTrack(track: any) {
  const audioUrl = track.audioUrl;
  
  if (!audioUrl) {
    throw new Error('No audio URL found');
  }

  // Download from R2
  const localPath = await downloadFromR2(audioUrl);

  // Get metadata
  let metadata;
  try {
    metadata = await getMediaMetadata(localPath);
  } catch (metaError) {
    console.warn(`[JobQueue] Could not get metadata: ${metaError}`);
  }

  // Process audio
  const result = await processMedia(localPath, 'audio/mpeg');

  // Clean up local file
  const localFilename = localPath.split('/').pop();
  if (localFilename) {
    deleteMediaFile(localFilename);
  }

  await prisma.track.update({
    where: { id: track.id },
    data: {
      durationSeconds: metadata ? Math.round(metadata.duration) : null,
      waveformData: result.waveformData ? JSON.stringify(result.waveformData) : null,
      waveformPeaks: result.waveformPeaks,
      processingStatus: 'completed',
    },
  });

  console.log(`[JobQueue] Waveform generated for track ${track.id}`);
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string): Promise<ProcessingJob | null> {
  return jobQueue.find(j => j.id === jobId) || null;
}

/**
 * Get track processing status
 */
export async function getTrackProcessingStatus(trackId: string): Promise<{
  status: string;
  error?: string;
} | null> {
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    select: {
      processingStatus: true,
      processingError: true,
    },
  });

  if (!track) {
    return null;
  }

  return {
    status: track.processingStatus,
    error: track.processingError || undefined,
  };
}

/**
 * Get pending jobs count
 */
export function getQueueStats(): { pending: number; processing: number } {
  return {
    pending: jobQueue.filter(j => j.status === 'pending').length,
    processing: jobQueue.filter(j => j.status === 'processing').length,
  };
}

/**
 * Reprocess a track
 */
export async function reprocessTrack(trackId: string): Promise<ProcessingJob> {
  const track = await prisma.track.findUnique({
    where: { id: trackId },
  });

  if (!track) {
    throw new Error(`Track not found: ${trackId}`);
  }

  // Reset processing status
  await prisma.track.update({
    where: { id: trackId },
    data: {
      processingStatus: 'pending',
      processingError: null,
    },
  });

  // Enqueue new job
  const jobType = track.originalVideoUrl ? 'full-processing' : 'waveform-generation';
  return enqueueProcessingJob(trackId, jobType);
}
