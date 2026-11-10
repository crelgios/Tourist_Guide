import { NextResponse } from "next/server";

const TOKEN = "OV7hfUI9SNnVVSOmmncLAnt-TOQCIs4xIptFaoYcJrw";
const EXPIRES_AT = 1794297226472;

const ALLOWED = {
  "red-privacy-main.webp": { type: "image/webp", path: "red-privacy/red-privacy-main.webp" },
  "red-privacy-hand.webp": { type: "image/webp", path: "red-privacy/red-privacy-hand.webp" },
  "red-privacy-demo.mp4": { type: "video/mp4", path: "red-privacy/red-privacy-demo.mp4" }
};

export async function POST(request) {
  if (Date.now() > EXPIRES_AT) {
    return NextResponse.json({ error: "Upload window expired." }, { status: 410 });
  }

  if (request.headers.get("x-upload-token") !== TOKEN) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) {
    return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  const rule = ALLOWED[file.name];
  if (!rule || file.type !== rule.type || file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ error: "File is not allowed." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const objectPath = rule.path.split("/").map(encodeURIComponent).join("/");
  const upload = await fetch(
    `${supabaseUrl}/storage/v1/object/product-images/${objectPath}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRole,
        Authorization: `Bearer ${serviceRole}`,
        "Content-Type": rule.type,
        "x-upsert": "true"
      },
      body: bytes
    }
  );

  if (!upload.ok) {
    return NextResponse.json(
      { error: "Storage upload failed.", detail: await upload.text() },
      { status: 502 }
    );
  }

  return NextResponse.json({
    path: rule.path,
    url: `${supabaseUrl}/storage/v1/object/public/product-images/${objectPath}`
  });
}
