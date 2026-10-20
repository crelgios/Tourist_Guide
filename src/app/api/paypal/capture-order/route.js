import { NextResponse } from "next/server";
import { adminSupabaseRequest, hasAdminSupabaseConfig } from "@/lib/supabase-rest";
import { capturePayPalOrder, hasPayPalConfig } from "@/lib/paypal";

export async function POST(request) {
  if (!hasAdminSupabaseConfig()) {
    return NextResponse.json({ error: "Shop database is not configured." }, { status: 503 });
  }
  if (!hasPayPalConfig()) {
    return NextResponse.json({ error: "PayPal is not configured yet." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const orderId = String(body.orderID || "").trim();

    if (!orderId || !/^[A-Z0-9]+$/i.test(orderId)) {
      return NextResponse.json({ error: "Invalid PayPal order." }, { status: 400 });
    }

    const rows = await adminSupabaseRequest("/shop_orders", {
      query: `select=id,order_number,amount,currency,payment_status&paypal_order_id=eq.${encodeURIComponent(orderId)}&limit=1`
    });
    const localOrder = rows?.[0];

    if (!localOrder) {
      return NextResponse.json({ error: "Order was not found." }, { status: 404 });
    }

    if (localOrder.payment_status === "paid") {
      return NextResponse.json({
        status: "COMPLETED",
        order_number: localOrder.order_number
      });
    }

    const paypalData = await capturePayPalOrder(orderId);
    const capture = paypalData?.purchase_units?.[0]?.payments?.captures?.[0];

    const captureStatus = capture?.status || paypalData?.status || "";
    const capturedValue = capture?.amount?.value;
    const capturedCurrency = capture?.amount?.currency_code;

    const amountMatches = Number(capturedValue) === Number(localOrder.amount);
    const currencyMatches = String(capturedCurrency || "").toUpperCase() === String(localOrder.currency || "").toUpperCase();

    if (captureStatus !== "COMPLETED" || !amountMatches || !currencyMatches) {
      await adminSupabaseRequest("/shop_orders", {
        method: "PATCH",
        query: `id=eq.${encodeURIComponent(localOrder.id)}`,
        body: { payment_status: "failed" },
        prefer: "return=minimal"
      });
      return NextResponse.json({ error: "PayPal payment could not be verified." }, { status: 409 });
    }

    await adminSupabaseRequest("/shop_orders", {
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(localOrder.id)}`,
      body: {
        payment_status: "paid",
        paypal_capture_id: capture?.id || ""
      },
      prefer: "return=minimal"
    });

    return NextResponse.json({
      status: "COMPLETED",
      order_number: localOrder.order_number
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not capture PayPal payment." }, { status: 500 });
  }
}
