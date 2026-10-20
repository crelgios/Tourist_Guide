"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Truck
} from "lucide-react";

function money(value, currency) {
  if (value === null || value === undefined || value === "") return "";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD"
    }).format(Number(value));
  } catch {
    return `${currency || "USD"} ${Number(value).toFixed(2)}`;
  }
}

function normalizeOffers(product) {
  const configured = Array.isArray(product.offers)
    ? product.offers.filter((offer) => Number.isFinite(Number(offer?.price)))
    : [];

  if (configured.length) return configured;

  return [{
    id: "single",
    label: "Buy 1",
    quantity: 1,
    price: Number(product.price || 0),
    compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : null,
    badge: ""
  }];
}

export default function ProductDetail({ product, source = "" }) {
  const images = Array.isArray(product.images) ? product.images : [];
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const offers = useMemo(() => normalizeOffers(product), [product]);
  const [activeImage, setActiveImage] = useState(0);
  const [offerId, setOfferId] = useState(offers[0]?.id || "single");
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(variants.map((variant) => [
      variant.name,
      variant.values?.[0] || ""
    ]))
  );

  const activeOffer = offers.find((offer) => offer.id === offerId) || offers[0];

  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("product", product.slug);
    params.set("offer", activeOffer?.id || "single");

    Object.entries(selected).forEach(([key, value]) => {
      if (value) {
        params.set(
          `option_${key.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
          value
        );
      }
    });

    if (source) params.set("src", source);
    return `/checkout?${params.toString()}`;
  }, [product.slug, activeOffer?.id, selected, source]);

  function previousImage() {
    setActiveImage((current) =>
      current <= 0 ? Math.max(images.length - 1, 0) : current - 1
    );
  }

  function nextImage() {
    setActiveImage((current) =>
      current >= images.length - 1 ? 0 : current + 1
    );
  }

  const saving = activeOffer?.compare_at_price &&
    Number(activeOffer.compare_at_price) > Number(activeOffer.price)
      ? Number(activeOffer.compare_at_price) - Number(activeOffer.price)
      : 0;

  return (
    <main className="min-h-screen bg-[#faf9f7] text-slate-950">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950">
            <ChevronLeft className="h-4 w-4" /> Shop
          </a>
          <div className="text-lg font-black tracking-tight">
            Aliwvide <span className="text-emerald-600">Shop</span>
          </div>
          <div className="text-xs font-bold text-slate-500">Secure checkout</div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
          <div>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
              <div className="aspect-square">
                {images[activeImage] ? (
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <ShoppingBag className="h-14 w-14" />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-3 shadow"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-3 shadow"
                    aria-label="Next image"
                  >
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
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white ${activeImage === index ? "border-slate-950" : "border-transparent"}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {product.video_url ? (
              <a
                href={product.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black"
              >
                Watch product video
              </a>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-5 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" /> Online offer
            </div>

            <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              {product.category || "Aliwvide Shop"}
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-black">
                {money(activeOffer?.price, product.currency)}
              </span>
              {activeOffer?.compare_at_price &&
              Number(activeOffer.compare_at_price) > Number(activeOffer.price) ? (
                <span className="text-lg text-slate-400 line-through">
                  {money(activeOffer.compare_at_price, product.currency)}
                </span>
              ) : null}
              {saving > 0 ? (
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">
                  Save {money(saving, product.currency)}
                </span>
              ) : null}
            </div>

            <div id="pricing" className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-base font-black">Choose your offer</h2>
                <span className="text-xs font-semibold text-slate-500">Select one</span>
              </div>

              <div className="grid gap-3">
                {offers.map((offer) => {
                  const selectedOffer = offer.id === activeOffer?.id;
                  const perItem = Number(offer.price) / Math.max(1, Number(offer.quantity || 1));

                  return (
                    <button
                      key={offer.id}
                      type="button"
                      onClick={() => setOfferId(offer.id)}
                      className={`relative w-full rounded-2xl border-2 p-4 text-left transition ${selectedOffer ? "border-slate-950 bg-white shadow-md" : "border-slate-200 bg-white/70 hover:border-slate-400"}`}
                    >
                      {offer.badge ? (
                        <span className="absolute -top-3 right-4 rounded-full bg-slate-950 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                          {offer.badge}
                        </span>
                      ) : null}

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selectedOffer ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300"}`}>
                            {selectedOffer ? <Check className="h-3 w-3" /> : null}
                          </span>
                          <div>
                            <div className="font-black">{offer.label}</div>
                            <div className="mt-0.5 text-xs text-slate-500">
                              {offer.quantity} {Number(offer.quantity) === 1 ? "item" : "items"} · {money(perItem, product.currency)} each
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-black">{money(offer.price, product.currency)}</div>
                          {offer.compare_at_price &&
                          Number(offer.compare_at_price) > Number(offer.price) ? (
                            <div className="text-xs text-slate-400 line-through">
                              {money(offer.compare_at_price, product.currency)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {variants.map((variant) => (
              <div key={variant.name} className="mt-6">
                <div className="mb-2 text-sm font-black">{variant.name}</div>
                <div className="flex flex-wrap gap-2">
                  {(variant.values || []).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setSelected((current) => ({
                          ...current,
                          [variant.name]: value
                        }))
                      }
                      className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${selected[variant.name] === value ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300 bg-white"}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <div className="text-sm font-black">PayPal</div>
                <div className="mt-1 text-xs text-slate-500">Pay with your PayPal account</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <div className="text-sm font-black">Debit / Credit Card</div>
                <div className="mt-1 text-xs text-slate-500">Visa & Mastercard where available</div>
              </div>
            </div>

            <a
              href={checkoutHref}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-base font-black text-white shadow-sm transition hover:bg-slate-800"
            >
              Continue to Checkout
            </a>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
              <LockKeyhole className="h-3.5 w-3.5" />
              Secure payment through PayPal and eligible card checkout
            </div>

            {product.shipping_text ? (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <div className="font-black">Delivery</div>
                  <div className="mt-1">{product.shipping_text}</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-7 sm:grid-cols-3 sm:px-6">
          <div className="flex gap-3">
            <PackageCheck className="h-6 w-6 shrink-0 text-emerald-600" />
            <div>
              <div className="font-black">Choose your package</div>
              <p className="mt-1 text-sm text-slate-500">Pick the quantity and product options that suit you.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <LockKeyhole className="h-6 w-6 shrink-0 text-emerald-600" />
            <div>
              <div className="font-black">Pay securely</div>
              <p className="mt-1 text-sm text-slate-500">Choose PayPal or an eligible debit/credit card at checkout. Aliwvide does not store card details.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Truck className="h-6 w-6 shrink-0 text-emerald-600" />
            <div>
              <div className="font-black">Shipping details</div>
              <p className="mt-1 text-sm text-slate-500">Your delivery address is collected during checkout.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">Product overview</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Everything you need to know</h2>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div className="whitespace-pre-line text-base leading-8 text-slate-700">
            {product.description || "Product details will be added soon."}
          </div>
          {images[1] || images[0] ? (
            <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-slate-200">
              <img src={images[1] || images[0]} alt={product.name} className="aspect-square h-full w-full object-cover" />
            </div>
          ) : null}
        </div>

        {images.length > 2 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {images.slice(2, 6).map((image, index) => (
              <div key={image + index} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                <img src={image} alt="" className="aspect-square w-full object-cover" />
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">Ready to order?</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{product.name}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Select your preferred offer, then pay with PayPal or an eligible debit/credit card.
          </p>
          <a
            href="#pricing"
            className="mt-6 inline-flex rounded-2xl bg-white px-7 py-3.5 font-black text-slate-950"
          >
            View pricing
          </a>
        </div>
      </section>

      <div className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-bold text-slate-500">
              {activeOffer?.label || product.name}
            </div>
            <div className="font-black">{money(activeOffer?.price, product.currency)}</div>
          </div>
          <a
            href={checkoutHref}
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
          >
            Checkout
          </a>
        </div>
      </div>
    </main>
  );
}
