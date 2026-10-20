import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import { adminSupabaseRequest, hasAdminSupabaseConfig } from "@/lib/supabase-rest";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET(request) {
  if (!getAdminSessionFromRequest(request)) return unauthorized();
  if (!hasAdminSupabaseConfig()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const rows = await adminSupabaseRequest("/shop_orders", {
      query: "select=*&order=created_at.desc&limit=200"
    });
    return NextResponse.json({ orders: rows || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!getAdminSessionFromRequest(request)) return unauthorized();
  if (!hasAdminSupabaseConfig()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const id = String(body.id || "").trim();
    if (!id) {
      return NextResponse.json({ error: "Order id is required." }, { status: 400 });
    }

    const allowedStatuses = ["new", "ordered", "shipped", "delivered", "cancelled"];
    const fulfilmentStatus = String(body.fulfilment_status || "").trim();
    if (!allowedStatuses.includes(fulfilmentStatus)) {
      return NextResponse.json({ error: "Invalid fulfilment status." }, { status: 400 });
    }

    const rows = await adminSupabaseRequest("/shop_orders", {
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(id)}`,
      body: {
        fulfilment_status: fulfilmentStatus,
        tracking_carrier: String(body.tracking_carrier || "").trim().slice(0, 100),
        tracking_number: String(body.tracking_number || "").trim().slice(0, 160)
      },
      prefer: "return=representation"
    });

    return NextResponse.json({ order: rows?.[0] || null });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
