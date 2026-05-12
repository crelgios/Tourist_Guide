"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/20 bg-slate-950/95 shadow-lg shadow-slate-950/10 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
        >
          {/* Logo icon */}
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-md shadow-emerald-900/30">
            <svg
              viewBox="0 0 48 48"
              className="h-8 w-8 text-white"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                d="M8 24H40"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M24 8C18 14 15 19 15 24C15 29 18 34 24 40"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M24 8C30 14 33 19 33 24C33 29 30 34 24 40"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M30 14L36 20"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-black text-emerald-700 shadow">
              A
            </span>
          </span>

          {/* Brand text */}
          <span className="leading-tight">
            <span className="block text-lg font-black tracking-tight text-white">
              Aliwvide
            </span>
            <span className="hidden text-xs font-medium text-emerald-200 sm:block">
              Travel apps by country
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white transition hover:bg-white/15 md:hidden"
          aria-label="Open menu"
        >
          {open ? (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M6 6L18 18" />
              <path d="M18 6L6 18" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M4 7H20" />
              <path d="M4 12H20" />
              <path d="M4 17H20" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile links */}
      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-4 pb-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 pt-3">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 font-semibold transition ${
                    active
                      ? "bg-emerald-500 text-white"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}