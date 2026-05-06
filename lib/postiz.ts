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
  createdAt?: string;
  scheduledAt?: string;
};

export type CreateOrUpdateInput = {
  text: string;
  attachments: string[];
  hashtags: string[];
  contentType: "post" | "reel" | "video";
  scheduledAt?: string;
};

const cloudBaseUrl = "https://api.postiz.com";
const rawBaseUrl = process.env.POSTIZ_API_BASE_URL;
const apiKey = process.env.POSTIZ_API_KEY;
const preferredIntegrationId = process.env.POSTIZ_DEFAULT_INTEGRATION_ID;

function normalizeBaseUrl() {
  const configured = (rawBaseUrl || cloudBaseUrl).replace(/\/+$/, "");
  return configured.endsWith("/public/v1") ? configured : `${configured}/public/v1`;
}

function ensureConfig() {
  if (!apiKey) {
    throw new Error("Missing Postiz API key. Set POSTIZ_API_KEY in your env.");
  }
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

function imagePayload(urls: string[]) {
  return urls.map((path) => ({ path }));
}

function videoPayload(urls: string[]) {
  return urls.map((path) => ({ path }));
}

function splitMedia(urls: string[]) {
  const videoPattern = /\.(mp4|mov|webm|m4v|avi)$/i;
  const videos = urls.filter((url) => videoPattern.test(url));
  const images = urls.filter((url) => !videoPattern.test(url));
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
    createdAt:
      typeof post?.createdAt === "string"
        ? post.createdAt
        : typeof post?.created_at === "string"
          ? post.created_at
          : undefined,
    scheduledAt:
      typeof post?.date === "string"
        ? post.date
        : typeof post?.scheduleDate === "string"
          ? post.scheduleDate
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

async function resolveIntegrationId() {
  if (preferredIntegrationId) return preferredIntegrationId;

  const integrations = await postizFetch("/integrations", { method: "GET" });
  const list = Array.isArray(integrations) ? integrations : [];

  const omusLabs = list.find(
    (item: any) =>
      typeof item?.name === "string" && item.name.toLowerCase().includes("omus labs")
  );

  if (omusLabs?.id) return String(omusLabs.id);

  if (list[0]?.id) return String(list[0].id);

  throw new Error("No Postiz integrations found. Connect at least one channel first.");
}

function getScheduledAt(input?: string) {
  if (input) return input;

  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  threeDaysFromNow.setUTCHours(9, 0, 0, 0);
  return threeDaysFromNow.toISOString();
}

export async function listPosts(): Promise<DashboardPost[]> {
  const integrationId = await resolveIntegrationId();
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
        (!post.integrationId || post.integrationId === integrationId)
    )
    .map((post) => {
      const meta = post.integrationId ? integrationMap.get(post.integrationId) : undefined;
      return {
        ...post,
        integrationName: meta?.name,
        integrationIdentifier: meta?.identifier,
      };
    });
}

export async function createPost(input: CreateOrUpdateInput) {
  const integrationId = await resolveIntegrationId();
  const scheduledAt = getScheduledAt(input.scheduledAt);
  const { images, videos } = splitMedia(input.attachments);
  const content = appendHashtags(input.text, input.hashtags);

  const payload = {
    type: "schedule",
    date: scheduledAt,
    shortLink: false,
    tags: input.hashtags.map((tag) => ({ value: tag.replace(/^#/, ""), label: tag })),
    posts: [
      {
        integration: { id: integrationId },
        value: [
          {
            content,
            image: imagePayload(images),
            video: videoPayload(videos),
            type: input.contentType,
          },
        ],
        settings: {
          __type: "facebook",
          postType: input.contentType,
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

export async function updatePost(id: string, input: CreateOrUpdateInput) {
  const { images, videos } = splitMedia(input.attachments);
  const content = appendHashtags(input.text, input.hashtags);
  const payload = {
    content,
    image: imagePayload(images),
    video: videoPayload(videos),
    type: input.contentType,
    tags: input.hashtags.map((tag) => ({ value: tag.replace(/^#/, ""), label: tag })),
    date: getScheduledAt(input.scheduledAt),
    settings: {
      postType: input.contentType,
    },
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
    return createPost(input);
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
