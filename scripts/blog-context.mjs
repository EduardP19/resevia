#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const TABLE_SHAPES = {
  blog_posts: {
    columns:
      'id, slug, title, description, body, cover_image, keywords, author, status, published_at, created_at, updated_at',
    order: 'published_at',
  },
  blog: {
    columns: 'id, slug, title, excerpt, content, cover_image, published, created_at',
    order: 'created_at',
  },
  posts: {
    columns: 'id, slug, title, excerpt, content, cover_image, published, created_at',
    order: 'created_at',
  },
};

function loadEnvFile(path) {
  const absolutePath = resolve(process.cwd(), path);
  if (!existsSync(absolutePath)) return;

  const lines = readFileSync(absolutePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;

    const [key, ...valueParts] = trimmed.split('=');
    if (process.env[key]) continue;

    const rawValue = valueParts.join('=').trim();
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

function parseArgs(argv) {
  const args = { limit: 50 };
  for (const arg of argv) {
    if (arg.startsWith('--limit=')) {
      const limit = Number.parseInt(arg.slice('--limit='.length), 10);
      if (Number.isFinite(limit) && limit > 0) args.limit = Math.min(limit, 250);
    }
  }
  return args;
}

function createSupabaseClient() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createClient(url, key, { auth: { persistSession: false } });
}

function tableCandidates() {
  const configured = process.env.BLOG_TABLE?.trim();
  return [...new Set([configured, 'blog_posts', 'blog', 'posts'].filter(Boolean))];
}

function shapeFor(table) {
  return TABLE_SHAPES[table] ?? TABLE_SHAPES.blog_posts;
}

function snippet(value, length = 420) {
  if (typeof value !== 'string') return '';
  const compact = value.replace(/\s+/g, ' ').trim();
  return compact.length > length ? `${compact.slice(0, length).trim()}...` : compact;
}

function normalizePost(row) {
  const description = row.description ?? row.excerpt ?? '';
  const body = row.body ?? row.content ?? '';
  const status =
    row.status ?? (typeof row.published === 'boolean' ? (row.published ? 'published' : 'draft') : null);
  const publishedAt = row.published_at ?? row.created_at ?? null;

  return {
    id: row.id ?? null,
    slug: row.slug,
    title: row.title,
    description,
    body_snippet: snippet(body),
    cover_image: row.cover_image ?? null,
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    author: row.author ?? null,
    status,
    published_at: publishedAt,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
  };
}

function avoidList(posts) {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    keywords: post.keywords,
    topic_hint: snippet(`${post.title}. ${post.description}`, 180),
  }));
}

async function readTable(supabase, table, limit) {
  const shape = shapeFor(table);
  const { data, error } = await supabase
    .from(table)
    .select(shape.columns)
    .order(shape.order, { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    return { error };
  }

  return { rows: data ?? [] };
}

async function main() {
  const { limit } = parseArgs(process.argv.slice(2));
  const supabase = createSupabaseClient();

  const errors = [];
  for (const table of tableCandidates()) {
    const result = await readTable(supabase, table, limit);
    if (result.rows) {
      const posts = result.rows.map(normalizePost);
      console.log(
        JSON.stringify(
          {
            table,
            count: posts.length,
            posts,
            avoid: avoidList(posts),
          },
          null,
          2
        )
      );
      return;
    }

    errors.push({ table, message: result.error.message });
  }

  throw new Error(`Unable to read a blog table: ${JSON.stringify(errors)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
