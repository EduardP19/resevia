#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

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

function createSupabaseAdmin() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

function readPayload(path) {
  if (!path) {
    throw new Error('Usage: node scripts/publish-blog-post.mjs path/to/payload.json');
  }

  const absolutePath = resolve(process.cwd(), path);
  if (!existsSync(absolutePath)) {
    throw new Error(`Payload file not found: ${absolutePath}`);
  }

  try {
    return JSON.parse(readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    throw new Error(`Payload must be valid JSON: ${error.message}`);
  }
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeKeywords(value) {
  if (Array.isArray(value)) {
    return value.map(cleanString).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map(cleanString)
      .filter(Boolean);
  }

  return [];
}

function normalizeStatus(payload) {
  if (payload.status === 'draft' || payload.status === 'published') return payload.status;
  if (payload.published === false) return 'draft';
  return 'published';
}

function normalizeBlogPostPayload(payload) {
  const now = new Date().toISOString();
  const status = normalizeStatus(payload);
  const row = {
    slug: cleanString(payload.slug),
    title: cleanString(payload.title),
    description: cleanString(payload.description ?? payload.excerpt),
    body: cleanString(payload.body ?? payload.content),
    cover_image: cleanString(payload.cover_image) || null,
    keywords: normalizeKeywords(payload.keywords),
    author: cleanString(payload.author) || 'The Resevia Team',
    status,
    published_at:
      status === 'published'
        ? cleanString(payload.published_at ?? payload.publishedAt) || now
        : cleanString(payload.published_at ?? payload.publishedAt) || null,
    updated_at: now,
  };

  const missing = ['slug', 'title', 'description', 'body'].filter((field) => !row[field]);
  if (missing.length > 0) {
    throw new Error(`Payload is missing required field(s): ${missing.join(', ')}`);
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)) {
    throw new Error('Slug must use lowercase letters, numbers, and single hyphens only');
  }

  return row;
}

function rowForTable(table, row) {
  if (table === 'blog' || table === 'posts') {
    return {
      slug: row.slug,
      title: row.title,
      excerpt: row.description,
      content: row.body,
      cover_image: row.cover_image,
      published: row.status === 'published',
      created_at: row.published_at ?? new Date().toISOString(),
    };
  }

  return row;
}

async function maybeSingle(supabase, table, column, value) {
  const { data, error } = await supabase.from(table).select('id, slug, title').eq(column, value).maybeSingle();
  if (error) throw error;
  return data;
}

async function publishBlogPost(supabase, table, row) {
  const duplicateSlug = await maybeSingle(supabase, table, 'slug', row.slug);
  if (duplicateSlug) {
    throw new Error(`Duplicate slug: ${row.slug}`);
  }

  const duplicateTitle = await maybeSingle(supabase, table, 'title', row.title);
  if (duplicateTitle) {
    throw new Error(`Duplicate title: ${row.title}`);
  }

  const { data: inserted, error: insertError } = await supabase
    .from(table)
    .insert(row)
    .select('*')
    .single();

  if (insertError) throw insertError;

  const { data: verified, error: verifyError } = await supabase
    .from(table)
    .select('*')
    .eq('slug', row.slug)
    .maybeSingle();

  if (verifyError) throw verifyError;
  if (!verified) throw new Error(`Insert verification failed for slug: ${row.slug}`);

  return { inserted, verified };
}

async function main() {
  const payload = readPayload(process.argv[2]);
  const row = normalizeBlogPostPayload(payload);
  const supabase = createSupabaseAdmin();
  const table = process.env.BLOG_TABLE?.trim() || 'blog_posts';
  const result = await publishBlogPost(supabase, table, rowForTable(table, row));

  console.log(JSON.stringify({ table, ...result }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
