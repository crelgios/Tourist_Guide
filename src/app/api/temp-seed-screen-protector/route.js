import { NextResponse } from "next/server";
import { adminSupabaseRequest, hasAdminSupabaseConfig } from "@/lib/supabase-rest";

const TOKEN = "seed-red-privacy-7f4b19e2";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("token") !== TOKEN) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasAdminSupabaseConfig()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const existing = await adminSupabaseRequest("/shop_products", {
      query: "select=*&slug=eq.red-privacy-screen-protector&limit=1"
    });

    if (existing?.[0]) {
      return NextResponse.json({ ok: true, product: existing[0], created: false });
    }

    const rows = await adminSupabaseRequest("/shop_products", {
      method: "POST",
      body: {
        name: "Red Privacy Tempered Glass Screen Protector for iPhone",
        slug: "red-privacy-screen-protector",
        category: "Phone Accessories",
        description: "Add visual privacy and everyday screen protection to your iPhone. The red privacy effect helps make the display harder to view from the sides while keeping the screen visible from the front.",
        price: 19.99,
        compare_at_price: 29.99,
        currency: "USD",
        images: [],
        video_url: "",
        variants: [{
          name: "Phone Model",
          values: ["iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max", "iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max"]
        }],
        offers: [],
        shipping_text: "Final delivery estimate will be added before launch.",
        status: "active",
        active: true
      },
      prefer: "return=representation"
    });

    const product = rows?.[0];
    if (!product?.id) throw new Error("Product was not created.");

    await adminSupabaseRequest("/shop_product_private", {
      method: "POST",
      body: {
        product_id: product.id,
        supplier_url: "",
        supplier_cost: null,
        source_note: "Migrated from the previous hardcoded screen-protector listing."
      },
      prefer: "resolution=merge-duplicates,return=minimal"
    });

    return NextResponse.json({ ok: true, product, created: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not seed product." }, { status: 500 });
  }
}
