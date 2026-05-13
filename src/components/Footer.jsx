import Link from "next/link";
import SiteLogo from "@/components/SiteLogo";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact Us" },
  { href: "/terms", label: "Terms" }
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <SiteLogo dark />
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Aliwvide helps tourists discover travel, taxi, maps, train, food delivery, shopping and emergency apps used by country.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-gray-600">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              className="rounded-full px-4 py-2 hover:bg-gray-900 hover:text-white"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          © 2026 Aliwvide. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
