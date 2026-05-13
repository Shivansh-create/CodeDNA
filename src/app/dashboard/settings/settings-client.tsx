"use client";

import { useState } from "react";

export default function SettingsClient({ user }: { user: any }) {
  const [isPublicProfile, setIsPublicProfile] = useState(Boolean(user.isPublicProfile));
  const [allowSeoIndexing, setAllowSeoIndexing] = useState(Boolean(user.allowSeoIndexing));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublicProfile, allowSeoIndexing }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to save settings");
      }

      setMessage("Settings saved successfully.");
    } catch (error: any) {
      setMessage(error.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass p-8 rounded-3xl border border-white/10">
        <h1 className="text-3xl font-bold mb-4">Profile Settings</h1>
        <p className="text-zinc-400 mb-8">
          Manage your public profile visibility and SEO indexing preferences. These settings are stored instantly and will affect how your CodeDNA profile is shared.
        </p>

        <div className="space-y-6">
          <label className="flex items-center justify-between gap-4 p-6 rounded-3xl border border-white/10 bg-white/5">
            <div>
              <p className="font-semibold">Public Profile</p>
              <p className="text-sm text-zinc-500">Allow your profile to be visible to anyone with the profile link.</p>
            </div>
            <input
              type="checkbox"
              checked={isPublicProfile}
              onChange={(event) => setIsPublicProfile(event.target.checked)}
              className="h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between gap-4 p-6 rounded-3xl border border-white/10 bg-white/5">
            <div>
              <p className="font-semibold">Allow SEO Indexing</p>
              <p className="text-sm text-zinc-500">Permit search engines to index your public profile page.</p>
            </div>
            <input
              type="checkbox"
              checked={allowSeoIndexing}
              onChange={(event) => setAllowSeoIndexing(event.target.checked)}
              className="h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-indigo-500"
            />
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-zinc-400">Current GitHub username</p>
              <p className="font-medium">{user.githubUsername || "Not connected"}</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-zinc-700"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
          {message && (
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-zinc-100">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
