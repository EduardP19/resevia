"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type PostItem = {
  id: string;
  text: string;
  attachments: string[];
  hashtags: string[];
  contentType: "post" | "reel" | "video";
  integrationName?: string;
  integrationIdentifier?: string;
  status?: string;
  hasError?: boolean;
  errorMessage?: string;
  createdAt?: string;
  scheduledAt?: string;
};

type FormState = {
  text: string;
  attachments: string;
  hashtags: string;
  contentType: "post" | "reel" | "video";
  comment: string;
  scheduleDate: string;
  scheduleHour: string;
  scheduleMinute: string;
};

const emptyForm: FormState = {
  text: "",
  attachments: "",
  hashtags: "",
  contentType: "post",
  comment: "",
  scheduleDate: "",
  scheduleHour: "09",
  scheduleMinute: "00",
};

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
}

function isVideoUrl(url: string) {
  return /\.(mp4|mov|webm|m4v|avi)$/i.test(url);
}

function toTwoDigits(value: number) {
  return String(value).padStart(2, "0");
}

function splitScheduledAt(iso?: string) {
  if (!iso) {
    return {
      scheduleDate: "",
      scheduleHour: "09",
      scheduleMinute: "00",
    };
  }

  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return {
      scheduleDate: "",
      scheduleHour: "09",
      scheduleMinute: "00",
    };
  }

  return {
    scheduleDate: parsed.toISOString().slice(0, 10),
    scheduleHour: toTwoDigits(parsed.getUTCHours()),
    scheduleMinute: toTwoDigits(parsed.getUTCMinutes()),
  };
}

function composeScheduledAt(form: FormState) {
  if (!form.scheduleDate) return undefined;
  const hour = form.scheduleHour || "00";
  const minute = form.scheduleMinute || "00";
  return `${form.scheduleDate}T${hour}:${minute}:00.000Z`;
}

function formatSchedulePreview(iso?: string) {
  if (!iso) return "Not scheduled";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "Invalid schedule";
  return parsed.toLocaleString();
}

function formatDateLabel(iso?: string) {
  if (!iso) return "N/A";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleString();
}

function pageLabel(post: PostItem) {
  const identifier = (post.integrationIdentifier || "").toLowerCase();
  const platform =
    identifier.includes("facebook") ? "FB" : identifier.includes("instagram") ? "IG" : identifier.toUpperCase();
  const name = post.integrationName || "Unknown Page";
  return platform ? `${platform} ${name}` : name;
}

function pageIcon(post: PostItem): ReactNode {
  const identifier = (post.integrationIdentifier || "").toLowerCase();
  if (identifier.includes("facebook")) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1877F2] text-white">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
          <path d="M13.5 8.5V6.8c0-.7.4-.8.7-.8h1.7V3.1h-2.4c-2.8 0-3.4 2.1-3.4 3.5v1.9H8v2.9h2.1V21h3.4v-9.6h2.2l.3-2.9h-2.5Z" />
        </svg>
      </span>
    );
  }
  if (identifier.includes("instagram")) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
          <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.2" cy="6.8" r="1" className="fill-current stroke-none" />
        </svg>
      </span>
    );
  }
  if (identifier.includes("tiktok")) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
          <path d="M15.9 5.1c.7 1.1 1.8 1.8 3.1 2v2.4a6.6 6.6 0 0 1-3.2-1v5.3a4.8 4.8 0 1 1-4.8-4.8c.3 0 .6 0 .9.1v2.5a2.4 2.4 0 1 0 1.5 2.2V3h2.5v2.1Z" />
        </svg>
      </span>
    );
  }
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-700">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 9h-3.1a16 16 0 0 0-1.1-5A8.1 8.1 0 0 1 18.9 11ZM12 4.1c.8 1.1 1.5 3 1.8 5.1h-3.6c.3-2.1 1-4 1.8-5.1ZM4 13h3.1c.1 1.8.5 3.5 1.1 5A8.1 8.1 0 0 1 4 13Zm3.1-2H4a8.1 8.1 0 0 1 4.2-5 16 16 0 0 0-1.1 5Zm2 0c.1-1.8.5-3.4 1-4.8.6-.2 1.2-.3 1.9-.3s1.3.1 1.9.3c.5 1.4.9 3 1 4.8H9.1Zm0 2h5.8c-.1 1.8-.5 3.4-1 4.8-.6.2-1.2.3-1.9.3s-1.3-.1-1.9-.3c-.5-1.4-.9-3-1-4.8Zm5.6 5a16 16 0 0 0 1.1-5h3.1a8.1 8.1 0 0 1-4.2 5ZM12 19.9c-.8-1.1-1.5-3-1.8-5.1h3.6c-.3 2.1-1 4-1.8 5.1Z" />
      </svg>
    </span>
  );
}

function isPostError(post: PostItem) {
  if (post.hasError) return true;
  const status = (post.status || "").toUpperCase();
  return (
    status.includes("ERROR") ||
    status.includes("FAILED") ||
    status.includes("REJECTED")
  );
}

export default function DashboardPostizPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedPlatforms, setSelectedPlatforms] = useState<{
    facebook: boolean;
    instagram: boolean;
    tiktok: boolean;
  }>({
    facebook: true,
    instagram: false,
    tiktok: false,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openPosts, setOpenPosts] = useState<Record<string, boolean>>({});

  const title = useMemo(
    () => (editingId ? "Edit Post" : "Create New Post"),
    [editingId]
  );
  const nowTs = Date.now();
  function isFuturePost(post: PostItem) {
    const normalizedStatus = (post.status || "").toUpperCase();
    if (["QUEUE", "SCHEDULED", "PENDING"].includes(normalizedStatus)) {
      return true;
    }
    if (post.scheduledAt) {
      const ts = new Date(post.scheduledAt).getTime();
      if (!Number.isNaN(ts)) return ts > nowTs;
    }
    return false;
  }

  const futurePosts = posts.filter(isFuturePost);
  const historyPosts = posts.filter((post) => !isFuturePost(post));

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/dashboardpostiz/posts", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to load posts");
      }

      setPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function beginEdit(post: PostItem) {
    setEditingId(post.id);
    const scheduleParts = splitScheduledAt(post.scheduledAt);
    setForm({
      text: post.text,
      attachments: post.attachments.join("\n"),
      hashtags: post.hashtags.join(" "),
      contentType: post.contentType ?? "post",
      comment: "",
      ...scheduleParts,
    });
    const provider = (post.integrationIdentifier || "").toLowerCase();
    setSelectedPlatforms({
      facebook: provider.includes("facebook"),
      instagram: provider.includes("instagram"),
      tiktok: provider.includes("tiktok"),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedPlatforms({
      facebook: true,
      instagram: false,
      tiktok: false,
    });
  }

  function togglePostOpen(id: string) {
    setOpenPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/dashboardpostiz/posts/${editingId}`
        : "/api/dashboardpostiz/posts";

      const platforms = [
        selectedPlatforms.facebook ? "facebook" : null,
        selectedPlatforms.instagram ? "instagram" : null,
        selectedPlatforms.tiktok ? "tiktok" : null,
      ].filter(Boolean);

      if (!platforms.length) {
        throw new Error("Select at least one platform.");
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: form.text,
          attachments: form.attachments,
          hashtags: form.hashtags,
          contentType: form.contentType,
          comment: form.comment,
          platforms,
          platform: platforms[0],
          scheduledAt: composeScheduledAt(form),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error ?? "Save failed");
      }

      resetForm();
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    const confirmed = window.confirm("Delete this post from Postiz?");
    if (!confirmed) return;

    setError(null);
    try {
      const response = await fetch(`/api/dashboardpostiz/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error ?? "Delete failed");
      }

      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Postiz Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Add, update, delete posts and review attachments that will be sent to Postiz.
          </p>
        </div>
        <button
          type="button"
          onClick={loadPosts}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="mb-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Post content</label>
            <textarea
              value={form.text}
              onChange={(event) => setForm((prev) => ({ ...prev, text: event.target.value }))}
              className="min-h-24 w-full rounded-md border border-slate-300 p-3 text-sm"
              placeholder="Write the content for this post"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Image/Video URLs (one per line)
            </label>
            <textarea
              value={form.attachments}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, attachments: event.target.value }))
              }
              className="min-h-20 w-full rounded-md border border-slate-300 p-3 text-sm"
              placeholder={"https://example.com/image-1.jpg\nhttps://example.com/video-1.mp4"}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Hashtags
            </label>
            <input
              value={form.hashtags}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, hashtags: event.target.value }))
              }
              className="w-full rounded-md border border-slate-300 p-3 text-sm"
              placeholder="#OmusLabs #AI #Marketing (space or comma separated)"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Content type</label>
            <select
              value={form.contentType}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  contentType: event.target.value as "post" | "reel" | "video",
                }))
              }
              className="w-full rounded-md border border-slate-300 p-3 text-sm"
            >
              <option value="post">Post</option>
              <option value="reel">Reel</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-sm font-semibold text-slate-800">Platforms</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedPlatforms.facebook}
                  onChange={(event) =>
                    setSelectedPlatforms((prev) => ({ ...prev, facebook: event.target.checked }))
                  }
                />
                Facebook
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedPlatforms.instagram}
                  onChange={(event) =>
                    setSelectedPlatforms((prev) => ({ ...prev, instagram: event.target.checked }))
                  }
                />
                Instagram
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedPlatforms.tiktok}
                  onChange={(event) =>
                    setSelectedPlatforms((prev) => ({ ...prev, tiktok: event.target.checked }))
                  }
                />
                TikTok
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Follow-up comment (FB/IG only)
            </label>
            <input
              value={form.comment}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, comment: event.target.value }))
              }
              className="w-full rounded-md border border-slate-300 p-3 text-sm"
              placeholder="https://www.resevia.co.uk/"
            />
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-sm font-semibold text-slate-800">Schedule (optional)</p>
            <p className="mb-3 text-xs text-slate-600">
              Pick the date and time you want. Preview shows your local time.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
                <input
                  type="date"
                  value={form.scheduleDate}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, scheduleDate: event.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 p-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Hour (24h)</label>
                <select
                  value={form.scheduleHour}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, scheduleHour: event.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 p-3 text-sm"
                >
                  {Array.from({ length: 24 }, (_, index) => {
                    const value = toTwoDigits(index);
                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Minute</label>
                <select
                  value={form.scheduleMinute}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, scheduleMinute: event.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 p-3 text-sm"
                >
                  {Array.from({ length: 60 }, (_, index) => {
                    const value = toTwoDigits(index);
                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600">
              Scheduled for: {formatSchedulePreview(composeScheduledAt(form))}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update Post" : "Create Post"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Future Posts ({futurePosts.length})</h2>

        {loading ? <p className="text-sm text-slate-600">Loading posts...</p> : null}

        {!loading && futurePosts.length === 0 ? (
          <p className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No future posts found.
          </p>
        ) : null}

        <div className="space-y-4">
          {futurePosts.map((post) => (
            <article key={post.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    <span className="mr-2 inline-flex align-middle">{pageIcon(post)}</span>
                    Page: {pageLabel(post)}
                  </p>
                  <p className="text-xs text-slate-500">Created: {formatDateLabel(post.createdAt)}</p>
                  <p className="text-xs text-slate-500">Scheduled: {formatDateLabel(post.scheduledAt)}</p>
                  {isPostError(post) ? (
                    <p className="mt-1 inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                      Postiz error
                    </p>
                  ) : null}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePostOpen(post.id)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
                  >
                    {openPosts[post.id] ? "Collapse" : "Expand"}
                  </button>
                  <button
                    type="button"
                    onClick={() => beginEdit(post)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(post.id)}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {openPosts[post.id] ? (
                <>
                  <div className="mb-3 grid grid-cols-1 gap-1 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 md:grid-cols-2">
                    <p>Status: {post.status || "N/A"}</p>
                    <p>Error: {isPostError(post) ? "Yes" : "No"}</p>
                    <p>Type: {post.contentType}</p>
                    <p>Assets: {post.attachments.length}</p>
                    <p>Created: {formatDateLabel(post.createdAt)}</p>
                    <p>Scheduled: {formatDateLabel(post.scheduledAt)}</p>
                    <p>Post ID: {post.id}</p>
                    <p>Integration: {post.integrationName || "N/A"}</p>
                    <p>Provider: {post.integrationIdentifier || "N/A"}</p>
                  </div>
                  {post.errorMessage ? (
                    <p className="mb-3 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                      {post.errorMessage}
                    </p>
                  ) : null}
                  <p className="whitespace-pre-wrap text-sm text-slate-800">{post.text}</p>
                  {post.hashtags.length > 0 ? (
                    <p className="mt-2 text-xs text-slate-600">{post.hashtags.join(" ")}</p>
                  ) : null}

                  {post.attachments.length > 0 ? (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium text-slate-700">Attachments</p>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {post.attachments.map((url) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="overflow-hidden rounded-md border border-slate-200"
                          >
                            {isImageUrl(url) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={url} alt="Attachment preview" className="h-44 w-full object-cover" />
                            ) : isVideoUrl(url) ? (
                              <video src={url} controls className="h-44 w-full bg-slate-100 object-cover" />
                            ) : (
                              <div className="flex h-44 items-center justify-center bg-slate-50 px-3 text-center text-sm text-slate-600">
                                {url}
                              </div>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">History Posts ({historyPosts.length})</h2>
        {!loading && historyPosts.length === 0 ? (
          <p className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No history posts found.
          </p>
        ) : null}
        <div className="space-y-4">
          {historyPosts.map((post) => (
            <article key={post.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    <span className="mr-2 inline-flex align-middle">{pageIcon(post)}</span>
                    Page: {pageLabel(post)}
                  </p>
                  <p className="text-xs text-slate-500">Created: {formatDateLabel(post.createdAt)}</p>
                  <p className="text-xs text-slate-500">Scheduled: {formatDateLabel(post.scheduledAt)}</p>
                  {isPostError(post) ? (
                    <p className="mt-1 inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                      Postiz error
                    </p>
                  ) : null}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePostOpen(post.id)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
                  >
                    {openPosts[post.id] ? "Collapse" : "Expand"}
                  </button>
                  <button
                    type="button"
                    onClick={() => beginEdit(post)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(post.id)}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {openPosts[post.id] ? (
                <>
                  <div className="mb-3 grid grid-cols-1 gap-1 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 md:grid-cols-2">
                    <p>Status: {post.status || "N/A"}</p>
                    <p>Error: {isPostError(post) ? "Yes" : "No"}</p>
                    <p>Type: {post.contentType}</p>
                    <p>Assets: {post.attachments.length}</p>
                    <p>Created: {formatDateLabel(post.createdAt)}</p>
                    <p>Scheduled: {formatDateLabel(post.scheduledAt)}</p>
                    <p>Post ID: {post.id}</p>
                    <p>Integration: {post.integrationName || "N/A"}</p>
                    <p>Provider: {post.integrationIdentifier || "N/A"}</p>
                  </div>
                  {post.errorMessage ? (
                    <p className="mb-3 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                      {post.errorMessage}
                    </p>
                  ) : null}
                  <p className="whitespace-pre-wrap text-sm text-slate-800">{post.text}</p>
                  {post.hashtags.length > 0 ? (
                    <p className="mt-2 text-xs text-slate-600">{post.hashtags.join(" ")}</p>
                  ) : null}
                </>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
