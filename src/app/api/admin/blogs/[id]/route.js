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

export async function PATCH(request, { params }) {
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
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(params.id)}`,
      body: blog,
      prefer: "return=representation"
    });

    if (!rows?.length) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    revalidateTag("blogs");
    revalidateTag(`blog:${blog.slug}`);
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ blog: rows[0] });
  } catch (error) {
    const duplicate = error.message.includes("duplicate key");
    return NextResponse.json(
      { error: duplicate ? "A blog with this slug already exists." : error.message },
      { status: duplicate ? 409 : 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  if (!getAdminSessionFromRequest(request)) return unauthorized();
  if (!hasAdminSupabaseConfig()) return notConfigured();

  try {
    const rows = await adminSupabaseRequest("/blogs", {
      method: "DELETE",
      query: `id=eq.${encodeURIComponent(params.id)}`,
      prefer: "return=representation"
    });

    if (!rows?.length) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    const blog = rows[0];
    revalidateTag("blogs");
    revalidateTag(`blog:${blog.slug}`);
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ ok: true, blog });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
