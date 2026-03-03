import { NextResponse } from "next/server";

/**
 * Validates incoming admin API requests via static Bearer token.
 * Returns a NextResponse with an error if auth fails, or null if auth passes.
 *
 * Phase 1 MVP: simple string comparison against BEHINDTHETECHZ_API_TOKEN env var.
 * Will be upgraded to JWT verification in a later phase.
 */
export function validateAdminRequest(request: Request): NextResponse | null {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const expected =
    process.env.BEHINDTHETECHZ_API_TOKEN ?? process.env.ADMIN_API_TOKEN;

  if (!expected) {
    // Fail closed: if no token is configured on the server, reject everything
    return NextResponse.json(
      { ok: false, error: "ADMIN_AUTH_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  if (!token || token !== expected) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  return null; // Auth passed
}
