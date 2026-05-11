import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  adminAuthConfigured,
  createAdminSessionToken,
  getAdminCookieOptions,
  isValidAdminLogin
} from "@/lib/admin-auth";

export async function POST(request) {
  if (!adminAuthConfigured()) {
    return NextResponse.json(
      { error: "Admin login is not configured. Add ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const username = String(body.username || "");
  const password = String(body.password || "");

  if (!isValidAdminLogin(username, password)) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, username });
  response.cookies.set(ADMIN_COOKIE_NAME, createAdminSessionToken(username), getAdminCookieOptions());
  return response;
}
