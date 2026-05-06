import { NextRequest, NextResponse } from "next/server";
import { deletePost, parseAttachmentText, parseHashtagText, updatePost } from "@/lib/postiz";

type Context = {
  params: {
    id: string;
  };
};

export async function PUT(request: NextRequest, { params }: Context) {
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

    const post = await updatePost(params.id, {
      text,
      attachments,
      hashtags,
      contentType,
      scheduledAt,
    });
    return NextResponse.json({ post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    await deletePost(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
