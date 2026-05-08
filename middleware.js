import { NextResponse } from "next/server";

const HIDDEN_ADMIN_PATH = "/secure-aliwvide-control-9xq2m";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Aliwvide Secure Admin"',
      "Cache-Control": "no-store"
    }
  });
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(HIDDEN_ADMIN_PATH)) {
    return NextResponse.next();
  }

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    return new NextResponse("Admin login is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in environment variables.", {
      status: 503,
      headers: {
        "Cache-Control": "no-store"
      }
    });
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return unauthorized();
  }

  try {
    const encoded = authHeader.split(" ")[1];
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return unauthorized();
    }

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    if (username !== adminUser || password !== adminPassword) {
      return unauthorized();
    }

    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: ["/secure-aliwvide-control-9xq2m/:path*"]
};
