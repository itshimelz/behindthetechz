import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/admin-auth";

const ADMIN_HEADERS = { "Cache-Control": "no-store" };

// ---------------------------------------------------------------------------
// GET /api/admin/newsletter — List subscribers with count
// ---------------------------------------------------------------------------
export async function GET(request: Request) {
  const authError = validateAdminRequest(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";

    const where = activeOnly
      ? { confirmed: true, unsubscribedAt: null }
      : {};

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: { subscribedAt: "desc" },
        select: {
          id: true,
          email: true,
          confirmed: true,
          subscribedAt: true,
          unsubscribedAt: true,
        },
      }),
      prisma.subscriber.count({ where }),
    ]);

    return NextResponse.json(
      {
        ok: true,
        total,
        subscribers: subscribers.map((s) => ({
          id: s.id,
          email: s.email,
          confirmed: s.confirmed,
          subscribedAt: s.subscribedAt.toISOString(),
          unsubscribedAt: s.unsubscribedAt?.toISOString() ?? null,
        })),
      },
      { headers: ADMIN_HEADERS },
    );
  } catch (error) {
    console.error("[admin/newsletter] GET error:", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/admin/newsletter — Remove a subscriber by email or id
// ---------------------------------------------------------------------------
export async function DELETE(request: Request) {
  const authError = validateAdminRequest(request);
  if (authError) return authError;

  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "INVALID_BODY", message: "Request body must be JSON" },
        { status: 400, headers: ADMIN_HEADERS },
      );
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
    const id = typeof body.id === "string" ? body.id : null;

    if (!email && !id) {
      return NextResponse.json(
        { ok: false, error: "MISSING_FIELD", message: "Provide either `email` or `id`" },
        { status: 400, headers: ADMIN_HEADERS },
      );
    }

    const where = email ? { email } : { id: id! };

    const existing = await prisma.subscriber.findUnique({ where });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "NOT_FOUND", message: "Subscriber not found" },
        { status: 404, headers: ADMIN_HEADERS },
      );
    }

    await prisma.subscriber.delete({ where });

    return NextResponse.json(
      { ok: true, deleted: existing.email },
      { headers: ADMIN_HEADERS },
    );
  } catch (error) {
    console.error("[admin/newsletter] DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }
}
