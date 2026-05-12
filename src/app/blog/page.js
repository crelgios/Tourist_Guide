import Link from "next/link";
import Footer from "@/components/Footer";
import { getPublishedBlogs } from "@/lib/content";

export const revalidate = 3600;

export const metadata = {
  title: "Travel App Guides",
  description:
    "Read travel app guides for taxi apps, train apps, metro apps, food delivery apps and tourist apps by country.",
  alternates: {
    canonical: "/blog"
  }
};

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-bold text-slate-900">
          Travel App Guides
        </h1>

        <p className="mt-4 max-w-2xl text-slate-600">
          Simple guides for tourists to discover useful apps for transport, maps, trains, metro, food delivery and shopping.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                <h2 className="text-2xl font-bold text-slate-900">
                {blog.title}
              </h2>

              <p className="mt-3 text-slate-600">{blog.description}</p>

              <Link
                href={`/blog/${blog.slug}`}
                className="mt-5 inline-flex font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
