import { NextResponse } from "next/server";
import crypto from "crypto";

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

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  let isMatch = false;
  if (tokenBuffer.length === expectedBuffer.length) {
    isMatch = crypto.timingSafeEqual(tokenBuffer, expectedBuffer);
  } else {
    // Prevent timing analysis of lengths
    crypto.timingSafeEqual(tokenBuffer, tokenBuffer);
  }

  if (!isMatch) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  return null; // Auth passed
}
