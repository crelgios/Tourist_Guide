import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import { adminSupabaseRequest, hasAdminSupabaseConfig } from "@/lib/supabase-rest";
import { normalizeBlogPayload, validateBlogPayload } from "@/lib/blog-utils";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

function notConfigured() {
  return NextResponse.json(
    { error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
    { status: 503 }
  );
}

export async function GET(request) {
  if (!getAdminSessionFromRequest(request)) return unauthorized();
  if (!hasAdminSupabaseConfig()) return notConfigured();

  try {
    const rows = await adminSupabaseRequest("/blogs", {
      query: "select=*&order=created_at.desc"
    });
    return NextResponse.json({ blogs: rows || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!getAdminSessionFromRequest(request)) return unauthorized();
  if (!hasAdminSupabaseConfig()) return notConfigured();

  try {
    const body = await request.json();
    const blog = normalizeBlogPayload(body);
    const errors = validateBlogPayload(blog);

    if (errors.length) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    const rows = await adminSupabaseRequest("/blogs", {
      method: "POST",
      body: blog,
      prefer: "return=representation"
    });

    revalidateTag("blogs");
    revalidateTag(`blog:${blog.slug}`);
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ blog: rows?.[0] || null }, { status: 201 });
  } catch (error) {
    const duplicate = error.message.includes("duplicate key");
    return NextResponse.json(
      { error: duplicate ? "A blog with this slug already exists." : error.message },
      { status: duplicate ? 409 : 500 }
    );
  }
}
