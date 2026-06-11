"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

type SettingsFormProps = {
  profile: {
    name: string;
    email: string;
    avatarUrl: string;
  };
  preferences: {
    targetRole: string;
    preferredLocation: string;
    experienceLevel: "Student" | "Fresher" | "Junior" | "Mid-level";
    linkedinUrl: string;
    portfolioUrl: string;
  };
  connections: {
    githubUsername: string | null;
  };
  usage: {
    currentPlan: string;
    aiCreditsUsed: number;
    resumeAnalysesCount: number;
  };
};

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

export function SettingsForm({
  profile,
  preferences,
  connections,
  usage,
}: SettingsFormProps) {
  const [targetRole, setTargetRole] = useState(preferences.targetRole);
  const [preferredLocation, setPreferredLocation] = useState(
    preferences.preferredLocation,
  );
  const [experienceLevel, setExperienceLevel] = useState(
    preferences.experienceLevel,
  );
  const [linkedinUrl, setLinkedinUrl] = useState(preferences.linkedinUrl);
  const [portfolioUrl, setPortfolioUrl] = useState(preferences.portfolioUrl);
  const [toast, setToast] = useState<ToastState>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    setToast(null);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetRole,
          preferredLocation,
          experienceLevel,
          linkedinUrl,
          portfolioUrl,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Could not save settings.");
      }

      setToast({
        type: "success",
        message: "Preferences saved.",
      });
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error ? error.message : "Could not save settings.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-5 pb-8">
      {toast ? (
        <div
          className={`rounded-[18px] border px-4 py-3 text-sm ${
            toast.type === "success"
              ? "border-[rgba(214,173,96,0.2)] bg-[rgba(214,173,96,0.08)] text-[#FAF3E0]"
              : "border-[rgba(192,132,87,0.22)] bg-[rgba(192,132,87,0.08)] text-[#FAF3E0]"
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <p className="mt-1 text-sm text-[#D6D3D1]">
          Your account identity and Clerk-managed profile details.
        </p>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border border-[rgba(250,243,224,0.08)] object-cover"
            />
            <div>
              <p className="font-medium text-white">{profile.name}</p>
              <p className="mt-1 text-sm text-[#D6D3D1]">{profile.email}</p>
            </div>
          </div>
          <Link
            href="/user-profile"
            className="inline-flex items-center justify-center rounded-full bg-[#C08457] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#D6AD60]"
          >
            Manage account
          </Link>
        </div>
      </section>

      <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <h2 className="text-lg font-semibold text-white">Resume Preferences</h2>
        <p className="mt-1 text-sm text-[#D6D3D1]">
          Save the defaults you want the analyzer to use most often.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[#FAF3E0]">Target role</span>
            <input
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              placeholder="Frontend Engineer"
              className={inputClassName}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-[#FAF3E0]">
              Preferred job location
            </span>
            <input
              value={preferredLocation}
              onChange={(event) => setPreferredLocation(event.target.value)}
              placeholder="Bengaluru, Remote, Pune..."
              className={inputClassName}
            />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-[#FAF3E0]">
              Experience level
            </span>
            <select
              value={experienceLevel}
              onChange={(event) =>
                setExperienceLevel(
                  event.target.value as SettingsFormProps["preferences"]["experienceLevel"],
                )
              }
              className={inputClassName}
            >
              <option>Student</option>
              <option>Fresher</option>
              <option>Junior</option>
              <option>Mid-level</option>
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[#C08457] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#D6AD60] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save preferences"}
        </button>
      </section>

      <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <h2 className="text-lg font-semibold text-white">Connected Accounts</h2>
        <p className="mt-1 text-sm text-[#D6D3D1]">
          Current connection status across GitHub and portfolio surfaces.
        </p>

        <div className="mt-5 grid gap-4">
          <div className="rounded-[18px] bg-[#221e1d] px-4 py-4">
            <p className="text-sm font-medium text-[#FAF3E0]">GitHub</p>
            <p className="mt-2 text-sm text-[#D6D3D1]">
              {connections.githubUsername
                ? `Connected as @${connections.githubUsername}`
                : "No GitHub account connected yet"}
            </p>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[#FAF3E0]">LinkedIn URL</span>
            <input
              value={linkedinUrl}
              onChange={(event) => setLinkedinUrl(event.target.value)}
              placeholder="https://linkedin.com/in/username"
              className={inputClassName}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[#FAF3E0]">Portfolio URL</span>
            <input
              value={portfolioUrl}
              onChange={(event) => setPortfolioUrl(event.target.value)}
              placeholder="https://yourportfolio.com"
              className={inputClassName}
            />
          </label>
        </div>
      </section>

      <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <h2 className="text-lg font-semibold text-white">Plan & Usage</h2>
        <p className="mt-1 text-sm text-[#D6D3D1]">
          Current plan status and the usage data already recorded in your workspace.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <UsageCard label="Current plan" value={usage.currentPlan} />
          <UsageCard label="AI credits used" value={`${usage.aiCreditsUsed}`} />
          <UsageCard
            label="Resume analyses"
            value={`${usage.resumeAnalysesCount}`}
          />
        </div>

        <a
          href="/pricing"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[#C08457] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#D6AD60]"
        >
          Upgrade to Pro
        </a>
      </section>

      <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <h2 className="text-lg font-semibold text-white">Danger Zone</h2>
        <p className="mt-1 text-sm text-[#D6D3D1]">
          Sensitive actions stay gated until the full destructive flow is implemented.
        </p>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={() =>
              setToast({
                type: "error",
                message: "Delete account flow is not enabled yet.",
              })
            }
            className="flex items-center gap-3 rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] px-4 py-3 text-left text-sm text-[#D6D3D1]"
          >
            <AlertTriangle className="h-4 w-4 text-[#D6AD60]" />
            Delete account placeholder
          </button>

          <button
            type="button"
            onClick={() =>
              setToast({
                type: "error",
                message: "Clear saved analyses flow is not enabled yet.",
              })
            }
            className="flex items-center gap-3 rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] px-4 py-3 text-left text-sm text-[#D6D3D1]"
          >
            <Trash2 className="h-4 w-4 text-[#D6AD60]" />
            Clear saved analyses placeholder
          </button>
        </div>
      </section>
    </div>
  );
}

function UsageCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-[#221e1d] px-4 py-4">
      <p className="text-sm text-[#D6D3D1]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#FAF3E0]">{value}</p>
    </div>
  );
}

const inputClassName =
  "h-12 w-full rounded-[16px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] px-4 text-sm text-white outline-none transition placeholder:text-[#8f887f] focus:border-[#C08457]";
