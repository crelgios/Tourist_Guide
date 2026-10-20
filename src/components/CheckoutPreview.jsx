"use client";

import { useState } from "react";
import { CreditCard, LockKeyhole } from "lucide-react";

function money(value, currency) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "USD" }).format(Number(value));
  } catch {
    return `${currency || "USD"} ${Number(value || 0).toFixed(2)}`;
  }
}

export default function CheckoutPreview({ product, quantity = 1, selectedOptions = {} }) {
  const [payment, setPayment] = useState("paypal");
  const [message, setMessage] = useState("");
  const total = Number(product.price || 0) * Number(quantity || 1);

  function submit(event) {
    event.preventDefault();
    setMessage("Checkout page is ready for preview. PayPal/card processing and order creation will be connected in the next step before production.");
  }

  return (
    <main className="min-h-screen bg-[#f6f6f4] px-4 py-6 text-slate-950 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <a href={`/shop/${product.slug}`} className="text-sm font-bold text-slate-600">← Back to product</a>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_380px]">
          <form onSubmit={submit} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Aliwvide Checkout</p>
            <h1 className="mt-2 text-3xl font-black">Shipping details</h1>
            <p className="mt-2 text-sm text-slate-500">Enter the address where you want your order delivered.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">First name<input required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label>
              <label className="grid gap-2 text-sm font-bold">Last name<input required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label>
              <label className="grid gap-2 text-sm font-bold sm:col-span-2">Email<input required type="email" className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label>
              <label className="grid gap-2 text-sm font-bold sm:col-span-2">Phone<input required type="tel" className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label>
              <label className="grid gap-2 text-sm font-bold sm:col-span-2">Address<input required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label>
              <label className="grid gap-2 text-sm font-bold">City<input required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label>
              <label className="grid gap-2 text-sm font-bold">State / region<input required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label>
              <label className="grid gap-2 text-sm font-bold">Postal code<input required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label>
              <label className="grid gap-2 text-sm font-bold">Country<input required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-black">Payment</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setPayment("paypal")} className={`rounded-2xl border p-4 text-left ${payment === "paypal" ? "border-slate-950 ring-1 ring-slate-950" : "border-slate-200"}`}>
                  <div className="font-black">PayPal</div>
                  <div className="mt-1 text-xs text-slate-500">Pay with your PayPal account.</div>
                </button>
                <button type="button" onClick={() => setPayment("card")} className={`rounded-2xl border p-4 text-left ${payment === "card" ? "border-slate-950 ring-1 ring-slate-950" : "border-slate-200"}`}>
                  <div className="flex items-center gap-2 font-black"><CreditCard className="h-4 w-4" /> Card</div>
                  <div className="mt-1 text-xs text-slate-500">Visa / Mastercard checkout.</div>
                </button>
              </div>
            </div>

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 font-black text-white">
              <LockKeyhole className="h-4 w-4" />
              Continue to payment
            </button>
            {message && <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">{message}</p>}
          </form>

          <aside className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-black">Order summary</h2>
            <div className="mt-5 flex gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {product.images?.[0] ? <img src={product.images[0]} alt="" className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-black">{product.name}</div>
                <div className="mt-1 text-sm text-slate-500">Qty: {quantity}</div>
                {Object.entries(selectedOptions).map(([key, value]) => <div key={key} className="text-xs text-slate-500">{key}: {value}</div>)}
              </div>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="flex justify-between text-sm"><span>Products</span><span>{money(total, product.currency)}</span></div>
              <div className="mt-2 flex justify-between text-sm"><span>Shipping</span><span>Calculated before payment</span></div>
              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-black"><span>Total</span><span>{money(total, product.currency)}</span></div>
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">No money-back guarantee block is included. Final shipping, cancellation and refund terms will be shown clearly before launch.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
