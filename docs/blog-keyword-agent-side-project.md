# Blog Keyword Agent Side Project

This is the working brief for turning Resevia's local blog publishing workflow into a scheduled SEO/content agent.

## Current Workflow

The current system is operator-driven:

1. Run `npm run blog:context -- --limit=100`.
2. Use the JSON output to avoid duplicate slugs, titles, and near-overlapping topics.
3. Generate a single Markdown blog payload for the `blog_posts` table.
4. Publish with `node scripts/publish-blog-post.mjs path/to/payload.json`.
5. Check `/blog`, `/blog/<slug>`, and the sitemap.

## Target Payload

```json
{
  "slug": "example-post",
  "title": "Example Post",
  "description": "Short index-card and metadata summary.",
  "body": "Markdown body content.",
  "cover_image": "/blog/example-post.png",
  "keywords": ["primary keyword", "secondary keyword"],
  "author": "The Resevia Team",
  "status": "published"
}
```

The scripts also accept `excerpt` for `description`, `content` for `body`, and `published: true` for `status: "published"` so older agent prompts remain usable.

## Future Tables

- `blog_keyword_targets`: keyword, intent, priority, status, assigned_slug, notes.
- `blog_agent_runs`: run_type, status, input_summary, output_slug, error_message, created_at.
- `blog_post_performance`: slug, clicks, impressions, ctr, average_position, query_data, captured_at.
- `blog_post_updates`: slug, reason, source_metrics, summary, updated_at.

## Scheduled Agent Loop

1. Select one active keyword target that does not already have a matching published post.
2. Run the context script and Search Console sync.
3. Generate a post in Resevia's practical salon/clinic owner voice.
4. Publish as draft first when confidence is low, otherwise publish directly.
5. Send a notification with the slug, target keyword, and validation result.
6. Re-check performance after 14-30 days before proposing updates.

## Guardrails

- Always inspect current blog context before writing.
- Avoid keyword cannibalisation across existing titles, slugs, descriptions, and keywords.
- Keep the service role key server-side.
- Log every automated publish or update.
- Use Search Console data for refreshes; do not rewrite posts too soon.
- Keep body content in Markdown because the live page renders with `react-markdown`.
