import Link from "next/link";

export const metadata = {
  title: "Page Not Found | Aliwvide",
  description: "The page you are looking for does not exist."
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          404 Error
        </p>

        <h1 className="mt-3 text-4xl font-bold text-slate-900">
          Page Not Found
        </h1>

        <p className="mt-4 text-slate-600">
          The page you are looking for does not exist, was removed, or the URL is incorrect.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Go to Homepage
          </Link>

          <Link
            href="/blog"
            className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Read Travel Guides
          </Link>

          <Link
            href="/category"
            className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Explore Countries
          </Link>
        </div>
      </div>
    </main>
  );
}
