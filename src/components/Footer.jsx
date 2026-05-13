import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore Countries" },
  { href: "/category", label: "Categories" },
  { href: "/country/india", label: "India Apps" },
  { href: "/india/taxi-apps", label: "India Taxi Apps" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact Us" },
  { href: "/terms", label: "Terms" }
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-gray-600">
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
