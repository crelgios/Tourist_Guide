"use client";

import { useEffect, useMemo, useState } from "react";

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function money(value, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD"
    }).format(Number(value || 0));
  } catch {
    return `${currency || "USD"} ${Number(value || 0).toFixed(2)}`;
  }
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

const fulfilmentOptions = [
  ["new", "New"],
  ["ordered", "Ordered on AliExpress"],
  ["shipped", "Shipped"],
  ["delivered", "Delivered"],
  ["cancelled", "Cancelled"]
];

export default function AdminShopOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("Loading orders...");
  const [savingId, setSavingId] = useState("");
  const [drafts, setDrafts] = useState({});

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    try {
      const data = await readJson(await fetch("/api/admin/shop-orders", { cache: "no-store" }));
      const rows = data.orders || [];
      setOrders(rows);
      setDrafts(Object.fromEntries(rows.map((order) => [order.id, {
        fulfilment_status: order.fulfilment_status || "new",
        tracking_carrier: order.tracking_carrier || "",
        tracking_number: order.tracking_number || ""
      }])));
      setStatus(`${rows.length} orders loaded.`);
    } catch (error) {
      setStatus(error.message);
    }
  }

  function updateDraft(id, key, value) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...(current[id] || {}),
        [key]: value
      }
    }));
  }

  async function save(order) {
    setSavingId(order.id);
    setStatus(`Updating ${order.order_number}...`);
    try {
      await readJson(await fetch("/api/admin/shop-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          ...drafts[order.id]
        })
      }));
      await loadOrders();
      setStatus(`${order.order_number} updated.`);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSavingId("");
    }
  }

  const paidCount = useMemo(
    () => orders.filter((order) => order.payment_status === "paid").length,
    [orders]
  );

  return (
    <section className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-soft sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Aliwvide Orders</p>
          <h2 className="mt-1 text-3xl font-black">Dropshipping Orders</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            Paid PayPal orders appear here with the customer shipping address. After you place the matching AliExpress order, update its fulfilment status and tracking.
          </p>
        </div>
        <button type="button" onClick={loadOrders} className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-bold">
          Refresh
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-gray-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Total orders</div>
          <div className="mt-1 text-2xl font-black">{orders.length}</div>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Paid</div>
          <div className="mt-1 text-2xl font-black text-emerald-950">{paidCount}</div>
        </div>
        <div className="rounded-2xl bg-amber-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Needs fulfilment</div>
          <div className="mt-1 text-2xl font-black text-amber-950">
            {orders.filter((order) => order.payment_status === "paid" && order.fulfilment_status === "new").length}
          </div>
        </div>
      </div>

      <p className="mt-5 rounded-2xl bg-gray-50 p-4 text-sm font-semibold text-gray-700">{status}</p>

      <div className="mt-6 grid gap-5">
        {orders.map((order) => {
          const customer = order.customer || {};
          const product = order.product_snapshot || {};
          const offer = product.offer || {};
          const draft = drafts[order.id] || {};

          return (
            <article key={order.id} className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-black">{order.order_number}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${order.payment_status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                      {order.payment_status}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase text-gray-600">
                      {order.fulfilment_status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{formatDate(order.created_at)}</div>
                </div>
                <div className="text-left lg:text-right">
                  <div className="text-xl font-black">{money(order.amount, order.currency)}</div>
                  <div className="text-xs text-gray-500">PayPal order: {order.paypal_order_id || "—"}</div>
                </div>
              </div>

              <div className="grid gap-5 p-4 lg:grid-cols-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-gray-500">Product</div>
                  <div className="mt-2 flex gap-3">
                    {product.image ? (
                      <img src={product.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                    ) : null}
                    <div>
                      <div className="font-black">{product.name || "Product"}</div>
                      <div className="mt-1 text-sm text-emerald-700">{offer.label || `Qty ${order.quantity}`}</div>
                      {Object.entries(order.selected_options || {}).map(([key, value]) => (
                        <div key={key} className="text-xs capitalize text-gray-500">{key}: {value}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-gray-500">Customer & shipping</div>
                  <div className="mt-2 text-sm leading-6 text-gray-700">
                    <div className="font-black text-gray-950">{customer.first_name} {customer.last_name}</div>
                    <div>{customer.address}</div>
                    <div>{customer.city}{customer.state ? `, ${customer.state}` : ""} {customer.postal_code}</div>
                    <div>{customer.country}</div>
                    <div className="mt-1">{customer.email}</div>
                    {customer.phone ? <div>{customer.phone}</div> : null}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-gray-500">Fulfilment</div>
                  <div className="mt-2 grid gap-2">
                    <select
                      value={draft.fulfilment_status || "new"}
                      onChange={(e) => updateDraft(order.id, "fulfilment_status", e.target.value)}
                      className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
                    >
                      {fulfilmentOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                    <input
                      value={draft.tracking_carrier || ""}
                      onChange={(e) => updateDraft(order.id, "tracking_carrier", e.target.value)}
                      placeholder="Tracking carrier"
                      className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
                    />
                    <input
                      value={draft.tracking_number || ""}
                      onChange={(e) => updateDraft(order.id, "tracking_number", e.target.value)}
                      placeholder="Tracking number"
                      className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
                    />
                    <button
                      type="button"
                      disabled={savingId === order.id}
                      onClick={() => save(order)}
                      className="rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-black text-white disabled:opacity-60"
                    >
                      {savingId === order.id ? "Saving..." : "Save Fulfilment"}
                    </button>
                  </div>
                </div>
              </div>

              {order.source ? (
                <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
                  Source: {order.source}
                </div>
              ) : null}
            </article>
          );
        })}

        {!orders.length ? (
          <div className="rounded-2xl bg-gray-50 p-10 text-center text-sm text-gray-500">
            No orders yet. Paid PayPal orders will appear here.
          </div>
        ) : null}
      </div>
    </section>
  );
}
