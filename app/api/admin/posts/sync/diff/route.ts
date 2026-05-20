import { NextResponse } from "next/server";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/admin-auth";
import { syncManifestSchema, formatZodErrors } from "@/lib/admin/validation";

const ADMIN_HEADERS = { "Cache-Control": "no-store" };

/**
 * Compute a quick hash of content for comparison.
 */
function hashContent(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

// ---------------------------------------------------------------------------
// POST /api/admin/posts/sync/diff — Compare local manifest against DB
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const authError = validateAdminRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = syncManifestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "INVALID_PAYLOAD",
          details: formatZodErrors(parsed.error),
        },
        { status: 400, headers: ADMIN_HEADERS },
      );
    }

    const { manifest } = parsed.data;

    // Get all posts from DB (only slug + contentMdx + updatedAt needed)
    const dbPosts = await prisma.post.findMany({
      select: { slug: true, contentMdx: true, updatedAt: true },
    });

    const dbMap = new Map(
      dbPosts.map((p) => [
        p.slug,
        { contentHash: hashContent(p.contentMdx), updatedAt: p.updatedAt },
      ]),
    );

    const localSlugs = new Set(manifest.map((m) => m.slug));

    type Action = {
      slug: string;
      action: "create" | "update" | "delete_remote" | "noop";
      reason?: string;
    };

    const actions: Action[] = [];

    // Check each local entry against DB
    for (const entry of manifest) {
      const dbEntry = dbMap.get(entry.slug);

      if (!dbEntry) {
        actions.push({ slug: entry.slug, action: "create" });
      } else if (dbEntry.contentHash !== entry.contentHash) {
        actions.push({
          slug: entry.slug,
          action: "update",
          reason: "content_changed",
        });
      } else {
        actions.push({ slug: entry.slug, action: "noop" });
      }
    }

    // Posts in DB but not in local manifest → candidate for remote deletion
    for (const [slug] of dbMap) {
      if (!localSlugs.has(slug)) {
        actions.push({ slug, action: "delete_remote" });
      }
    }

    return NextResponse.json({ ok: true, actions }, { headers: ADMIN_HEADERS });
  } catch (error) {
    console.error("[admin/posts/sync/diff]", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }
}
