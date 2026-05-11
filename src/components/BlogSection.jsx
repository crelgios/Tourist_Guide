import Link from "next/link";
import siteContent from "@/data/site-content.json";

export default function BlogSection() {
  const blogs = siteContent.blogs || [];

  if (!blogs.length) return null;

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="font-black uppercase tracking-[.2em] text-emerald-600">Travel guides</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-5xl">Helpful guides for your next trip</h2>
          <p className="mt-5 leading-8 text-slate-600">
            Read practical guides about taxi apps, metro apps, train booking, food delivery and travel tools tourists can use before and during a trip.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogs.slice(0, 3).map((blog) => (
            <article key={blog.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-sm font-bold text-slate-400">{blog.date}</p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.03em]">{blog.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{blog.description}</p>
              <Link href={`/blog/${blog.slug}`} className="mt-5 inline-block font-black text-emerald-700">
                Read guide →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/blog" className="inline-flex rounded-full bg-slate-950 px-6 py-3 font-black text-white">
            View all guides
          </Link>
        </div>
      </div>
    </section>
  );
}
