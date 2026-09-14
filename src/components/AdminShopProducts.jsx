"use client";

import { useEffect, useState } from "react";

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

export default function AdminShopProducts() {
  const [products, setProducts] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [status, setStatus] = useState("Loading shop products...");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    try {
      const data = await readJson(await fetch("/api/admin/shop-products", { cache: "no-store" }));
      const rows = data.products || [];
      setProducts(rows);
      setDrafts(Object.fromEntries(rows.map((p) => [p.id, p.affiliate_url || ""])));
      setStatus(`${rows.length} shop products loaded. Paste a new Amazon affiliate link and tap Save.`);
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function save(product) {
    setSavingId(product.id);
    setStatus(`Saving ${product.name}...`);
    try {
      await readJson(await fetch("/api/admin/shop-products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, affiliate_url: drafts[product.id] || "" })
      }));
      setStatus(`${product.name} affiliate link updated. The shop will use the new link automatically.`);
      await loadProducts();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-soft sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-orange-600">Aliwvide Shop</p>
          <h2 className="mt-1 text-3xl font-black">Affiliate Link Manager</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">Update Amazon affiliate links here. You do not need to edit GitHub or redeploy the website after changing a link.</p>
        </div>
        <button type="button" onClick={loadProducts} className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-bold">Refresh</button>
      </div>

      <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">{status}</p>

      <div className="mt-6 grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="rounded-2xl border border-gray-200 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <div className="font-black text-gray-950">{product.name}</div>
                <div className="text-xs text-gray-500">Product #{product.sort_order}</div>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">Active</span>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <input
                type="url"
                value={drafts[product.id] ?? ""}
                onChange={(e) => setDrafts((current) => ({ ...current, [product.id]: e.target.value }))}
                placeholder="Paste Amazon affiliate link"
                className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
              />
              <button
                type="button"
                disabled={savingId === product.id}
                onClick={() => save(product)}
                className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-black text-white disabled:opacity-60"
              >
                {savingId === product.id ? "Saving..." : "Save Link"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
