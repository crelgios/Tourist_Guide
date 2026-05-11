import Link from "next/link";
import { getPublishedBlogs } from "@/lib/content";

export default async function BlogSection() {
  const blogs = await getPublishedBlogs({ limit: 4 });

  if (!blogs.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          Travel Guides
        </p>

        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          Latest Travel App Guides
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Read simple guides about taxi apps, train apps, metro apps, food delivery apps and tourist travel apps used around the world.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="text-xl font-bold text-slate-900">
              {blog.title}
            </h3>

            <p className="mt-3 text-slate-600">{blog.description}</p>

            <Link
              href={`/blog/${blog.slug}`}
              className="mt-5 inline-flex font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Read guide →
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="inline-flex rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          View all blogs
        </Link>
      </div>
    </section>
  );
}