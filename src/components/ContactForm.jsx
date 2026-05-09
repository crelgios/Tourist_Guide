"use client";

import { useState } from "react";
import Link from "next/link";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqenywva";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    const endpoint = FORMSPREE_ENDPOINT;

    setLoading(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();
      setStatus({
        type: "success",
        message: "Your details were submitted successfully. We will contact you soon."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Something went wrong. Please check the form setup and try again."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#eef2ff,_transparent_34%),linear-gradient(180deg,_#ffffff,_#f8fafc)] px-4 py-8 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/70 bg-white/60 px-5 py-2 text-sm font-bold text-gray-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
          >
            ← Back Home
          </Link>
          <Link
            href="/explore"
            className="rounded-full bg-black px-5 py-2 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
          >
            Explore Countries
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-white/70 bg-white/45 p-7 shadow-2xl backdrop-blur-2xl sm:p-9">
            <p className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-black text-gray-700 shadow-sm">
              Contact Aliwvide
            </p>
            <h1 className="mt-6 text-4xl font-black tracking-[-0.06em] text-gray-950 sm:text-6xl">
              Submit your details
            </h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              Users can send their name, email, WhatsApp number, country and message. You will receive the details on your connected email.
            </p>

            <div className="mt-8 grid gap-3 text-sm font-semibold text-gray-600">
              <div className="rounded-2xl border border-white/70 bg-white/55 p-4 backdrop-blur-xl">✅ Travel service suggestions</div>
              <div className="rounded-2xl border border-white/70 bg-white/55 p-4 backdrop-blur-xl">✅ Country data correction requests</div>
              <div className="rounded-2xl border border-white/70 bg-white/55 p-4 backdrop-blur-xl">✅ Partnership or business contact</div>
              <div className="rounded-2xl border border-white/70 bg-white/55 p-4 backdrop-blur-xl">✅ Broken link or emergency number updates</div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/55 p-5 shadow-2xl backdrop-blur-2xl sm:p-8">
            {status.message && (
              <div
                className={`mb-5 rounded-2xl border p-4 text-sm font-bold ${
                  status.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="_subject" value="New Aliwvide contact form submission" />

              <label className="block">
                <span className="mb-2 block text-sm font-black text-gray-700">Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-gray-200 bg-white/80 p-4 font-semibold outline-none transition focus:border-gray-900 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-gray-700">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full rounded-2xl border border-gray-200 bg-white/80 p-4 font-semibold outline-none transition focus:border-gray-900 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-gray-700">Phone / WhatsApp</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Enter phone or WhatsApp number"
                  className="w-full rounded-2xl border border-gray-200 bg-white/80 p-4 font-semibold outline-none transition focus:border-gray-900 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-gray-700">Country</span>
                <input
                  type="text"
                  name="country"
                  placeholder="Your country"
                  className="w-full rounded-2xl border border-gray-200 bg-white/80 p-4 font-semibold outline-none transition focus:border-gray-900 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-gray-700">Message</span>
                <textarea
                  name="message"
                  required
                  rows="5"
                  placeholder="Write your message"
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-white/80 p-4 font-semibold outline-none transition focus:border-gray-900 focus:bg-white"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-black px-6 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Submit Details"}
              </button>

              <p className="text-center text-xs font-semibold leading-5 text-gray-500">
                Your details will be sent to the website owner through the connected Formspree email.
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
