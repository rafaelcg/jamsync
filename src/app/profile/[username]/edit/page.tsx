"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { TopBar } from "@/components/layout";
import { Avatar, Button, Input } from "@/components/ui";

export default function EditProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement API call to update profile
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    window.location.href = `/@${username}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <TopBar title="Edit Profile" />
      <div className="pt-20 px-4 max-w-md mx-auto">
        <div className="text-center mb-8">
          <Avatar size="xl" />
          <Button variant="ghost" className="mt-2">Change Photo</Button>
        </div>
        
        <Input label="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea className="w-full p-3 border rounded-lg" rows={4} value={bio} onChange={e => setBio(e.target.value)} />
        </div>
        
        <Button onClick={handleSave} isLoading={saving} className="w-full mt-6">Save Changes</Button>
      </div>
    </div>
  );
}
