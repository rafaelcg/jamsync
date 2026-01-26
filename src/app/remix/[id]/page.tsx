"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/layout";
import { api } from "@/lib/api";
import type { Track, UploadProgress } from "@/types";

export default function RemixPage() {
  const params = useParams();
  const router = useRouter();
  const trackId = params.id as string;

  const [step, setStep] = useState<'info' | 'select' | 'record' | 'details' | 'processing' | 'success'>('info');
  const [originalTrack, setOriginalTrack] = useState<Track | null>(null);
  const [remixFile, setRemixFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load original track
  useEffect(() => {
    if (trackId) {
      // In production, fetch from API
      setOriginalTrack({
        id: trackId,
        userId: '1',
        user: {
          id: '1',
          username: 'original_artist',
          displayName: 'Original Artist',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=original',
          followersCount: 10000,
          followingCount: 500,
          tracksCount: 25,
        },
        title: 'Original Track',
        audioUrl: '/demo.mp3',
        durationSeconds: 180,
        likesCount: 5000,
        commentsCount: 200,
        remixesCount: 15,
        createdAt: new Date().toISOString(),
      });
    }
  }, [trackId]);

  // Handle file selection
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

    setRemixFile(selectedFile);
    setError(null);

    if (selectedFile.type.startsWith('video/')) {
      setPreview(URL.createObjectURL(selectedFile));
    }
    setStep('details');
  }, []);

  // Start recording
  const handleStartRecording = useCallback(async (type: 'audio' | 'video') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: type === 'video' 
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const recordedFile = new File([blob], 'recording.webm');
        setRemixFile(recordedFile);
        setPreview(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        setStep('details');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      setError('Failed to access microphone/camera. Please check permissions.');
    }
  }, []);

  // Stop recording
  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingDuration(0);
    }
  }, []);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Submit remix
  const handleSubmitRemix = useCallback(async () => {
    if (!originalTrack || !remixFile || !title.trim()) {
      setError('Please provide a title');
      return;
    }

    setStep('processing');
    setProcessingProgress(0);

    // Simulate processing stages
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
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
        description: description.trim(),
        audioUrl: 'https://example.com/remix.mp3',
        videoUrl: preview ? 'https://example.com/remix.mp4' : undefined,
        durationSeconds: 180,
      });

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (response.data && response.status === 200) {
        setStep('success');
        setTimeout(() => {
          router.push(`/track/${originalTrack.id}`);
        }, 2000);
      } else {
        setError(response.error || 'Failed to create remix');
        setStep('details');
      }
    } catch {
      clearInterval(progressInterval);
      setError('An unexpected error occurred');
      setStep('details');
    }
  }, [originalTrack, remixFile, title, description, preview, router]);

  // Reset and start over
  const handleReset = useCallback(() => {
    setStep('select');
    setRemixFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setProcessingProgress(0);
    setError(null);
    setRecordingDuration(0);
  }, []);

  if (!originalTrack) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <TopBar
        title="Create Remix"
        leftAction={
          <button
            onClick={step === 'info' ? () => router.back() : () => setStep('select')}
            className="text-neutral-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        }
      />

      <div className="pt-14 pb-20 px-4 max-w-lg mx-auto">
        {/* Step 0: Show Original Track Info */}
        {step === 'info' && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <h1 className="text-2xl font-bold text-white mb-2">Create a Remix</h1>
              <p className="text-neutral-400">Put your spin on this track</p>
            </div>

            {/* Original Track Card */}
            <div className="p-4 bg-neutral-900 rounded-xl">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-primary-500 to-purple-600 flex-shrink-0">
                  {originalTrack.videoUrl ? (
                    <video src={originalTrack.videoUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v18a9 9 0 1 0-9-9c2.52 0 4.93 1.15 6.66 3.05a9.01 9.01 0 0 0 2.34 4.55 9 9 0 0 0 0-17.6z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{originalTrack.title}</h3>
                  <p className="text-neutral-400">@{originalTrack.user.username}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-neutral-500">
                    <span>❤️ {originalTrack.likesCount}</span>
                    <span>🔄 {originalTrack.remixesCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('select')}
              className="w-full py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
            >
              Start Remixing
            </button>
          </div>
        )}

        {/* Step 1: Select Remix Type */}
        {step === 'select' && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <h2 className="text-xl font-bold text-white mb-2">How do you want to remix?</h2>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Upload Audio</p>
                  <p className="text-sm text-neutral-400">Add your own audio recording</p>
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Upload Video</p>
                  <p className="text-sm text-neutral-400">Record or upload a video performance</p>
                </div>
              </button>

              <button
                onClick={() => handleStartRecording('audio')}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Record Audio</p>
                  <p className="text-sm text-neutral-400">Record your voice or instrument</p>
                </div>
              </button>

              <button
                onClick={() => handleStartRecording('video')}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Record Video</p>
                  <p className="text-sm text-neutral-400">Record yourself performing</p>
                </div>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,video/mp4,video/webm"
              className="hidden"
              onChange={handleFileSelect}
            />

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Recording State */}
        {isRecording && (
          <div className="text-center py-12">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                <span className="text-2xl font-mono text-white">{formatRecordingTime(recordingDuration)}</span>
              </div>
            </div>
            <p className="text-neutral-400 mb-6">Recording...</p>
            <button
              onClick={handleStopRecording}
              className="px-8 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
            >
              Stop Recording
            </button>
          </div>
        )}

        {/* Step 2: Edit Details */}
        {step === 'details' && remixFile && (
          <div className="space-y-6">
            {/* Preview */}
            {preview ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                <video src={preview} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <svg className="w-20 h-20 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v18a9 9 0 1 0-9-9c2.52 0 4.93 1.15 6.66 3.05a9.01 9.01 0 0 0 2.34 4.55 9 9 0 0 0 0-17.6z" />
                </svg>
              </div>
            )}

            {/* Original Track Reference */}
            <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">Remix of {originalTrack.title}</p>
                <p className="text-sm text-neutral-400">@{originalTrack.user.username}</p>
              </div>
              <button
                onClick={handleReset}
                className="p-2 text-neutral-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Remix Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Remix of ${originalTrack.title}`}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell listeners about your remix..."
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  maxLength={500}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-neutral-800 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRemix}
                disabled={!title.trim()}
                className="flex-1 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Remix
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-500/20 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Processing your remix...</h2>
            <p className="text-neutral-400 mb-6">Mixing your creation with the original</p>
            
            <div className="w-full max-w-xs mx-auto">
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              <p className="text-sm text-neutral-400 mt-2">
                {processingProgress < 30 && 'Analyzing audio tracks...'}
                {processingProgress >= 30 && processingProgress < 60 && 'Mixing tracks...'}
                {processingProgress >= 60 && processingProgress < 90 && 'Applying effects...'}
                {processingProgress >= 90 && 'Finalizing...'}
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Remix Created!</h2>
            <p className="text-neutral-400 mb-6">Your remix has been published</p>
            <p className="text-sm text-neutral-500">Redirecting to track page...</p>
          </div>
        )}
      </div>
    </div>
  );
}
