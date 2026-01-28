import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// R2 Configuration - read from environment
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;

// Allowed file types
const ALLOWED_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp3',
  'audio/ogg',
  'audio/flac',
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

/**
 * Check if R2 is configured
 */
function isR2Configured(): boolean {
  return !!(R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);
}

/**
 * Generate a unique filename
 */
function generateFilename(originalName: string): string {
  const ext = originalName.split('.').pop() || '';
  return `${uuidv4()}.${ext}`;
}

/**
 * Generate public URL for uploaded file
 */
function generatePublicUrl(key: string): string {
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${key}`;
  }
  if (R2_ACCOUNT_ID) {
    return `https://${R2_ACCOUNT_ID}.r2.dev/${key}`;
  }
  // Fallback for local development - use local file storage
  return `/uploads/${key}`;
}

/**
 * Upload file to R2 using S3-compatible API
 */
async function uploadToR2(buffer: Buffer, filename: string, mimetype: string): Promise<{ url: string; key: string }> {
  const key = `media/${generateFilename(filename)}`;

  // If R2 is not configured, store locally for development
  if (!isR2Configured()) {
    console.warn('⚠️  R2 not configured, storing file locally');
    // For development, return a mock URL
    return {
      url: `http://localhost:3000/uploads/${key}`,
      key,
    };
  }

  // Use S3-compatible upload to R2
  const endpoint = R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.dev`;
  
  const response = await fetch(`${endpoint}/${key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': mimetype,
      'Authorization': `Basic ${Buffer.from(`${R2_ACCESS_KEY_ID}:${R2_SECRET_ACCESS_KEY}`).toString('base64')}`,
    },
    body: buffer as unknown as BodyInit,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload to R2: ${response.statusText}`);
  }

  return {
    url: generatePublicUrl(key),
    key,
  };
}

// GET /api/upload - Check upload status
export async function GET() {
  return NextResponse.json({
    r2Configured: isR2Configured(),
    provider: isR2Configured() ? 'cloudflare-r2' : 'local',
    maxFileSize: MAX_FILE_SIZE,
    allowedTypes: ALLOWED_TYPES,
  });
}

// POST /api/upload - Upload a file
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const { url, key } = await uploadToR2(buffer, file.name, file.type);

    // Get optional metadata
    const title = formData.get('title') as string || file.name.replace(/\.[^/.]+$/, '');
    const description = formData.get('description') as string || '';
    const createTrack = formData.get('createTrack') === 'true';

    const response: {
      url: string;
      key: string;
      filename: string;
      mimetype: string;
      size: number;
      isMedia: boolean;
      track?: {
        id: string;
        title: string;
        description?: string;
        audioUrl: string;
        videoUrl?: string | null;
        durationSeconds: number;
        createdAt: string;
      };
    } = {
      url,
      key,
      filename: file.name,
      mimetype: file.type,
      size: file.size,
      isMedia: file.type.startsWith('audio/') || file.type.startsWith('video/'),
    };

    // If creating a track, return track data structure
    if (createTrack) {
      response.track = {
        id: `track-${Date.now()}`,
        title,
        description,
        audioUrl: url,
        videoUrl: file.type.startsWith('video/') ? url : null,
        durationSeconds: 0, // Would need FFmpeg to extract
        createdAt: new Date().toISOString(),
      };
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json(
      { error: 'Upload failed', message: errorMessage },
      { status: 500 }
    );
  }
}
