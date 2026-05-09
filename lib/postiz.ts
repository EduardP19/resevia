export type DashboardPost = {
  id: string;
  text: string;
  attachments: string[];
  hashtags: string[];
  contentType: "post" | "reel" | "video";
  integrationId?: string;
  integrationName?: string;
  integrationIdentifier?: string;
  status?: string;
  hasError?: boolean;
  errorMessage?: string;
  createdAt?: string;
  scheduledAt?: string;
};

export type CreateOrUpdateInput = {
  text: string;
  attachments: string[];
  hashtags: string[];
  contentType: "post" | "reel" | "video";
  platform?: "facebook" | "instagram" | "tiktok";
  comment?: string;
  scheduledAt?: string;
  skipUpload?: boolean;
};

type PostizMedia = {
  id: string;
  path: string;
};

const cloudBaseUrl = "https://api.postiz.com";
const rawBaseUrl = process.env.POSTIZ_API_BASE_URL;
const apiKey = process.env.POSTIZ_API_KEY;
const preferredIntegrationId = process.env.POSTIZ_DEFAULT_INTEGRATION_ID;
const allowedIntegrationIdsRaw = process.env.POSTIZ_ALLOWED_INTEGRATION_IDS;
const defaultAllowedIntegrationIds = [
  "cmoss3ihj00vwmq0ydhlx76di", // Omus Labs Facebook
  "cmovooaa40agkl70y7pcubytq", // Omus Labs Instagram
  "cmovpnnwl0aoml70ycbzlmp6g", // omus.labs TikTok
];

function normalizeBaseUrl() {
  const configured = (rawBaseUrl || cloudBaseUrl).replace(/\/+$/, "");
  return configured.endsWith("/public/v1") ? configured : `${configured}/public/v1`;
}

function ensureConfig() {
  if (!apiKey) {
    throw new Error("Missing Postiz API key. Set POSTIZ_API_KEY in your env.");
  }
}

function getAllowedIntegrationIds() {
  if (!allowedIntegrationIdsRaw?.trim()) {
    return new Set(defaultAllowedIntegrationIds);
  }

  return new Set(
    allowedIntegrationIdsRaw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
  );
}

function cleanAttachments(input: unknown): string[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input
      .map((value) => {
        if (typeof value === "string") return value;
        if (value && typeof value === "object" && "path" in value) {
          const maybePath = (value as { path?: unknown }).path;
          return typeof maybePath === "string" ? maybePath : "";
        }
        if (value && typeof value === "object" && "url" in value) {
          const maybeUrl = (value as { url?: unknown }).url;
          return typeof maybeUrl === "string" ? maybeUrl : "";
        }
        return "";
      })
      .filter(Boolean);
  }

  if (typeof input === "string") {
    return input
      .split(/\r?\n|,/)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  return [];
}

function hasVideoExtension(url: string) {
  const videoPattern = /\.(mp4|mov|webm|m4v|avi)$/i;
  try {
    return videoPattern.test(new URL(url).pathname);
  } catch {
    return videoPattern.test(url.split("?")[0]);
  }
}

function splitMedia(urls: string[]) {
  const videos = urls.filter(hasVideoExtension);
  const images = urls.filter((url) => !hasVideoExtension(url));
  return { images, videos };
}

function parseHashtags(input: unknown): string[] {
  if (!input) return [];
  const values = Array.isArray(input)
    ? input
    : typeof input === "string"
      ? input.split(/\r?\n|,|\s+/)
      : [];

  const cleaned = values
    .map((value) => String(value).trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

  return Array.from(new Set(cleaned));
}

function appendHashtags(content: string, hashtags: string[]) {
  if (!hashtags.length) return content;
  const hashText = hashtags.join(" ");
  return `${content}\n\n${hashText}`.trim();
}

function normalizePlatform(input?: string): "facebook" | "instagram" | "tiktok" {
  if (input === "instagram" || input === "tiktok") return input;
  return "facebook";
}

function normalizePost(post: any): DashboardPost {
  const firstValue = Array.isArray(post?.value) ? post.value[0] : undefined;
  const hasVideo =
    Array.isArray(firstValue?.video) && firstValue.video.length > 0;
  const rawType = String(
    post?.settings?.postType ??
      post?.settings?.type ??
      firstValue?.type ??
      ""
  ).toLowerCase();

  const contentType: "post" | "reel" | "video" = rawType.includes("reel")
    ? "reel"
    : hasVideo
      ? "video"
      : "post";

  const normalizedStatus = String(post?.status ?? post?.state ?? "").toUpperCase();
  const hasError =
    normalizedStatus.includes("ERROR") ||
    normalizedStatus.includes("FAILED") ||
    normalizedStatus.includes("REJECTED");
  const errorMessage =
    typeof post?.error === "string"
      ? post.error
      : typeof post?.errorMessage === "string"
        ? post.errorMessage
        : typeof post?.message === "string" && hasError
          ? post.message
          : typeof post?.logs?.error === "string"
            ? post.logs.error
            : undefined;

  return {
    id: String(post?.id ?? post?._id ?? post?.uuid ?? ""),
    text: String(firstValue?.content ?? post?.text ?? post?.content ?? ""),
    attachments: cleanAttachments(
      [
        ...(Array.isArray(firstValue?.image) ? firstValue.image : []),
        ...(Array.isArray(firstValue?.video) ? firstValue.video : []),
      ].length
        ? [
            ...(Array.isArray(firstValue?.image) ? firstValue.image : []),
            ...(Array.isArray(firstValue?.video) ? firstValue.video : []),
          ]
        : firstValue?.image ?? post?.image ?? post?.attachments
    ),
    hashtags: parseHashtags(post?.tags?.map?.((tag: any) => tag?.value ?? tag?.label)),
    contentType,
    integrationId: String(
      post?.integration?.id ??
        post?.integrationId ??
        post?.integration_id ??
        post?.posts?.[0]?.integration?.id ??
        ""
    ),
    status:
      typeof post?.status === "string"
        ? post.status
        : typeof post?.state === "string"
          ? post.state
          : undefined,
    hasError,
    errorMessage,
    createdAt:
      typeof post?.createdAt === "string"
        ? post.createdAt
        : typeof post?.created_at === "string"
          ? post.created_at
          : typeof post?.publishedAt === "string"
            ? post.publishedAt
            : typeof post?.publishDate === "string"
              ? post.publishDate
              : undefined,
    scheduledAt:
      typeof post?.date === "string"
        ? post.date
        : typeof post?.scheduleDate === "string"
          ? post.scheduleDate
          : typeof post?.publishDate === "string"
            ? post.publishDate
            : undefined,
  };
}

async function postizFetch(path: string, init?: RequestInit) {
  ensureConfig();

  const response = await fetch(`${normalizeBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: String(apiKey),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Postiz API error ${response.status}: ${body}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

const CONTENT_TYPE_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "video/mp4": ".mp4",
  "video/quicktime": ".mov",
  "video/webm": ".webm",
};

const KNOWN_EXT = /\.(png|jpe?g|gif|webp|mp4|mov|webm|m4v|avi)$/i;

async function resolveUploadUrl(url: string): Promise<string> {
  let pathname: string;
  try {
    pathname = new URL(url).pathname;
  } catch {
    pathname = url.split("?")[0];
  }

  if (KNOWN_EXT.test(pathname)) return url;

  // No recognized extension — HEAD the URL to detect content type
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    const contentType = res.headers.get("content-type")?.split(";")[0].trim() ?? "";
    const ext = CONTENT_TYPE_TO_EXT[contentType];
    if (ext) return `${url}${ext}`;
  } catch {
    // fall through and let Postiz reject it with a clear error
  }

  return url;
}

async function uploadFromUrl(url: string): Promise<PostizMedia> {
  const resolvedUrl = await resolveUploadUrl(url);
  const data = await postizFetch("/upload-from-url", {
    method: "POST",
    body: JSON.stringify({ url: resolvedUrl }),
  });

  if (typeof data?.id !== "string" || typeof data?.path !== "string") {
    throw new Error(`Postiz upload-from-url failed for ${url}`);
  }

  return {
    id: data.id,
    path: data.path,
  };
}

async function resolveAllUrls(urls: string[], skipUpload: boolean): Promise<string[]> {
  if (skipUpload) return urls;
  return Promise.all(urls.map(resolveUploadUrl));
}

async function mediaPayload(urls: string[], skipUpload = false): Promise<PostizMedia[]> {
  if (skipUpload) {
    return urls.map((url) => ({ id: "", path: url }));
  }
  return Promise.all(urls.map((url) => uploadFromUrl(url)));
}

async function resolveIntegrationId(platform?: "facebook" | "instagram" | "tiktok") {
  const integrations = await postizFetch("/integrations", { method: "GET" });
  const list = Array.isArray(integrations) ? integrations : ([] as any[]);
  const allowedIds = getAllowedIntegrationIds();
  const allowed = list.filter((item: any) => item?.id && allowedIds.has(String(item.id)));
  const targetPlatform = normalizePlatform(platform);

  if (!allowed.length) {
    throw new Error(
      "No allowed Postiz integrations found. Verify POSTIZ_ALLOWED_INTEGRATION_IDS."
    );
  }

  if (preferredIntegrationId) {
    const preferred = allowed.find((item: any) => String(item.id) === preferredIntegrationId);

    if (!allowedIds.has(preferredIntegrationId)) {
      throw new Error(
        "POSTIZ_DEFAULT_INTEGRATION_ID is not in POSTIZ_ALLOWED_INTEGRATION_IDS."
      );
    }

    if (!preferred) {
      throw new Error(
        "POSTIZ_DEFAULT_INTEGRATION_ID is allowed but not connected in Postiz."
      );
    }

    if (targetPlatform === "facebook") {
      return preferredIntegrationId;
    }
  }

  const exact = allowed.find((item: any) => item?.identifier === targetPlatform);
  if (exact?.id) return String(exact.id);

  throw new Error(
    `No allowed integration connected for platform "${targetPlatform}".`
  );
}

function getScheduledAt(input?: string) {
  if (input) return input;

  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  threeDaysFromNow.setUTCHours(9, 0, 0, 0);
  return threeDaysFromNow.toISOString();
}

export async function listPosts(): Promise<DashboardPost[]> {
  const allowedIds = getAllowedIntegrationIds();
  const integrations = await postizFetch("/integrations", { method: "GET" });
  const integrationList = Array.isArray(integrations) ? integrations : [];
  const integrationMap = new Map<string, { name?: string; identifier?: string }>();
  for (const item of integrationList) {
    if (!item?.id) continue;
    integrationMap.set(String(item.id), {
      name: typeof item.name === "string" ? item.name : undefined,
      identifier: typeof item.identifier === "string" ? item.identifier : undefined,
    });
  }

  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 30);
  const end = new Date(now);
  end.setDate(now.getDate() + 90);

  const query = new URLSearchParams({
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  });

  const data = await postizFetch(`/posts?${query.toString()}`, { method: "GET" });
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.posts)
      ? data.posts
      : Array.isArray(data?.data)
        ? data.data
        : [];

  return list
    .map(normalizePost)
    .filter(
      (post: DashboardPost) =>
        Boolean(post.id) &&
        (!post.integrationId || allowedIds.has(post.integrationId))
    )
    .map((post: DashboardPost) => {
      const meta = post.integrationId ? integrationMap.get(post.integrationId) : undefined;
      return {
        ...post,
        integrationName: meta?.name,
        integrationIdentifier: meta?.identifier,
      };
    });
}

export async function createPost(input: CreateOrUpdateInput) {
  const platform = normalizePlatform(input.platform);
  const integrationId = await resolveIntegrationId(platform);
  const scheduledAt = getScheduledAt(input.scheduledAt);
  const resolvedAttachments = await resolveAllUrls(input.attachments, input.skipUpload ?? false);
  const { images, videos } = splitMedia(resolvedAttachments);
  const [image, video] = await Promise.all([
    mediaPayload(images, input.skipUpload),
    mediaPayload(videos, input.skipUpload),
  ]);
  const content = appendHashtags(input.text, input.hashtags);
  const comment = (input.comment || "").trim();
  const baseSettings =
    platform === "facebook"
      ? {
          __type: "facebook",
          postType: input.contentType,
        }
      : platform === "instagram"
        ? {
            __type: "instagram",
            post_type: input.contentType === "reel" ? "story" : "post",
          }
        : {
            __type: "tiktok",
            privacy_level: "PUBLIC_TO_EVERYONE",
            duet: true,
            stitch: true,
            comment: true,
            autoAddMusic: "no",
            brand_content_toggle: false,
            brand_organic_toggle: false,
            content_posting_method: "DIRECT_POST",
          };

  const value = [
    {
      content,
      image,
      video,
      type: input.contentType,
    },
  ];

  if (comment && (platform === "facebook" || platform === "instagram")) {
    value.push({
      content: comment,
      image: [],
      video: [],
      type: "post",
    } as any);
  }

  const payload = {
    type: "schedule",
    date: scheduledAt,
    shortLink: false,
    tags: input.hashtags.map((tag) => ({ value: tag.replace(/^#/, ""), label: tag })),
    posts: [
      {
        integration: { id: integrationId },
        value,
        settings: {
          ...baseSettings,
        },
      },
    ],
  };

  const data = await postizFetch("/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return normalizePost(data?.post ?? data?.data ?? data);
}

export async function createPosts(input: CreateOrUpdateInput & { platforms: Array<"facebook" | "instagram" | "tiktok"> }) {
  const uniquePlatforms = Array.from(
    new Set(input.platforms.filter((platform) => platform === "facebook" || platform === "instagram" || platform === "tiktok"))
  );

  if (!uniquePlatforms.length) {
    throw new Error("Select at least one platform.");
  }

  const results: DashboardPost[] = [];
  for (const platform of uniquePlatforms) {
    const normalizedComment = (input.comment || "").trim();
    const comment = platform === "facebook" || platform === "instagram" ? normalizedComment : "";

    const post = await createPost({
      text: input.text,
      attachments: input.attachments,
      hashtags: input.hashtags,
      contentType: input.contentType,
      platform,
      scheduledAt: input.scheduledAt,
      comment,
      skipUpload: input.skipUpload,
    });
    results.push(post);
  }
  return results;
}

export async function updatePost(id: string, input: CreateOrUpdateInput) {
  const platform = normalizePlatform(input.platform);
  const { images, videos } = splitMedia(input.attachments);
  const [image, video] = await Promise.all([
    mediaPayload(images, input.skipUpload),
    mediaPayload(videos, input.skipUpload),
  ]);
  const content = appendHashtags(input.text, input.hashtags);
  const settings =
    platform === "facebook"
      ? {
          postType: input.contentType,
        }
      : platform === "instagram"
        ? {
            post_type: input.contentType === "reel" ? "story" : "post",
          }
        : {
            privacy_level: "PUBLIC_TO_EVERYONE",
            duet: true,
            stitch: true,
            comment: true,
            autoAddMusic: "no",
            brand_content_toggle: false,
            brand_organic_toggle: false,
            content_posting_method: "DIRECT_POST",
          };

  const payload = {
    content,
    image,
    video,
    type: input.contentType,
    tags: input.hashtags.map((tag) => ({ value: tag.replace(/^#/, ""), label: tag })),
    date: getScheduledAt(input.scheduledAt),
    settings,
  };

  try {
    const data = await postizFetch(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return normalizePost(data?.post ?? data?.data ?? data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const missingPutRoute =
      message.includes("Postiz API error 404") && message.includes("Cannot PUT");

    if (!missingPutRoute) {
      throw error;
    }

    // Public API may not support update by id; fallback to recreate workflow.
    await deletePost(id);
    return createPost({ ...input, platform });
  }
}

export async function deletePost(id: string) {
  await postizFetch(`/posts/${id}`, { method: "DELETE" });
}

export function parseAttachmentText(value: string): string[] {
  return cleanAttachments(value);
}

export function parseHashtagText(value: string): string[] {
  return parseHashtags(value);
}
