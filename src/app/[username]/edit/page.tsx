"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/layout";

export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
  );
  const [formData, setFormData] = useState({
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    username: username.replace("@", ""),
    bio: "Music creator on JamSync 🎵",
    website: "",
    twitter: "",
    instagram: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, avatar: "Image must be less than 5MB" }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    router.push(`/${username}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <TopBar
        title="Edit Profile"
        leftAction={
          <button
            onClick={() => router.back()}
            className="text-neutral-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        }
        rightAction={
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="text-primary-500 font-semibold hover:text-primary-400 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        }
      />

      <div className="pt-14 pb-20 px-4 max-w-lg mx-auto">
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-neutral-800 border-4 border-primary-500">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <label
              htmlFor="avatar"
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarSelect}
            />
          </div>
          {errors.avatar && (
            <p className="mt-2 text-sm text-red-500">{errors.avatar}</p>
          )}
          <p className="mt-3 text-sm text-neutral-400">Tap to change photo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-neutral-900 border rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 ${
                errors.displayName ? "border-red-500 focus:ring-red-500" : "border-neutral-800 focus:ring-primary-500"
              }`}
              placeholder="Your name"
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-500">{errors.displayName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">@</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-8 pr-4 py-3 bg-neutral-900 border rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 ${
                  errors.username ? "border-red-500 focus:ring-red-500" : "border-neutral-800 focus:ring-primary-500"
                }`}
                placeholder="username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Tell people about yourself..."
              maxLength={150}
            />
            <p className="mt-1 text-xs text-neutral-500 text-right">
              {formData.bio.length}/150
            </p>
          </div>

          {/* Social Links */}
          <div className="pt-4">
            <h3 className="text-sm font-semibold text-neutral-400 mb-4">Social Links</h3>
            
            <div className="space-y-4">
              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              {/* Twitter */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Twitter
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">@</span>
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="username"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Instagram
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">@</span>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
