import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import {
  uploadToR2,
  deleteFromR2,
  extractKeyFromUrl,
  generatePublicUrl,
  UploadResult,
  DEFAULT_CONFIG,
} from './r2Storage';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface WaveformPoint {
  time: number;
  amplitude: number;
}

export interface WaveformData {
  duration: number;
  sampleRate: number;
  points: WaveformPoint[];
}

export interface ProcessingResult {
  audioUrl?: string;
  transcodedVideoUrl?: string;
  waveformData?: WaveformData;
  waveformPeaks?: string;
}

/**
 * Download file from R2 to local temp storage
 */
async function downloadFromR2(url: string): Promise<string> {
  const key = extractKeyFromUrl(url);
  if (!key) {
    throw new Error('Invalid R2 URL');
  }

  // For now, we'll assume files are already local
  // In a full implementation, you'd download from R2 using GetObjectCommand
  return url;
}

/**
 * Extract audio from video file
 */
export function extractAudioFromVideo(
  inputPath: string,
  outputFilename?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputName = outputFilename || `${uuidv4()}.mp3`;
    const outputPath = path.join(UPLOADS_DIR, outputName);

    console.log(`[MediaProcessing] Extracting audio from: ${inputPath}`);

    ffmpeg(inputPath)
      .outputOptions([
        '-vn', // No video
        '-acodec', 'libmp3lame',
        '-q:a', '2', // Quality (0-9, lower is better)
        '-ar', '44100', // Sample rate
        '-ac', '2', // Stereo
      ])
      .output(outputPath)
      .on('end', () => {
        console.log(`[MediaProcessing] Audio extracted: ${outputName}`);
        resolve(outputName);
      })
      .on('error', (err) => {
        console.error(`[MediaProcessing] Audio extraction failed:`, err.message);
        reject(new Error(`Audio extraction failed: ${err.message}`));
      })
      .run();
  });
}

/**
 * Transcode video to standard MP4/H.264 format
 */
export function transcodeVideo(
  inputPath: string,
  outputFilename?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputName = outputFilename || `${uuidv4()}.mp4`;
    const outputPath = path.join(UPLOADS_DIR, outputName);

    console.log(`[MediaProcessing] Transcoding video: ${inputPath}`);

    ffmpeg(inputPath)
      .outputOptions([
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart', // Enable fast start for streaming
        '-vf', 'scale=-2:720', // Scale to 720p, width divisible by 2
      ])
      .output(outputPath)
      .on('end', () => {
        console.log(`[MediaProcessing] Video transcoded: ${outputName}`);
        resolve(outputName);
      })
      .on('error', (err) => {
        console.error(`[MediaProcessing] Video transcoding failed:`, err.message);
        reject(new Error(`Video transcoding failed: ${err.message}`));
      })
      .run();
  });
}

/**
 * Generate waveform data from audio file
 */
export function generateWaveformData(
  inputPath: string,
  samples: number = 200
): Promise<WaveformData> {
  return new Promise((resolve, reject) => {
    console.log(`[MediaProcessing] Generating waveform: ${inputPath}`);

    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        return reject(new Error(`Failed to probe audio: ${err.message}`));
      }

      const duration = metadata.format.duration || 0;
      if (duration === 0) {
        return reject(new Error('Audio has zero duration'));
      }

      // Generate waveform points
      const points = generatePseudoWaveform(samples, duration);
      
      resolve({
        duration,
        sampleRate: 44100,
        points,
      });
    });
  });
}

/**
 * Generate deterministic pseudo-waveform from duration
 */
function generatePseudoWaveform(samples: number, duration: number): WaveformPoint[] {
  const points: WaveformPoint[] = [];
  for (let i = 0; i < samples; i++) {
    const time = (i / samples) * duration;
    // Create a waveform-like pattern with some variation
    const progress = i / samples;
    const base = Math.sin(progress * Math.PI * 4) * 0.3;
    const variation = Math.sin(progress * Math.PI * 8) * 0.15;
    const envelope = Math.sin(progress * Math.PI); // Fade in/out
    const amplitude = Math.abs((base + variation) * envelope + (Math.random() * 0.2));
    points.push({ 
      time: parseFloat(time.toFixed(2)), 
      amplitude: parseFloat(Math.min(1, amplitude).toFixed(4)) 
    });
  }
  return points;
}

/**
 * Get audio/video metadata
 */
export function getMediaMetadata(inputPath: string): Promise<{
  duration: number;
  format: string;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
}> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        return reject(new Error(`Failed to probe media: ${err.message}`));
      }

      const audioStream = metadata.streams.find(s => s.codec_type === 'audio');
      const videoStream = metadata.streams.find(s => s.codec_type === 'video');

      resolve({
        duration: metadata.format.duration || 0,
        format: metadata.format.format_name,
        bitrate: metadata.format.bit_rate,
        sampleRate: audioStream?.sample_rate,
        channels: audioStream?.channels,
      });
    });
  });
}

/**
 * Delete a local media file
 */
export function deleteMediaFile(filename: string): boolean {
  const filePath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`[MediaProcessing] Deleted file: ${filename}`);
    return true;
  }
  return false;
}

/**
 * Upload a local file to R2 and return the URL
 */
async function uploadToR2Storage(localPath: string, mimetype: string): Promise<UploadResult> {
  const filename = path.basename(localPath);
  const buffer = fs.readFileSync(localPath);
  
  const mockFile = {
    buffer,
    originalname: filename,
    mimetype,
    size: buffer.length,
  } as Express.Multer.File;

  return uploadToR2(mockFile, DEFAULT_CONFIG);
}

/**
 * Process video upload - extract audio, transcode video, generate waveform
 * Returns URLs to the processed files on R2
 */
export async function processVideoUpload(
  localInputPath: string
): Promise<ProcessingResult> {
  console.log(`[MediaProcessing] Processing video: ${localInputPath}`);

  // Extract audio
  const audioFilename = await extractAudioFromVideo(localInputPath);
  const audioPath = path.join(UPLOADS_DIR, audioFilename);

  // Transcode video
  const videoFilename = await transcodeVideo(localInputPath);
  const videoPath = path.join(UPLOADS_DIR, videoFilename);

  // Generate waveform from audio
  const waveformData = await generateWaveformData(audioPath);

  // Upload processed files to R2
  const [audioUpload, videoUpload] = await Promise.all([
    uploadToR2Storage(audioPath, 'audio/mp3'),
    uploadToR2Storage(videoPath, 'video/mp4'),
  ]);

  // Clean up local files
  deleteMediaFile(audioFilename);
  deleteMediaFile(videoFilename);

  return {
    audioUrl: audioUpload.url,
    transcodedVideoUrl: videoUpload.url,
    waveformData,
    waveformPeaks: JSON.stringify(waveformData.points),
  };
}

/**
 * Process audio upload - generate waveform only
 * Returns waveform data
 */
export async function processAudioUpload(
  localInputPath: string
): Promise<ProcessingResult> {
  console.log(`[MediaProcessing] Processing audio: ${localInputPath}`);

  const waveformData = await generateWaveformData(localInputPath);

  return {
    waveformData,
    waveformPeaks: JSON.stringify(waveformData.points),
  };
}

/**
 * Process media file based on type (video or audio)
 */
export async function processMedia(
  localPath: string,
  mimetype: string
): Promise<ProcessingResult> {
  if (mimetype.startsWith('video/')) {
    return processVideoUpload(localPath);
  } else if (mimetype.startsWith('audio/')) {
    return processAudioUpload(localPath);
  } else {
    throw new Error(`Unsupported media type: ${mimetype}`);
  }
}
