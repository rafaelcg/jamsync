import express, { Router } from 'express';
import multer from 'multer';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import {
  uploadToR2,
  isR2Configured,
  DEFAULT_CONFIG,
} from '../services/r2Storage';
import { enqueueProcessingJob, getQueueStats } from '../services/jobQueue';
import prisma from '../lib/prisma';

const router = Router();

// Configure multer for memory storage (required for R2 upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = DEFAULT_CONFIG.allowedMimeTypes || [];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio, video, and image files are allowed.'));
    }
  },
});

// POST /uploads/media
router.post('/media', authenticateToken, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if R2 is configured
    if (!isR2Configured()) {
      return res.status(500).json({ 
        error: 'Cloud storage not configured',
        message: 'R2 credentials are missing. Please configure R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in .env'
      });
    }

    // Upload to R2
    const result = await uploadToR2(req.file);

    // Check if we should create a track and process media
    const { createTrack } = req.query;
    const shouldCreateTrack = createTrack === 'true' && req.user;
    const isMediaFile = req.file.mimetype.startsWith('audio/') || req.file.mimetype.startsWith('video/');

    if (shouldCreateTrack && isMediaFile) {
      // Create track entry
      const track = await prisma.track.create({
        data: {
          title: req.body.title || req.file.originalname.replace(/\.[^/.]+$/, ''),
          description: req.body.description || null,
          audioUrl: result.url,
          isPublic: req.body.isPublic !== 'false',
          userId: req.user!.id,
          originalVideoUrl: req.file.mimetype.startsWith('video/') ? result.url : null,
          processingStatus: 'pending',
        },
      });

      // Enqueue background processing job
      if (req.file.mimetype.startsWith('video/')) {
        enqueueProcessingJob(track.id, 'full-processing');
      } else {
        enqueueProcessingJob(track.id, 'waveform-generation');
      }

      return res.status(201).json({
        track,
        url: result.url,
        filename: result.filename,
        mimetype: result.mimetype,
        size: result.size,
        processing: true,
        processingStatus: 'pending',
      });
    }

    res.status(201).json({
      url: result.url,
      filename: result.filename,
      key: result.key,
      mimetype: result.mimetype,
      size: result.size,
      isMedia: isMediaFile,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', message: error.message });
  }
});

// POST /uploads/media/batch - Upload multiple files
router.post('/media/batch', authenticateToken, upload.array('files', 10), async (req: AuthRequest, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (!isR2Configured()) {
      return res.status(500).json({ 
        error: 'Cloud storage not configured',
        message: 'R2 credentials are missing. Please configure R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in .env'
      });
    }

    const results = [];
    for (const file of files) {
      const result = await uploadToR2(file);
      results.push(result);
    }

    res.status(201).json({
      files: results,
      count: results.length,
    });
  } catch (error: any) {
    console.error('Batch upload error:', error);
    res.status(500).json({ error: 'Batch upload failed', message: error.message });
  }
});

// GET /uploads/status - Check if R2 is configured
router.get('/status', authenticateToken, (req, res) => {
  const queueStats = getQueueStats();
  res.json({
    r2Configured: isR2Configured(),
    provider: isR2Configured() ? 'cloudflare-r2' : 'none',
    queue: queueStats,
  });
});

// GET /uploads/processing/:trackId - Get processing status for a track
router.get('/processing/:trackId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { getTrackProcessingStatus } = await import('../services/jobQueue');
    
    const trackId = req.params.trackId;
    const processingStatus = await getTrackProcessingStatus(trackId);

    if (!processingStatus) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.json({
      trackId,
      ...processingStatus,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get processing status' });
  }
});

// POST /uploads/processing/:trackId/reprocess - Reprocess a track
router.post('/processing/:trackId/reprocess', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { reprocessTrack } = await import('../services/jobQueue');
    
    const trackId = req.params.trackId;
    const job = await reprocessTrack(trackId);

    res.json({
      trackId,
      jobId: job.id,
      status: job.status,
      message: 'Reprocessing job enqueued',
    });
  } catch (error: any) {
    console.error('Reprocess error:', error);
    res.status(500).json({ error: 'Failed to reprocess track', message: error.message });
  }
});

export default router;
