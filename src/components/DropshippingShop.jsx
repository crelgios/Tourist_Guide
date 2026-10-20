"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Sparkles } from "lucide-react";

function money(value, currency) {
  if (value === null || value === undefined || value === "") return "";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "USD" }).format(Number(value));
  } catch {
    return `${currency || "USD"} ${Number(value).toFixed(2)}`;
  }
}

export default function DropshippingShop({ products = [] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const queryMatch = !q || [product.name, product.category, product.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
      return categoryMatch && queryMatch;
    });
  }, [products, query, category]);

  return (
    <main className="min-h-screen bg-[#f6f6f4] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">Aliwvide Shop</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Products worth discovering.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Shop products featured on Aliwvide and Instagram. Open any product to see photos, options, price and delivery information.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">
              <ShoppingBag className="h-4 w-4" />
              Direct checkout store
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 md:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent py-3.5 text-sm outline-none"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap rounded-full px-4 py-3 text-sm font-black transition ${category === item ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {filtered.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {filtered.map((product) => {
              const image = Array.isArray(product.images) ? product.images[0] : "";
              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    {image ? (
                      <img src={image} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400"><ShoppingBag className="h-10 w-10" /></div>
                    )}
                    {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) ? (
                      <span className="absolute left-2 top-2 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black uppercase text-white">Sale</span>
                    ) : null}
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">{product.category || "Product"}</p>
                    <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-black leading-5 sm:text-base">{product.name}</h2>
                    <div className="mt-3 flex flex-wrap items-baseline gap-2">
                      <span className="font-black">{money(product.price, product.currency)}</span>
                      {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) ? (
                        <span className="text-xs text-slate-400 line-through">{money(product.compare_at_price, product.currency)}</span>
                      ) : null}
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs font-bold text-slate-600">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      View product
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-slate-400" />
            <h2 className="mt-3 text-xl font-black">{products.length ? "No products found" : "Products are being added"}</h2>
            <p className="mt-2 text-sm text-slate-500">{products.length ? "Try another search or category." : "Check back soon for new Aliwvide products."}</p>
          </div>
        )}
      </section>
    </main>
  );
}
