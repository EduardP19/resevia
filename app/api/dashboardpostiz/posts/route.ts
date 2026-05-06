import { NextRequest, NextResponse } from "next/server";
import { createPost, listPosts, parseAttachmentText, parseHashtagText } from "@/lib/postiz";

export async function GET() {
  try {
    const posts = await listPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch posts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const attachments = parseAttachmentText(body?.attachments ?? "");
    const hashtags = parseHashtagText(body?.hashtags ?? "");
    const contentType =
      body?.contentType === "reel" || body?.contentType === "video"
        ? body.contentType
        : "post";
    const scheduledAt =
      typeof body?.scheduledAt === "string" && body.scheduledAt.trim()
        ? body.scheduledAt.trim()
        : undefined;

    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const post = await createPost({ text, attachments, hashtags, contentType, scheduledAt });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
