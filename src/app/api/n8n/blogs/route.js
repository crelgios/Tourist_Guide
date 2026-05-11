import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { adminSupabaseRequest, hasAdminSupabaseConfig } from "@/lib/supabase-rest";
import { normalizeBlogPayload, validateBlogPayload } from "@/lib/blog-utils";

function getBearerToken(request) {
  const authorization = request.headers.get("authorization") || "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
}

export async function POST(request) {
  const suppliedSecret = request.headers.get("x-n8n-secret") || getBearerToken(request);

  if (!process.env.N8N_API_SECRET || suppliedSecret !== process.env.N8N_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasAdminSupabaseConfig()) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const blog = normalizeBlogPayload(body);
    const errors = validateBlogPayload(blog);

    if (errors.length) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    const rows = await adminSupabaseRequest("/blogs", {
      method: "POST",
      query: "on_conflict=slug",
      body: blog,
      prefer: "resolution=merge-duplicates,return=representation"
    });

    revalidateTag("blogs");
    revalidateTag(`blog:${blog.slug}`);
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ ok: true, blog: rows?.[0] || null }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
