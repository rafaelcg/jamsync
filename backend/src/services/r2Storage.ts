import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Configuration
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

// Validate required environment variables
if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.warn('⚠️  R2 credentials not configured. Using local storage fallback.');
}

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT || 'https://your-r2-account.r2.dev',
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
});

export interface UploadResult {
  url: string;
  filename: string;
  key: string;
  mimetype: string;
  size: number;
}

export interface StorageConfig {
  maxFileSize?: number; // in bytes
  allowedMimeTypes?: string[];
}

// Default configuration
export const DEFAULT_CONFIG: StorageConfig = {
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedMimeTypes: [
    'audio/mpeg',
    'audio/wav',
    'audio/mp3',
    'audio/ogg',
    'audio/flac',
    'video/mp4',
    'video/webm',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
};

/**
 * Check if R2 is properly configured
 */
export function isR2Configured(): boolean {
  return !!(R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);
}

/**
 * Generate a unique filename for uploads
 */
function generateFilename(originalName: string): string {
  const ext = getFileExtension(originalName);
  return `${uuidv4()}${ext}`;
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop();
  return ext ? `.${ext}` : '';
}

/**
 * Check if file type is allowed
 */
function isFileAllowed(mimetype: string, config: StorageConfig): boolean {
  return config.allowedMimeTypes?.includes(mimetype) || false;
}

/**
 * Upload a file to R2 storage
 */
export async function uploadToR2(
  file: Express.Multer.File,
  config: StorageConfig = DEFAULT_CONFIG
): Promise<UploadResult> {
  if (!isR2Configured()) {
    throw new Error('R2 storage is not configured');
  }

  // Validate file
  if (!file) {
    throw new Error('No file provided');
  }

  if (!isFileAllowed(file.mimetype, config)) {
    throw new Error(`File type ${file.mimetype} is not allowed`);
  }

  if (file.size > (config.maxFileSize || DEFAULT_CONFIG.maxFileSize)) {
    throw new Error('File size exceeds maximum allowed size');
  }

  // Generate unique filename
  const filename = generateFilename(file.originalname);
  const key = `media/${filename}`;

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    CacheControl: 'public, max-age=31536000', // 1 year cache
  });

  await s3Client.send(command);

  // Generate public URL
  const url = generatePublicUrl(key);

  return {
    url,
    filename,
    key,
    mimetype: file.mimetype,
    size: file.size,
  };
}

/**
 * Generate a signed URL for private file access
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  if (!isR2Configured()) {
    throw new Error('R2 storage is not configured');
  }

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return signedUrl;
}

/**
 * Generate a signed URL for upload (presigned POST)
 */
export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  if (!isR2Configured()) {
    throw new Error('R2 storage is not configured');
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return signedUrl;
}

/**
 * Delete a file from R2 storage
 */
export async function deleteFromR2(key: string): Promise<void> {
  if (!isR2Configured()) {
    throw new Error('R2 storage is not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Check if a file exists in R2
 */
export async function fileExistsInR2(key: string): Promise<boolean> {
  if (!isR2Configured()) {
    return false;
  }

  try {
    const command = new HeadObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Generate public URL for a file
 */
export function generatePublicUrl(key: string): string {
  // If custom public URL is configured, use it
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${key}`;
  }

  // Otherwise, use R2's public URL format
  // R2_ACCOUNT_ID.r2.dev is the default public endpoint
  const accountId = process.env.R2_ACCOUNT_ID || 'your-account-id';
  return `https://${accountId}.r2.dev/${key}`;
}

/**
 * Extract key from R2 URL
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // Remove leading slash
  } catch (error) {
    return null;
  }
}
