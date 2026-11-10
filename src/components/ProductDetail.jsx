"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  ShoppingBag,
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

function getYouTubeEmbedUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    let id = "";

    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        id = url.searchParams.get("v") || "";
      } else {
        const parts = url.pathname.split("/").filter(Boolean);
        if (["shorts", "embed", "live"].includes(parts[0])) id = parts[1] || "";
      }
    }

    if (!id) return "";
    const safeId = encodeURIComponent(id);
    return `https://www.youtube-nocookie.com/embed/${safeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${safeId}&playsinline=1&rel=0&modestbranding=1`;
  } catch {
    return "";
  }
}

function ProductVideoPreview({ url, title }) {
  if (!url) return null;
  const youtubeEmbed = getYouTubeEmbedUrl(url);

  return (
    <section className="border-t border-slate-200 py-10">
      <h2 className="text-xl font-black">Product video</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-black">
        {youtubeEmbed ? (
          <iframe
            src={youtubeEmbed}
            title={`${title} product video`}
            className="aspect-video w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex={-1}
          />
        ) : (
          <video
            src={url}
            className="aspect-video w-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controls={false}
          />
        )}
      </div>
    </section>
  );
}

function normalizeOffers(product) {
  const configured = Array.isArray(product.offers)
    ? product.offers.filter((offer) => Number.isFinite(Number(offer?.price)))
    : [];

  if (configured.length) return configured;

  return [{
    id: "single",
    label: "1 Pack",
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
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(
      variants.map((variant) => [variant.name, variant.values?.[0] || ""])
    )
  );

  const activeOffer = offers.find((offer) => offer.id === offerId) || offers[0];

  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("product", product.slug);
    params.set("offer", activeOffer?.id || "single");
    params.set("quantity", String(quantity));

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
  }, [product.slug, activeOffer?.id, quantity, selected, source]);

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

  const saving =
    activeOffer?.compare_at_price &&
    Number(activeOffer.compare_at_price) > Number(activeOffer.price)
      ? Number(activeOffer.compare_at_price) - Number(activeOffer.price)
      : 0;

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            <ChevronLeft className="h-4 w-4" />
            Shop
          </a>
          <div className="text-base font-black tracking-tight">
            Aliwvide <span className="text-emerald-600">Shop</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <LockKeyhole className="h-3.5 w-3.5" />
            Secure
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-12">
          <div>
            <div className="relative overflow-hidden rounded-2xl bg-slate-50">
              <div className="aspect-square">
                {images[activeImage] ? (
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
                    <ShoppingBag className="h-12 w-12" />
                    <span className="text-sm font-semibold">Product image</span>
                  </div>
                )}
              </div>

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2.5 shadow-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2.5 shadow-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </div>

            {images.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={image + index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-white ${activeImage === index ? "border-slate-950" : "border-slate-200"}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              {product.category || "Aliwvide Shop"}
            </p>

            <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-black">
                {money(Number(activeOffer?.price || 0) * quantity, product.currency)}
              </span>

              {activeOffer?.compare_at_price &&
              Number(activeOffer.compare_at_price) > Number(activeOffer.price) ? (
                <span className="text-base text-slate-400 line-through">
                  {money(Number(activeOffer.compare_at_price) * quantity, product.currency)}
                </span>
              ) : null}

              {saving > 0 ? (
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">
                  Save {money(saving * quantity, product.currency)}
                </span>
              ) : null}
            </div>

            {product.description ? (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {product.description}
              </p>
            ) : null}

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
                      className={`rounded-lg border px-3.5 py-2.5 text-sm font-bold transition ${selected[variant.name] === value ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300 bg-white hover:border-slate-500"}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {offers.length > 1 ? (
              <div className="mt-6">
                <div className="mb-2 text-sm font-black">Package</div>
                <div className="grid gap-2">
                  {offers.map((offer) => {
                    const isSelected = offer.id === activeOffer?.id;
                    return (
                      <button
                        key={offer.id}
                        type="button"
                        onClick={() => setOfferId(offer.id)}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${isSelected ? "border-slate-950 bg-slate-50" : "border-slate-200 bg-white"}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300"}`}>
                            {isSelected ? <Check className="h-3 w-3" /> : null}
                          </span>
                          <div>
                            <div className="font-bold">{offer.label}</div>
                            {offer.badge ? (
                              <div className="mt-0.5 text-xs font-bold text-emerald-700">{offer.badge}</div>
                            ) : null}
                          </div>
                        </div>
                        <div className="font-black">{money(offer.price, product.currency)}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="mt-6">
              <div className="mb-2 text-sm font-black">Quantity</div>
              <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  className="h-11 w-12 text-xl font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="flex h-11 min-w-14 items-center justify-center border-x border-slate-300 px-4 font-black">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                  disabled={quantity >= 10}
                  className="h-11 w-12 text-xl font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-500">
                Total: {money(Number(activeOffer?.price || 0) * quantity, product.currency)}
              </div>
            </div>

            <a
              href={checkoutHref}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-slate-950 px-6 py-4 text-base font-black text-white transition hover:bg-slate-800"
            >
              Buy Now
            </a>

            <div className="mt-3 text-center text-xs font-semibold text-slate-500">
              Pay securely with PayPal or eligible debit/credit card
            </div>

            {product.shipping_text ? (
              <div className="mt-5 flex items-start gap-3 border-t border-slate-200 pt-5 text-sm text-slate-600">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />
                <div>
                  <div className="font-black text-slate-950">Delivery information</div>
                  <div className="mt-1 leading-6">{product.shipping_text}</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-slate-200 py-10">
          <h2 className="text-xl font-black">Product details</h2>
          <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
            {product.description || "Product details will be added soon."}
          </div>
        </div>

        <ProductVideoPreview url={product.video_url} title={product.name} />

        <section className="border-t border-slate-800 bg-black py-10 text-white">
          <div className="px-1">
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Available payment methods</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">Pay securely your way</h2>
            </div>

            <div className="mx-auto mt-7 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex h-16 items-center justify-center rounded-xl bg-white px-4 text-center text-lg font-black text-[#003087]">
                PayPal
              </div>
              <div className="flex h-16 items-center justify-center rounded-xl bg-white px-4 text-center text-2xl font-black italic text-[#1a1f71]">
                VISA
              </div>
              <div className="flex h-16 items-center justify-center gap-2 rounded-xl bg-white px-4 text-center">
                <span className="h-8 w-8 rounded-full bg-[#eb001b]" />
                <span className="-ml-4 h-8 w-8 rounded-full bg-[#f79e1b] opacity-90" />
                <span className="ml-1 text-sm font-black text-slate-900">Mastercard</span>
              </div>
              <div className="flex h-16 items-center justify-center rounded-xl bg-[#1679be] px-4 text-center text-lg font-black text-white">
                AMEX
              </div>
            </div>

            <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-slate-400">
              PayPal processes payments securely. Card options are shown when they are available for your country, device and PayPal merchant account.
            </p>
          </div>
        </section>
      </section>

      <div className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-slate-500">{product.name}</div>
            <div className="font-black">{money(activeOffer?.price, product.currency)}</div>
          </div>
          <a
            href={checkoutHref}
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
          >
            Buy Now
          </a>
        </div>
      </div>
    </main>
  );
}
