import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

function safeName(value) {
  return String(value || "image")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-100) || "image";
}

export async function POST(request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!supabaseUrl || !serviceRole) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be smaller than 8 MB." }, { status: 400 });
    }

    const objectPath = `${Date.now()}-${crypto.randomUUID()}-${safeName(file.name)}`;
    const uploadUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/product-images/${encodeURIComponent(objectPath)}`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: serviceRole,
        Authorization: `Bearer ${serviceRole}`,
        "Content-Type": file.type,
        "x-upsert": "false"
      },
      body: await file.arrayBuffer()
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Image upload failed: ${response.status} ${message}`);
    }

    const publicUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/product-images/${encodeURIComponent(objectPath)}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
