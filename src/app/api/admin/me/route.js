import { NextResponse } from "next/server";
import { adminAuthConfigured, getAdminSessionFromRequest } from "@/lib/admin-auth";

export async function GET(request) {
  if (!adminAuthConfigured()) {
    return NextResponse.json({ authenticated: false, configured: false }, { status: 503 });
  }

  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ authenticated: false, configured: true }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, configured: true, username: session.username });
}
