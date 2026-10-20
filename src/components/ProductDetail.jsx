"use client";

import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, ShoppingBag, Truck } from "lucide-react";

function money(value, currency) {
  if (value === null || value === undefined || value === "") return "";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "USD" }).format(Number(value));
  } catch {
    return `${currency || "USD"} ${Number(value).toFixed(2)}`;
  }
}

export default function ProductDetail({ product, source = "" }) {
  const images = Array.isArray(product.images) ? product.images : [];
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(variants.map((variant) => [variant.name, variant.values?.[0] || ""]))
  );

  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("product", product.slug);
    params.set("qty", String(quantity));
    Object.entries(selected).forEach(([key, value]) => {
      if (value) params.set(`option_${key.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`, value);
    });
    if (source) params.set("src", source);
    return `/checkout?${params.toString()}`;
  }, [product.slug, quantity, selected, source]);

  function previousImage() {
    setActiveImage((current) => (current <= 0 ? Math.max(images.length - 1, 0) : current - 1));
  }

  function nextImage() {
    setActiveImage((current) => (current >= images.length - 1 ? 0 : current + 1));
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-10">
        <a href="/shop" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950">
          <ChevronLeft className="h-4 w-4" /> Back to shop
        </a>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <section>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100">
              <div className="aspect-square">
                {images[activeImage] ? (
                  <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400"><ShoppingBag className="h-14 w-14" /></div>
                )}
              </div>
              {images.length > 1 && (
                <>
                  <button type="button" onClick={previousImage} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow" aria-label="Previous image">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow" aria-label="Next image">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={image + index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${activeImage === index ? "border-slate-950" : "border-transparent"}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="lg:sticky lg:top-6 lg:self-start">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">{product.category || "Aliwvide Shop"}</p>
            <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">{product.name}</h1>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-black">{money(product.price, product.currency)}</span>
              {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) ? (
                <span className="text-lg text-slate-400 line-through">{money(product.compare_at_price, product.currency)}</span>
              ) : null}
            </div>

            {variants.map((variant) => (
              <div key={variant.name} className="mt-6">
                <div className="mb-2 text-sm font-black">{variant.name}</div>
                <div className="flex flex-wrap gap-2">
                  {(variant.values || []).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelected((current) => ({ ...current, [variant.name]: value }))}
                      className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${selected[variant.name] === value ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300 bg-white"}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-6">
              <div className="mb-2 text-sm font-black">Quantity</div>
              <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-300">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-3 font-black">−</button>
                <span className="min-w-12 text-center font-black">{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="px-4 py-3 font-black">+</button>
              </div>
            </div>

            <a
              href={checkoutHref}
              className="mt-7 flex w-full items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 text-base font-black text-white transition hover:bg-emerald-600"
            >
              Buy Now
            </a>

            {product.shipping_text ? (
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div><div className="font-black">Delivery</div><div className="mt-1">{product.shipping_text}</div></div>
              </div>
            ) : null}

            <div className="mt-6 grid gap-2 text-sm text-slate-700">
              <div className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> Secure checkout will be handled by Aliwvide.</div>
              <div className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> Product options are selected before payment.</div>
            </div>
          </section>
        </div>

        <section className="mx-auto mt-12 max-w-4xl border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-black">Product details</h2>
          <div className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700">
            {product.description || "Product details will be added soon."}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-bold text-slate-500">{product.name}</div>
            <div className="font-black">{money(product.price, product.currency)}</div>
          </div>
          <a href={checkoutHref} className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-black text-white">Buy Now</a>
        </div>
      </div>
    </main>
  );
}
