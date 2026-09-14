"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SiteLogo from "@/components/SiteLogo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "Categories", href: "/category" },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" }
];

const tasbihLinks = [
  { name: "Tasbih Counter", href: "https://tasbii.vercel.app/" },
  { name: "Daily Dhikr", href: "https://tasbii.vercel.app/daily-dhikr" },
  { name: "Dua Counter", href: "https://tasbii.vercel.app/dua-counter" }
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tasbihOpen, setTasbihOpen] = useState(false);

  function isActive(href) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMenus() {
    setOpen(false);
    setTasbihOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/20 bg-slate-950/95 shadow-lg shadow-slate-950/10 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <SiteLogo onClick={closeMenus} />

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive(link.href)
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
              aria-haspopup="menu"
            >
              Tasbih
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 8 4 4 4-4" />
              </svg>
            </button>

            <div className="invisible absolute left-1/2 top-full z-50 min-w-52 -translate-x-1/2 translate-y-2 rounded-2xl border border-white/10 bg-slate-950 p-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {tasbihLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-emerald-500 hover:text-white"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {navLinks.slice(3).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive(link.href)
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white transition hover:bg-white/15 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6L18 18" />
              <path d="M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 7H20" />
              <path d="M4 12H20" />
              <path d="M4 17H20" />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-4 pb-4 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2 pt-3">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-2xl px-4 py-3 text-base font-bold transition ${
                  isActive(link.href)
                    ? "bg-emerald-500 text-white"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => setTasbihOpen((value) => !value)}
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-left text-base font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
              aria-expanded={tasbihOpen}
            >
              Tasbih
              <svg viewBox="0 0 20 20" className={`h-5 w-5 transition ${tasbihOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 8 4 4 4-4" />
              </svg>
            </button>

            {tasbihOpen && (
              <div className="grid gap-1 rounded-2xl border border-white/10 bg-white/5 p-2">
                {tasbihLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-emerald-500 hover:text-white"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            )}

            {navLinks.slice(3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-2xl px-4 py-3 text-base font-bold transition ${
                  isActive(link.href)
                    ? "bg-emerald-500 text-white"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
