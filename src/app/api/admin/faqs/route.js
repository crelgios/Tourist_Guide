import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import { adminSupabaseRequest, hasAdminSupabaseConfig } from "@/lib/supabase-rest";
import { normalizeFaqPayload, validateFaqPayload } from "@/lib/faq-utils";

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
    const rows = await adminSupabaseRequest("/faqs", {
      query: "select=*&order=sort_order.asc,created_at.asc"
    });
    return NextResponse.json({ faqs: rows || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!getAdminSessionFromRequest(request)) return unauthorized();
  if (!hasAdminSupabaseConfig()) return notConfigured();

  try {
    const body = await request.json();
    const faq = normalizeFaqPayload(body);
    const errors = validateFaqPayload(faq);

    if (errors.length) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    const rows = await adminSupabaseRequest("/faqs", {
      method: "POST",
      body: faq,
      prefer: "return=representation"
    });

    revalidateTag("faqs");
    revalidatePath("/");
    revalidatePath("/faq");

    return NextResponse.json({ faq: rows?.[0] || null }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
