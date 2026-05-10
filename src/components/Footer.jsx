import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 text-sm font-semibold text-gray-600">
        <Link
          className="rounded-full px-4 py-2 hover:bg-gray-900 hover:text-white"
          href="/faq"
        >
          FAQ
        </Link>

        <Link
          className="rounded-full px-4 py-2 hover:bg-gray-900 hover:text-white"
          href="/contact"
        >
          Contact Us
        </Link>

        <Link
          className="rounded-full px-4 py-2 hover:bg-gray-900 hover:text-white"
          href="/terms"
        >
          Terms & Conditions
        </Link>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        © 2026 Aliwvide. All rights reserved.
      </div>
    </footer>
  );
}