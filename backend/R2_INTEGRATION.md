# Cloudflare R2 Storage Integration for JamSync

This document describes the Cloudflare R2 storage integration implemented for the JamSync backend.

## Overview

The JamSync backend now supports uploading media files (audio, video, and images) to Cloudflare R2 storage instead of local disk storage. R2 is S3-compatible, so we use the AWS SDK for S3 to interact with it.

## Features

- **S3-compatible API**: Uses `@aws-sdk/client-s3` for R2 interactions
- **Memory-based uploads**: Multer stores files in memory before uploading to R2
- **File validation**: Validates file types and sizes
- **Presigned URLs**: Support for generating signed URLs for private access
- **Public URL generation**: Automatic public URL generation for uploaded files
- **Configuration detection**: Graceful fallback when R2 is not configured

## Environment Variables

Add the following to your `.env` file:

```bash
# Cloudflare R2 Storage
R2_ENDPOINT="https://your-account-id.r2.dev"
R2_ACCESS_KEY_ID="your-access-key-id"
R2_SECRET_ACCESS_KEY="your-secret-access-key"
R2_BUCKET_NAME="jamsync-media"
R2_ACCOUNT_ID="your-account-id"
R2_PUBLIC_URL="https://your-bucket.your-domain.com"
```

### Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `R2_ENDPOINT` | R2 endpoint URL | Yes |
| `R2_ACCESS_KEY_ID` | R2 API token access key | Yes |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret | Yes |
| `R2_BUCKET_NAME` | R2 bucket name for media | Yes |
| `R2_ACCOUNT_ID` | Cloudflare account ID (for default public URLs) | No* |
| `R2_PUBLIC_URL` | Custom public URL for your bucket | No* |

*Either `R2_ACCOUNT_ID` or `R2_PUBLIC_URL` is required for public URL generation.

## Installation

The required packages are already installed:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## API Endpoints

### Upload Media File

**POST** `/api/v1/uploads/media`

Uploads a media file to R2 storage.

**Headers:**
- `Authorization: Bearer <token>`

**Form Data:**
- `file`: The file to upload (audio, video, or image)

**Response (201 Created):**
```json
{
  "url": "https://your-account-id.r2.dev/media/filename.mp3",
  "filename": "filename.mp3",
  "key": "media/filename.mp3",
  "mimetype": "audio/mpeg",
  "size": 1234567
}
```

**Response (500 Error - R2 not configured):**
```json
{
  "error": "Cloud storage not configured",
  "message": "R2 credentials are missing. Please configure R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in .env"
}
```

### Check Storage Status

**GET** `/api/v1/uploads/status`

Checks if R2 storage is configured.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "r2Configured": true,
  "provider": "cloudflare-r2"
}
```

## File Types Supported

- **Audio**: `audio/mpeg`, `audio/wav`, `audio/mp3`, `audio/ogg`, `audio/flac`
- **Video**: `video/mp4`, `video/webm`
- **Images**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`

**Maximum file size:** 100MB

## Usage with Track Creation

When creating a track, use the URL returned from the upload endpoint:

```javascript
// 1. Upload audio file
const audioUpload = await fetch('/api/v1/uploads/media', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData
});
const { url: audioUrl } = await audioUpload.json();

// 2. Upload cover image (optional)
const coverUpload = await fetch('/api/v1/uploads/media', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: coverFormData
});
const { url: coverUrl } = await coverUpload.json();

// 3. Create track record
await fetch('/api/v1/tracks', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My Track',
    audioUrl,
    coverUrl,
    genre: 'Electronic',
    isPublic: true
  })
});
```

## Programmatic Usage

### Import the storage service

```typescript
import {
  uploadToR2,
  getSignedDownloadUrl,
  getSignedUploadUrl,
  deleteFromR2,
  isR2Configured,
  extractKeyFromUrl,
  generatePublicUrl
} from '../services/r2Storage';
```

### Upload a file

```typescript
const result = await uploadToR2(file, {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedMimeTypes: ['audio/mpeg', 'audio/wav']
});

console.log(result.url);
console.log(result.key);
```

### Generate signed URL for private access

```typescript
// Generate a signed URL that expires in 1 hour
const signedUrl = await getSignedDownloadUrl('media/filename.mp3', 3600);
```

### Delete a file

```typescript
await deleteFromR2('media/filename.mp3');
```

## R2 Setup in Cloudflare Dashboard

1. **Create an R2 bucket:**
   - Go to Cloudflare Dashboard → R2
   - Click "Create bucket"
   - Enter bucket name (e.g., `jamsync-media`)
   - Choose region

2. **Create an API token:**
   - Go to R2 → Manage R2 API tokens
   - Click "Create API token"
   - Give it a name (e.g., `jamsync-backend`)
   - Grant permissions: Object Read/Write
   - Copy the Access Key ID and Secret Access Key

3. **Configure public access (optional):**
   - In bucket settings, enable public access
   - Or set up a Cloudflare Worker for custom domain

## Testing Without Real R2 Credentials

The integration includes a test script to verify the setup:

```bash
chmod +x test-r2.sh
./test-r2.sh
```

The script will:
1. Check server health
2. Test authentication
3. Verify R2 configuration status
4. Test file upload behavior

## Production Checklist

- [ ] Configure all required R2 environment variables
- [ ] Set up proper CORS rules on R2 bucket
- [ ] Enable public access or configure signed URLs
- [ ] Test file uploads with various file types
- [ ] Verify file retrieval works correctly
- [ ] Set up monitoring for upload failures
- [ ] Configure backup strategy for R2 data

## Troubleshooting

### "R2 credentials not configured" warning on startup

This means one or more required environment variables are missing. Check your `.env` file and ensure all required variables are set.

### Upload fails with SSL error

This usually indicates invalid credentials or endpoint URL. Verify your R2 endpoint URL and API credentials.

### Files not accessible after upload

1. Check if the bucket has public access enabled
2. Verify the public URL format in your configuration
3. Check R2 bucket CORS settings

### TypeScript errors in jobQueue.ts

Run `npm run prisma:generate` to regenerate the Prisma client after schema changes.
