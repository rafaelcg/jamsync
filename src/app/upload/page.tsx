"use client";

import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout";
import { api } from "@/lib/api";
import type { UploadProgress, Track } from "@/types";

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<'select' | 'record' | 'details' | 'processing' | 'success'>('select');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percentage: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please select an audio or video file (MP3, WAV, MP4, MOV)');
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    if (selectedFile.type.startsWith('video/')) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }

    setStep('details');
  }, []);

  // Start recording audio/video
  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: selectedFileType === 'video' 
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: selectedFileType === 'video' ? 'video/webm' : 'audio/webm' });
        const recordedFile = new File([blob], `recording.${selectedFileType === 'video' ? 'webm' : 'webm'}`);
        setFile(recordedFile);
        if (selectedFileType === 'video') {
          setPreview(URL.createObjectURL(blob));
        }
        stream.getTracks().forEach(track => track.stop());
        setStep('details');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      // Start duration counter
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

  const [selectedFileType, setSelectedFileType] = useState<'audio' | 'video'>('audio');

  // Handle upload
  const handleUpload = useCallback(async () => {
    if (!file || !title.trim()) {
      setError('Please provide a title');
      return;
    }

    setStep('processing');
    setUploadProgress({ loaded: 0, total: 0, percentage: 0 });

    try {
      // Smooth progress simulation: 2-3 seconds with staggered 100ms updates
      const totalDuration = 2500; // 2.5 seconds
      const updateInterval = 100; // Update every 100ms
      const steps = totalDuration / updateInterval;
      const progressPerStep = 100 / steps;

      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += progressPerStep;
        // Add slight randomness for realistic feel (0.5% to 1.5% variance)
        const randomVariance = Math.random() * 1 + 0.5;
        const nextProgress = Math.min(currentProgress + randomVariance, 95);
        
        setUploadProgress(prev => ({
          ...prev,
          percentage: Math.round(nextProgress)
        }));
      }, updateInterval);

      // In production, this would upload to S3/R2 and create track in database
      const response = await api.tracks.create({
        title: title.trim(),
        description: description.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        audioUrl: 'https://example.com/audio.mp3',
        videoUrl: preview ? 'https://example.com/video.mp4' : undefined,
        durationSeconds: 180, // Would be extracted from file
      });

      // Ensure progress reaches 100% before showing success
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, percentage: 100 }));

      // Small delay to let the 100% show before success state
      await new Promise(resolve => setTimeout(resolve, 300));

      if (response.data && response.status === 200) {
        setStep('success');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(response.error || 'Upload failed');
        setStep('details');
      }
    } catch {
      setError('An unexpected error occurred');
      setStep('details');
    }
  }, [file, title, description, tags, preview, router]);

  // Reset and start over
  const handleReset = useCallback(() => {
    setStep('select');
    setFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setTags('');
    setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
    setError(null);
    setRecordingDuration(0);
  }, []);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <TopBar
        title="Upload"
        leftAction={
          <button
            onClick={step === 'select' ? () => router.back() : () => setStep('select')}
            className="text-neutral-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        }
      />

      <div className="pt-14 pb-20 px-4 max-w-lg mx-auto">
        {/* Step 1: Select Source */}
        {step === 'select' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-white mb-2">Upload Your Track</h1>
              <p className="text-neutral-400">Share your music with the world</p>
            </div>

            {/* Recording Options */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSelectedFileType('audio');
                  handleStartRecording();
                }}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Record Audio</p>
                  <p className="text-sm text-neutral-400">Record your voice or instrument</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedFileType('video');
                  handleStartRecording();
                }}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Record Video</p>
                  <p className="text-sm text-neutral-400">Record yourself performing</p>
                </div>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-neutral-950 text-neutral-500">or</span>
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Upload File</p>
                  <p className="text-sm text-neutral-400">MP3, WAV, MP4, MOV (max 100MB)</p>
                </div>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,video/mp4,video/webm,video/quicktime"
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

        {/* Step 2: Track Details */}
        {step === 'details' && file && (
          <div className="space-y-6">
            {/* Preview */}
            {preview ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                <video src={preview} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <svg className="w-20 h-20 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v18a9 9 0 1 0-9-9c2.52 0 4.93 1.15 6.66 3.05a9.01 9.01 0 0 0 2.34 4.55 9 9 0 0 0 0-17.6z" />
                </svg>
              </div>
            )}

            {/* File Info */}
            <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{file.name}</p>
                <p className="text-sm text-neutral-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
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
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your track a name"
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
                  placeholder="Tell listeners about your track..."
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="hiphop, chill, beats (comma separated)"
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                onClick={handleUpload}
                disabled={!title.trim()}
                className="flex-1 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Upload Track
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
            <h2 className="text-xl font-bold text-white mb-2">Uploading...</h2>
            <p className="text-neutral-400 mb-6">Your track is being uploaded to the cloud</p>
            
            <div className="w-full max-w-xs mx-auto">
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
              <p className="text-sm text-neutral-400 mt-2 font-mono">{uploadProgress.percentage}%</p>
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
            <h2 className="text-xl font-bold text-white mb-2">Upload Complete!</h2>
            <p className="text-neutral-400 mb-6">Your track has been uploaded successfully</p>
            <p className="text-sm text-neutral-500">Redirecting to home...</p>
          </div>
        )}
      </div>
    </div>
  );
}
