'use client';

import React, { useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import type { UploadModalProps, UploadProgress } from '@/types';

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [step, setStep] = useState<'select' | 'upload' | 'details' | 'processing'>('select');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percentage: 0 });
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please select an audio or video file (MP3, WAV, MP4, MOV)');
      return;
    }

    // Validate file size (max 100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Generate preview
    if (selectedFile.type.startsWith('video/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }

    setStep('details');
  }, []);

  // Handle upload
  const handleUpload = useCallback(async () => {
    if (!file || !title.trim()) {
      setError('Please provide a title');
      return;
    }

    setStep('processing');

    try {
      // For demo, we'll create a track with metadata
      // In production, this would upload the file to S3
      const response = await api.tracks.create({
        title: title.trim(),
        description: description.trim(),
        // These would be the S3 URLs after upload
        audioUrl: 'https://example.com/audio.mp3',
        videoUrl: preview ? 'https://example.com/video.mp4' : undefined,
        durationSeconds: 45, // Would be extracted from file
      });

      if (response.data && response.status === 200) {
        const track = response.data as { id: string };
        onUpload?.({ id: track.id });
        handleClose();
      } else {
        setError(response.error || 'Upload failed');
        setStep('details');
      }
    } catch {
      setError('An unexpected error occurred');
      setStep('details');
    }
  }, [file, title, description, preview, onUpload]);

  // Reset and close
  const handleClose = useCallback(() => {
    setStep('select');
    setFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
    setError(null);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {step === 'select' && 'Upload Track'}
            {step === 'details' && 'Track Details'}
            {step === 'processing' && 'Uploading...'}
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: File Selection */}
          {step === 'select' && (
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl p-12 text-center hover:border-indigo-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-sm text-neutral-400">
                  MP3, WAV, MP4, MOV (max 100MB)
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={handleFileSelect}
              />

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Details */}
          {step === 'details' && file && (
            <div className="space-y-4">
              {/* Preview */}
              {preview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                  <video src={preview} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v18a9 9 0 1 0-9-9c2.52 0 4.93 1.15 6.66 3.05a9.01 9.01 0 0 0 2.34 4.55 9 9 0 0 0 0-17.6z" />
                  </svg>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your track a name"
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell listeners about your track..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  maxLength={500}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setFile(null);
                    setStep('select');
                  }}
                  className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!title.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Upload
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="py-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                Uploading your track...
              </p>
              <div className="w-full max-w-xs mx-auto h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
              <p className="text-sm text-neutral-500 mt-2">
                {uploadProgress.percentage}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
