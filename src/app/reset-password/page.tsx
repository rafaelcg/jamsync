"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      setIsValidToken(true);
    } else {
      setIsValidToken(false);
    }
  }, [searchParams]);

  const validateForm = () => {
    let isValid = true;
    setPasswordError("");
    setConfirmPasswordError("");

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Invalid Reset Link</h1>
          <p className="text-neutral-400 mb-6">This password reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="text-primary-500 hover:text-primary-400 font-medium">
            Request a new password reset
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Password Reset</h1>
          <p className="text-neutral-400 mb-6">Your password has been successfully reset. You can now sign in with your new password.</p>
          <Link href="/login" className="inline-block py-3 px-6 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary-500 flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">JamSync</h1>
        <p className="text-neutral-400">Reset your password</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 bg-neutral-900 border rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 ${
                passwordError ? "border-red-500 focus:ring-red-500" : "border-neutral-800 focus:ring-primary-500"
              }`}
              placeholder="••••••••"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 bg-neutral-900 border rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 ${
                confirmPasswordError ? "border-red-500 focus:ring-red-500" : "border-neutral-800 focus:ring-primary-500"
              }`}
              placeholder="••••••••"
            />
            {confirmPasswordError && (
              <p className="mt-1 text-sm text-red-500">{confirmPasswordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <p className="mt-8 text-neutral-400 text-sm">
        Remember your password?{" "}
        <Link href="/login" className="text-primary-500 hover:text-primary-400 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
