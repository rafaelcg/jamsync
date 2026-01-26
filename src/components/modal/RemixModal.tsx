'use client';

import React, { useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import type { RemixModalProps } from '@/types';

export function RemixModal({ originalTrack, isOpen, onClose, onRemix }: RemixModalProps) {
  const [step, setStep] = useState<'select' | 'record' | 'edit' | 'processing'>('select');
  const [remixFile, setRemixFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection for remix
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please select an audio or video file');
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    // File would be set here
    setError(null);

    if (selectedFile.type.startsWith('video/')) {
      setPreview(URL.createObjectURL(selectedFile));
    }
    setStep('edit');
  }, []);

  // Start recording (placeholder for actual recording functionality)
  const handleStartRecording = useCallback(() => {
    // In production, this would open the device camera/microphone
    setStep('record');
  }, []);

  // Process and submit remix
  const handleSubmitRemix = useCallback(async () => {
    if (!originalTrack || !title.trim()) {
      setError('Please provide a title');
      return;
    }

    setStep('processing');
    setProcessingProgress(0);

    // Simulate processing stages
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const response = await api.tracks.remix(originalTrack.id, {
        title: title.trim(),
        audioUrl: 'https://example.com/remix.mp3',
        videoUrl: preview ? 'https://example.com/remix.mp4' : undefined,
        durationSeconds: 45,
      });

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (response.data && response.status === 200) {
        const remix = response.data as { id: string };
        setTimeout(() => {
          onRemix?.({ id: remix.id });
          handleClose();
        }, 500);
      } else {
        setError(response.error || 'Failed to create remix');
        setStep('edit');
      }
    } catch {
      clearInterval(progressInterval);
      setError('An unexpected error occurred');
      setStep('edit');
    }
  }, [originalTrack, title, preview, onRemix]);

  // Reset and close
  const handleClose = useCallback(() => {
    setStep('select');
    // Reset file
    setPreview(null);
    setTitle('');
    setProcessingProgress(0);
    setError(null);
    onClose();
  }, [onClose]);

  if (!isOpen || !originalTrack) return null;

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
            Create Remix
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
          {/* Original Track Info */}
          <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg mb-6">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0">
              {originalTrack.videoUrl && (
                <video src={originalTrack.videoUrl} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 dark:text-white line-clamp-1">
                {originalTrack.title}
              </p>
              <p className="text-sm text-neutral-500">
                @{originalTrack.user?.username}
              </p>
            </div>
          </div>

          {/* Step 1: Select Remix Type */}
          {step === 'select' && (
            <div className="space-y-4">
              <p className="text-neutral-600 dark:text-neutral-400 text-center mb-4">
                How would you like to remix this track?
              </p>

              <div className="grid gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">Upload Audio</p>
                    <p className="text-sm text-neutral-500">Add your own audio recording</p>
                  </div>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">Upload Video</p>
                    <p className="text-sm text-neutral-500">Record or upload a video performance</p>
                  </div>
                </button>

                <button
                  onClick={handleStartRecording}
                  className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">Record Now</p>
                    <p className="text-sm text-neutral-500">Record directly in the app</p>
                  </div>
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/mp4,video/webm"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          )}

          {/* Step 2: Record (Placeholder) */}
          {step === 'record' && (
            <div className="py-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Recording in progress...
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setStep('select')}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Simulate recording complete
                    setRemixFile(new File([''], 'recording.mp3'));
                    setStep('edit');
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Stop Recording
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Edit */}
          {step === 'edit' && (
            <div className="space-y-4">
              {preview ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
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
                  Remix Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Remix of ${originalTrack.title}`}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  maxLength={100}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    // Reset file
                    setStep('select');
                  }}
                  className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitRemix}
                  disabled={!title.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Remix
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Processing */}
          {step === 'processing' && (
            <div className="py-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                Processing your remix...
              </p>
              <div className="w-full max-w-xs mx-auto h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              <p className="text-sm text-neutral-500 mt-2">
                {processingProgress < 50 && 'Analyzing audio...'}
                {processingProgress >= 50 && processingProgress < 80 && 'Mixing tracks...'}
                {processingProgress >= 80 && processingProgress < 100 && 'Finalizing...'}
                {processingProgress === 100 && 'Done!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RemixModal;
