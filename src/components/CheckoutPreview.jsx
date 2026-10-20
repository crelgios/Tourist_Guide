"use client";

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, LockKeyhole, PackageCheck } from "lucide-react";

function money(value, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD"
    }).format(Number(value));
  } catch {
    return `${currency || "USD"} ${Number(value || 0).toFixed(2)}`;
  }
}

function getOffer(product, offerId) {
  const offers = Array.isArray(product.offers) ? product.offers : [];
  const selected = offers.find((offer) => offer?.id === offerId);

  if (selected) return selected;

  return {
    id: "single",
    label: "Buy 1",
    quantity: 1,
    price: Number(product.price || 0),
    compare_at_price: product.compare_at_price || null
  };
}

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

export default function CheckoutPreview({
  product,
  offerId = "single",
  selectedOptions = {},
  source = "",
  paypalClientId = ""
}) {
  const offer = useMemo(() => getOffer(product, offerId), [product, offerId]);
  const [customer, setCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: ""
  });
  const [paypalReady, setPaypalReady] = useState(false);
  const [shippingLocked, setShippingLocked] = useState(false);
  const [message, setMessage] = useState("");
  const [paidOrder, setPaidOrder] = useState("");

  const requiredComplete = [
    customer.first_name,
    customer.last_name,
    customer.email,
    customer.address,
    customer.city,
    customer.postal_code,
    customer.country
  ].every((value) => String(value || "").trim());

  function setField(name, value) {
    setCustomer((current) => ({ ...current, [name]: value }));
  }

  function continueToPayPal(event) {
    event.preventDefault();
    if (!requiredComplete) {
      setMessage("Complete all required shipping fields first.");
      return;
    }
    setMessage("");
    setShippingLocked(true);
  }

  useEffect(() => {
    if (!shippingLocked || !paypalReady || !paypalClientId || paidOrder) return;
    if (!window.paypal || !document.getElementById("paypal-button-container")) return;

    const container = document.getElementById("paypal-button-container");
    container.innerHTML = "";

    const buttons = window.paypal.Buttons({
      fundingSource: window.paypal.FUNDING.PAYPAL,
      style: {
        layout: "vertical",
        shape: "rect",
        label: "paypal",
        height: 48
      },
      async createOrder() {
        setMessage("Starting secure PayPal checkout...");
        const data = await readJson(await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: product.slug,
            offer: offer.id,
            selected_options: selectedOptions,
            customer,
            source
          })
        }));
        setMessage("");
        return data.id;
      },
      async onApprove(data) {
        setMessage("Verifying your PayPal payment...");
        const result = await readJson(await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: data.orderID })
        }));
        setPaidOrder(result.order_number || "");
        setMessage("");
      },
      onCancel() {
        setMessage("PayPal checkout was cancelled. No payment was completed.");
      },
      onError(error) {
        console.error("PayPal checkout error", error);
        setMessage("PayPal checkout could not be completed. Please try again.");
      }
    });

    buttons.render("#paypal-button-container").catch((error) => {
      console.error("Could not render PayPal button", error);
      setMessage("PayPal checkout could not be loaded.");
    });

    return () => {
      if (container) container.innerHTML = "";
    };
  }, [
    shippingLocked,
    paypalReady,
    paypalClientId,
    paidOrder,
    product.slug,
    offer.id,
    selectedOptions,
    customer,
    source
  ]);

  if (paidOrder) {
    return (
      <main className="min-h-screen bg-[#f7f6f3] px-4 py-10 text-slate-950 sm:px-6">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
          <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Payment confirmed</p>
          <h1 className="mt-2 text-3xl font-black">Thank you for your order</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your PayPal payment has been verified and your Aliwvide order has been created.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Order number</div>
            <div className="mt-1 text-2xl font-black">{paidOrder}</div>
          </div>
          <a href="/shop" className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-black text-white">
            Return to shop
          </a>
        </div>
      </main>
    );
  }

  return (
    <>
      {paypalClientId ? (
        <Script
          id="paypal-js-sdk"
          src={`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalClientId)}&currency=${encodeURIComponent(product.currency || "USD")}&intent=capture&components=buttons`}
          strategy="afterInteractive"
          onLoad={() => setPaypalReady(true)}
        />
      ) : null}

      <main className="min-h-screen bg-[#f7f6f3] px-4 py-6 text-slate-950 sm:px-6 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <a href={`/shop/${product.slug}`} className="text-sm font-bold text-slate-600">
            ← Back to product
          </a>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_380px]">
            <form onSubmit={continueToPayPal} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Aliwvide Checkout</p>
              <h1 className="mt-2 text-3xl font-black">Where should we send it?</h1>
              <p className="mt-2 text-sm text-slate-500">
                Enter your delivery details, then continue to PayPal.
              </p>

              <fieldset disabled={shippingLocked} className="mt-6 grid gap-4 sm:grid-cols-2 disabled:opacity-70">
                <label className="grid gap-2 text-sm font-bold">
                  First name *
                  <input required value={customer.first_name} onChange={(e) => setField("first_name", e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  Last name *
                  <input required value={customer.last_name} onChange={(e) => setField("last_name", e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" />
                </label>
                <label className="grid gap-2 text-sm font-bold sm:col-span-2">
                  Email *
                  <input required type="email" value={customer.email} onChange={(e) => setField("email", e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" />
                </label>
                <label className="grid gap-2 text-sm font-bold sm:col-span-2">
                  Phone
                  <input type="tel" value={customer.phone} onChange={(e) => setField("phone", e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" />
                </label>
                <label className="grid gap-2 text-sm font-bold sm:col-span-2">
                  Address *
                  <input required value={customer.address} onChange={(e) => setField("address", e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  City *
                  <input required value={customer.city} onChange={(e) => setField("city", e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  State / region
                  <input value={customer.state} onChange={(e) => setField("state", e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  Postal code *
                  <input required value={customer.postal_code} onChange={(e) => setField("postal_code", e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  Country *
                  <input required value={customer.country} onChange={(e) => setField("country", e.target.value)} placeholder="United States" className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" />
                </label>
              </fieldset>

              {!shippingLocked ? (
                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffc439] px-6 py-4 font-black text-[#111]">
                  Continue to PayPal
                </button>
              ) : (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-black">Pay with PayPal</div>
                      <div className="mt-1 text-xs text-slate-500">Your order is not paid until PayPal confirms the payment.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShippingLocked(false);
                        setMessage("");
                      }}
                      className="text-sm font-black text-emerald-700"
                    >
                      Edit address
                    </button>
                  </div>

                  {paypalClientId ? (
                    <div id="paypal-button-container" className="mt-4 min-h-12" />
                  ) : (
                    <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">
                      PayPal credentials have not been added to this preview environment yet.
                    </div>
                  )}
                </div>
              )}

              {message ? (
                <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">
                  {message}
                </p>
              ) : null}

              <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                <LockKeyhole className="h-3.5 w-3.5" />
                PayPal handles the payment step securely.
              </div>
            </form>

            <aside className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-xl font-black">Your order</h2>

              <div className="mt-5 flex gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-black">{product.name}</div>
                  <div className="mt-1 text-sm font-bold text-emerald-700">{offer.label}</div>
                  <div className="mt-1 text-xs text-slate-500">Quantity: {offer.quantity || 1}</div>
                  {Object.entries(selectedOptions).map(([key, value]) => (
                    <div key={key} className="text-xs capitalize text-slate-500">
                      {key}: {value}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Selected offer</span>
                  <span>{money(offer.price, product.currency)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>As shown on product page</span>
                </div>
                <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-black">
                  <span>Total</span>
                  <span>{money(offer.price, product.currency)}</span>
                </div>
              </div>

              {product.shipping_text ? (
                <div className="mt-5 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-600">
                  {product.shipping_text}
                </div>
              ) : null}

              <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500">
                <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                Shipping, cancellation and refund terms should be reviewed before the store is launched publicly.
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
