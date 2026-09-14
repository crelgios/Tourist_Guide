import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import { adminSupabaseRequest, hasAdminSupabaseConfig } from "@/lib/supabase-rest";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

function notConfigured() {
  return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
}

function normalizeUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

export async function GET(request) {
  if (!getAdminSessionFromRequest(request)) return unauthorized();
  if (!hasAdminSupabaseConfig()) return notConfigured();

  try {
    const rows = await adminSupabaseRequest("/shop_products", {
      query: "select=*&order=sort_order.asc,name.asc"
    });
    return NextResponse.json({ products: rows || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!getAdminSessionFromRequest(request)) return unauthorized();
  if (!hasAdminSupabaseConfig()) return notConfigured();

  try {
    const body = await request.json();
    const id = String(body.id || "").trim();
    const affiliateUrl = normalizeUrl(body.affiliate_url);

    if (!id) return NextResponse.json({ error: "Product id is required." }, { status: 400 });
    if (!affiliateUrl) return NextResponse.json({ error: "Enter a valid affiliate URL." }, { status: 400 });

    const rows = await adminSupabaseRequest("/shop_products", {
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(id)}`,
      body: { affiliate_url: affiliateUrl },
      prefer: "return=representation"
    });

    revalidatePath("/shop");
    return NextResponse.json({ product: rows?.[0] || null });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
