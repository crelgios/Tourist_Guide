import Link from "next/link";
import Footer from "@/components/Footer";
import siteContent from "@/data/site-content.json";

export const metadata = {
  title: "Travel App Guides",
  description: "Read practical guides about taxi apps, metro apps, train booking, food delivery and travel tools for tourists.",
  alternates: { canonical: "/blog" }
};

export default function BlogPage() {
  const blogs = siteContent.blogs || [];

  return (
    <>
      <main className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="font-black uppercase tracking-[.2em] text-emerald-600">Travel guides</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.06em] md:text-6xl">Travel App Guides</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Practical guides to help tourists choose useful apps for transport, maps, train booking, metro travel, food delivery and local planning.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {blogs.map((blog) => (
              <article key={blog.id} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-gray-400">{blog.date}</p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.03em]">{blog.title}</h2>
                <p className="mt-4 leading-7 text-gray-600">{blog.description}</p>
                <Link href={`/blog/${blog.slug}`} className="mt-5 inline-block font-black text-emerald-700">
                  Read guide →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
