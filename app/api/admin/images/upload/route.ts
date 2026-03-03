import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { validateAdminRequest } from "@/lib/admin-auth";

const ADMIN_HEADERS = { "Cache-Control": "no-store" };

const ALLOWED_BUCKETS = ["cover-images", "post-images"] as const;
type AllowedBucket = (typeof ALLOWED_BUCKETS)[number];

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase env vars not configured");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

// ---------------------------------------------------------------------------
// POST /api/admin/images/upload
// Accepts: multipart/form-data with one or more `file` fields
// Query param: ?bucket=cover-images|post-images  (defaults to post-images)
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const authError = validateAdminRequest(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const bucketParam = searchParams.get("bucket") ?? "post-images";

  if (!ALLOWED_BUCKETS.includes(bucketParam as AllowedBucket)) {
    return NextResponse.json(
      {
        ok: false,
        error: "INVALID_BUCKET",
        message: `Allowed buckets: ${ALLOWED_BUCKETS.join(", ")}`,
      },
      { status: 400, headers: ADMIN_HEADERS },
    );
  }

  const bucket = bucketParam as AllowedBucket;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_FORM_DATA" },
      { status: 400, headers: ADMIN_HEADERS },
    );
  }

  const files = formData.getAll("file") as File[];
  if (files.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "NO_FILES",
        message: "Provide at least one file field.",
      },
      { status: 400, headers: ADMIN_HEADERS },
    );
  }

  let supabase: ReturnType<typeof getSupabaseAdmin>;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { ok: false, error: "STORAGE_NOT_CONFIGURED" },
      { status: 503, headers: ADMIN_HEADERS },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const results: Array<{ name: string; url: string; error?: string }> = [];

  for (const file of files) {
    // Generate a unique path to avoid collisions
    const ext = file.name.split(".").pop() ?? "bin";
    const base = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9-_]/gi, "-");
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const storagePath = `${uniqueId}-${base}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      results.push({ name: file.name, url: "", error: error.message });
      continue;
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;
    results.push({ name: file.name, url: publicUrl });
  }

  const allFailed = results.every((r) => r.error);

  return NextResponse.json(
    { ok: !allFailed, uploaded: results },
    {
      status: allFailed ? 500 : 200,
      headers: ADMIN_HEADERS,
    },
  );
}
