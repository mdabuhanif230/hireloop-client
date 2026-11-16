"use client"

import { FileTextIcon, XIcon } from "lucide-react"
import { useRef, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { authClient } from "@/lib/auth-client"
import { patchJson, useApi } from "@/hooks/use-api"
import { formatMegabytes, formatRelativeTime } from "@/lib/seeker/format"
import type { ProfilePatch, SeekerProfile } from "@/lib/seeker/types"
import { cn } from "cn"

import { PageHeader } from "../_components/page-header"
import { Panel } from "../_components/panel"
import { ErrorState, RowsSkeleton } from "../_components/states"
import { NotificationActions, Topbar } from "../_components/topbar"

const INPUT_CLASS = "h-11 rounded-lg bg-black/30!"

const PRIMARY_BUTTON_CLASS =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 outline-none disabled:pointer-events-none disabled:opacity-50"

const SECONDARY_BUTTON_CLASS =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white/5 px-4 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50 outline-none disabled:pointer-events-none disabled:opacity-50"

const FIELD_LABEL_CLASS = "text-sm font-medium text-zinc-200"
const MAX_AVATAR_BYTES = 5 * 1024 * 1024

type Notice = {
  scope: "profile" | "resume" | "details"
  tone: "ok" | "error"
  text: string
}

/** /deshboard/seeker/settings — profile, resume and professional details.
 *  The form reads GET /api/seeker/profile (seeded from the signed-in
 *  better-auth user) and writes back with PATCH; each card reports its own
 *  result so a failed save never looks like a successful one. */
export default function SeekerSettingsPage() {
  const { data, loading, error, refetch } = useApi<SeekerProfile>(
    "/api/seeker/profile"
  )

  return (
    <>
      <Topbar actions={<NotificationActions />} />

      <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Settings"
          description="Manage your account details and professional profile."
        />

        {loading && !data ? (
          <RowsSkeleton rows={2} height={320} />
        ) : error || !data ? (
          <ErrorState
            message={error ?? "We couldn't load your profile."}
            onRetry={refetch}
          />
        ) : (
          <SettingsForm profile={data} />
        )}
      </div>
    </>
  )
}

/** Owns the form state. It starts from the profile the page fetched and then
 *  tracks its own edits, so a later refetch never clobbers what the user is
 *  typing mid-form. */
function SettingsForm({ profile }: { profile: SeekerProfile }) {
  const [form, setForm] = useState(profile)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [skillDraft, setSkillDraft] = useState("")

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  function update(patch: Partial<SeekerProfile>) {
    setForm((current) => (current ? { ...current, ...patch } : current))
  }

  async function save(scope: Notice["scope"], patch: ProfilePatch) {
    setNotice({ scope, tone: "ok", text: "Saving…" })
    try {
      const saved = await patchJson<SeekerProfile>("/api/seeker/profile", patch)
      setForm(saved)
      setNotice({ scope, tone: "ok", text: "Saved." })
    } catch {
      setNotice({
        scope,
        tone: "error",
        text: "Couldn't save your changes. Please try again.",
      })
    }
  }

  async function onResetPassword() {
    if (!form) return
    try {
      const { error: resetError } = await authClient.requestPasswordReset({
        email: form.email,
      })
      if (resetError) throw new Error(resetError.message)
      setNotice({
        scope: "profile",
        tone: "ok",
        text: `Reset link sent to ${form.email}.`,
      })
    } catch {
      setNotice({
        scope: "profile",
        tone: "error",
        text: "Couldn't send the reset link — check the address and try again.",
      })
    }
  }

  function onAvatarPicked(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || !form) return

    if (file.size > MAX_AVATAR_BYTES) {
      setNotice({
        scope: "profile",
        tone: "error",
        text: "That image is over 5MB — pick a smaller one.",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () =>
      void save("profile", { avatarUrl: String(reader.result) })
    reader.onerror = () =>
      setNotice({
        scope: "profile",
        tone: "error",
        text: "Couldn't read that image. Please try another.",
      })
    reader.readAsDataURL(file)
  }

  function onResumePicked(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    void save("resume", {
      resume: {
        fileName: file.name,
        updatedAt: new Date().toISOString(),
        sizeMb: file.size / (1024 * 1024),
      },
    })
  }

  function addSkill() {
    if (!form) return
    const skill = skillDraft.trim()
    if (!skill) return
    if (
      form.skills.some(
        (existing) => existing.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setSkillDraft("")
      return
    }
    setSkillDraft("")
    update({ skills: [...form.skills, skill] })
  }

  const initials =
    form.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "HL"

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Profile information */}
      <Panel className="flex flex-col gap-6 p-6 lg:col-span-2">
        <h2 className="text-lg font-semibold tracking-[-0.01em]">
          Profile Information
        </h2>

        <div className="flex flex-wrap items-center gap-5">
          <Avatar className="size-[84px] ring-1 ring-white/15">
            {form.avatarUrl ? (
              <AvatarImage src={form.avatarUrl} alt={form.name} />
            ) : null}
            <AvatarFallback className="bg-[#26262b] text-xl font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className={SECONDARY_BUTTON_CLASS}
            >
              Change Avatar
            </button>
            <p className="text-xs text-muted-foreground">
              JPG, GIF or PNG. Max size of 5MB.
            </p>
          </div>

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif"
            onChange={onAvatarPicked}
            className="hidden"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={FIELD_LABEL_CLASS}>Full Name</span>
            <Input
              value={form.name}
              onChange={(event) => update({ name: event.target.value })}
              className={INPUT_CLASS}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={FIELD_LABEL_CLASS}>Email Address</span>
            <Input
              type="email"
              value={form.email}
              onChange={(event) => update({ email: event.target.value })}
              className={INPUT_CLASS}
            />
          </label>
        </div>

        <NoticeBar notice={notice} scope="profile" />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              save("profile", { name: form.name, email: form.email })
            }
            className={PRIMARY_BUTTON_CLASS}
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={onResetPassword}
            className={SECONDARY_BUTTON_CLASS}
          >
            Reset Password
          </button>
        </div>
      </Panel>

      {/* Resume */}
      <Panel className="flex flex-col gap-5 p-6">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.01em]">Resume</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Upload your most recent resume to enable one-click applications.
          </p>
        </div>

        {form.resume ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-black/20 px-4 py-6 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-white/5">
              <FileTextIcon className="size-5 text-zinc-300" aria-hidden />
            </span>
            <div>
              <p className="truncate text-sm font-medium text-zinc-100">
                {form.resume.fileName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Last updated {formatRelativeTime(form.resume.updatedAt)} •{" "}
                {formatMegabytes(form.resume.sizeMb)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-black/20 px-4 py-8 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-white/5">
              <FileTextIcon className="size-5 text-zinc-300" aria-hidden />
            </span>
            <p className="text-sm text-muted-foreground">
              No resume on file yet.
            </p>
          </div>
        )}

        <input
          ref={resumeInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={onResumePicked}
          className="hidden"
        />

        <NoticeBar notice={notice} scope="resume" />

        <div className="mt-auto flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => resumeInputRef.current?.click()}
            className={SECONDARY_BUTTON_CLASS}
          >
            {form.resume ? "Replace" : "Upload"}
          </button>
          {form.resume ? (
            <button
              type="button"
              onClick={() => save("resume", { resume: null })}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 px-4 text-sm font-medium text-red-400 transition-colors outline-none hover:bg-red-500/20 focus-visible:ring-3 focus-visible:ring-[#5c53fe]/50"
            >
              Remove
            </button>
          ) : null}
        </div>
      </Panel>

      {/* Professional details */}
      <Panel className="flex flex-col gap-6 p-6 lg:col-span-2">
        <h2 className="text-lg font-semibold tracking-[-0.01em]">
          Professional Details
        </h2>

        <label className="flex flex-col gap-2">
          <span className={FIELD_LABEL_CLASS}>Professional Headline</span>
          <Input
            value={form.headline}
            onChange={(event) => update({ headline: event.target.value })}
            className={INPUT_CLASS}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={FIELD_LABEL_CLASS}>Bio</span>
          <Textarea
            value={form.bio}
            onChange={(event) => update({ bio: event.target.value })}
            rows={5}
            className="min-h-36! rounded-lg bg-black/30!"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className={FIELD_LABEL_CLASS}>Skills</span>
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-black/30 px-3 py-2.5">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white/5 px-2.5 py-1.5 text-xs text-zinc-200"
              >
                {skill}
                <button
                  type="button"
                  aria-label={`Remove ${skill}`}
                  onClick={() =>
                    update({
                      skills: form.skills.filter(
                        (existing) => existing !== skill
                      ),
                    })
                  }
                  className="text-muted-foreground transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-[#5c53fe]/50"
                >
                  <XIcon className="size-3" />
                </button>
              </span>
            ))}

            <input
              value={skillDraft}
              onChange={(event) => setSkillDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  addSkill()
                }
              }}
              placeholder="Add a skill..."
              aria-label="Add a skill"
              className="h-9 min-w-[140px] flex-1 border-0 bg-transparent px-1 text-sm text-zinc-100 outline-none placeholder:text-muted-foreground"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Press Enter to add. Removing a skill here is saved with Save Details
            below.
          </p>
        </div>

        <NoticeBar notice={notice} scope="details" />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              save("details", {
                headline: form.headline,
                bio: form.bio,
                skills: form.skills,
              })
            }
            className={PRIMARY_BUTTON_CLASS}
          >
            Save Details
          </button>
        </div>
      </Panel>
    </div>
  )
}

function NoticeBar({
  notice,
  scope,
}: {
  notice: Notice | null
  scope: Notice["scope"]
}) {
  if (!notice || notice.scope !== scope) return null

  return (
    <p
      role="status"
      className={cn(
        "rounded-lg border px-3 py-2 text-xs",
        notice.tone === "error"
          ? "border-red-500/30 bg-red-500/10 text-red-400"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      )}
    >
      {notice.text}
    </p>
  )
}
