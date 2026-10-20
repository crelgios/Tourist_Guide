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

function makeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function normalizeUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!["https:", "http:"].includes(parsed.protocol)) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function normalizeImages(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || "").trim())
    .filter((item) => normalizeUrl(item))
    .slice(0, 12);
}

function normalizeVariants(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 20).map((variant) => ({
    name: String(variant?.name || "").trim().slice(0, 60),
    values: Array.isArray(variant?.values)
      ? variant.values.map((v) => String(v || "").trim()).filter(Boolean).slice(0, 30)
      : []
  })).filter((variant) => variant.name && variant.values.length);
}

function publicPayload(body) {
  const name = String(body.name || "").trim();
  const slug = makeSlug(body.slug || name);
  const status = body.status === "active" ? "active" : "draft";
  return {
    name,
    slug,
    category: String(body.category || "General").trim() || "General",
    description: String(body.description || "").trim(),
    price: numberOrNull(body.price),
    compare_at_price: numberOrNull(body.compare_at_price),
    currency: String(body.currency || "USD").trim().toUpperCase().slice(0, 3) || "USD",
    images: normalizeImages(body.images),
    video_url: normalizeUrl(body.video_url),
    variants: normalizeVariants(body.variants),
    shipping_text: String(body.shipping_text || "").trim(),
    status,
    active: status === "active"
  };
}

function privatePayload(body, productId) {
  return {
    product_id: productId,
    supplier_url: normalizeUrl(body.supplier_url),
    supplier_cost: numberOrNull(body.supplier_cost),
    source_note: String(body.source_note || "").trim()
  };
}

async function getProductsWithPrivateData() {
  const [products, privateRows] = await Promise.all([
    adminSupabaseRequest("/shop_products", {
      query: "select=*&order=sort_order.asc,name.asc"
    }),
    adminSupabaseRequest("/shop_product_private", {
      query: "select=product_id,supplier_url,supplier_cost,source_note"
    })
  ]);
  const privateMap = Object.fromEntries((privateRows || []).map((row) => [row.product_id, row]));
  return (products || []).map((product) => ({
    ...product,
    supplier_url: privateMap[product.id]?.supplier_url || "",
    supplier_cost: privateMap[product.id]?.supplier_cost ?? null,
    source_note: privateMap[product.id]?.source_note || ""
  }));
}

export async function GET(request) {
  if (!getAdminSessionFromRequest(request)) return unauthorized();
  if (!hasAdminSupabaseConfig()) return notConfigured();

  try {
    return NextResponse.json({ products: await getProductsWithPrivateData() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!getAdminSessionFromRequest(request)) return unauthorized();
  if (!hasAdminSupabaseConfig()) return notConfigured();

  try {
    const body = await request.json();
    const product = publicPayload(body);
    if (!product.name) return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    if (!product.slug) return NextResponse.json({ error: "Product slug is required." }, { status: 400 });
    if (product.price === null) return NextResponse.json({ error: "Enter a valid selling price." }, { status: 400 });

    const rows = await adminSupabaseRequest("/shop_products", {
      method: "POST",
      body: product,
      prefer: "return=representation"
    });
    const created = rows?.[0];
    if (!created?.id) throw new Error("Product was created but no product id was returned.");

    await adminSupabaseRequest("/shop_product_private", {
      method: "POST",
      body: privatePayload(body, created.id),
      prefer: "resolution=merge-duplicates,return=minimal"
    });

    revalidatePath("/shop");
    revalidatePath(`/shop/${product.slug}`);
    return NextResponse.json({ product: created });
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
    if (!id) return NextResponse.json({ error: "Product id is required." }, { status: 400 });

    const product = publicPayload(body);
    if (!product.name) return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    if (!product.slug) return NextResponse.json({ error: "Product slug is required." }, { status: 400 });
    if (product.price === null) return NextResponse.json({ error: "Enter a valid selling price." }, { status: 400 });

    const rows = await adminSupabaseRequest("/shop_products", {
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(id)}`,
      body: product,
      prefer: "return=representation"
    });

    await adminSupabaseRequest("/shop_product_private", {
      method: "POST",
      body: privatePayload(body, id),
      prefer: "resolution=merge-duplicates,return=minimal"
    });

    revalidatePath("/shop");
    revalidatePath(`/shop/${product.slug}`);
    return NextResponse.json({ product: rows?.[0] || null });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!getAdminSessionFromRequest(request)) return unauthorized();
  if (!hasAdminSupabaseConfig()) return notConfigured();

  try {
    const body = await request.json();
    const id = String(body.id || "").trim();
    if (!id) return NextResponse.json({ error: "Product id is required." }, { status: 400 });

    await adminSupabaseRequest("/shop_products", {
      method: "DELETE",
      query: `id=eq.${encodeURIComponent(id)}`,
      prefer: "return=minimal"
    });
    revalidatePath("/shop");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
