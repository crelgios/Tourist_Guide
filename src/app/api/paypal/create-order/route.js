import { NextResponse } from "next/server";
import { adminSupabaseRequest, hasAdminSupabaseConfig } from "@/lib/supabase-rest";
import { createPayPalOrder, hasPayPalConfig } from "@/lib/paypal";

function cleanText(value, max = 200) {
  return String(value || "").trim().slice(0, max);
}

function makeOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase();
  return `AV-${stamp}-${suffix}`;
}

function getOffer(product, offerId) {
  const offers = Array.isArray(product.offers) ? product.offers : [];
  const configured = offers.find((offer) => offer?.id === offerId);
  if (configured && Number.isFinite(Number(configured.price))) {
    return {
      id: configured.id,
      label: configured.label || `Buy ${configured.quantity || 1}`,
      quantity: Math.max(1, Number(configured.quantity) || 1),
      price: Number(configured.price)
    };
  }

  if (!offers.length && Number.isFinite(Number(product.price))) {
    return {
      id: "single",
      label: "Buy 1",
      quantity: 1,
      price: Number(product.price)
    };
  }

  return null;
}

export async function POST(request) {
  if (!hasAdminSupabaseConfig()) {
    return NextResponse.json({ error: "Shop database is not configured." }, { status: 503 });
  }
  if (!hasPayPalConfig()) {
    return NextResponse.json({ error: "PayPal is not configured yet." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const slug = cleanText(body.product, 100);
    const offerId = cleanText(body.offer, 100);
    const customer = {
      first_name: cleanText(body.customer?.first_name, 80),
      last_name: cleanText(body.customer?.last_name, 80),
      email: cleanText(body.customer?.email, 160),
      phone: cleanText(body.customer?.phone, 40),
      address: cleanText(body.customer?.address, 240),
      city: cleanText(body.customer?.city, 120),
      state: cleanText(body.customer?.state, 120),
      postal_code: cleanText(body.customer?.postal_code, 40),
      country: cleanText(body.customer?.country, 80)
    };

    if (!slug) {
      return NextResponse.json({ error: "Product is required." }, { status: 400 });
    }

    const required = ["first_name", "last_name", "email", "address", "city", "postal_code", "country"];
    const missing = required.find((field) => !customer[field]);
    if (missing) {
      return NextResponse.json({ error: "Complete all required shipping fields." }, { status: 400 });
    }

    const rows = await adminSupabaseRequest("/shop_products", {
      query: `select=id,name,slug,price,currency,images,offers&slug=eq.${encodeURIComponent(slug)}&active=eq.true&status=eq.active&limit=1`
    });
    const product = rows?.[0];
    if (!product) {
      return NextResponse.json({ error: "Product is unavailable." }, { status: 404 });
    }

    const offer = getOffer(product, offerId);
    if (!offer) {
      return NextResponse.json({ error: "Selected offer is unavailable." }, { status: 400 });
    }

    const selectedOptions = body.selected_options && typeof body.selected_options === "object"
      ? Object.fromEntries(
          Object.entries(body.selected_options)
            .slice(0, 20)
            .map(([key, value]) => [cleanText(key, 60), cleanText(value, 100)])
            .filter(([key, value]) => key && value)
        )
      : {};

    const amount = Number(offer.price).toFixed(2);
    const currency = cleanText(product.currency || "USD", 3).toUpperCase();
    const orderNumber = makeOrderNumber();

    const paypalOrder = await createPayPalOrder({
      amount,
      currency,
      description: `${product.name} — ${offer.label}`,
      customId: orderNumber
    });

    await adminSupabaseRequest("/shop_orders", {
      method: "POST",
      body: {
        order_number: orderNumber,
        product_id: product.id,
        product_snapshot: {
          name: product.name,
          slug: product.slug,
          image: Array.isArray(product.images) ? product.images[0] || "" : "",
          offer
        },
        customer,
        selected_options: selectedOptions,
        quantity: offer.quantity,
        amount,
        currency,
        source: cleanText(body.source, 120),
        paypal_order_id: paypalOrder.id,
        payment_status: "pending",
        fulfilment_status: "new"
      },
      prefer: "return=minimal"
    });

    return NextResponse.json({
      id: paypalOrder.id,
      order_number: orderNumber
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not start PayPal checkout." }, { status: 500 });
  }
}
