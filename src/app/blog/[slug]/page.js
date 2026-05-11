import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { getPublishedBlogBySlug, getPublishedBlogs } from "@/lib/content";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug
  }));
}

export async function generateMetadata({ params }) {
  const blog = await getPublishedBlogBySlug(params.slug);

  if (!blog) {
    return {
      title: "Blog Not Found"
    };
  }

  return {
    title: blog.title,
    description: blog.description,
    alternates: {
      canonical: `/blog/${blog.slug}`
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      url: `/blog/${blog.slug}`
    }
  };
}

export default async function SingleBlogPage({ params }) {
  const blog = await getPublishedBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-sm font-semibold text-emerald-700">
          Travel Guide
        </p>

        <h1 className="mt-3 text-4xl font-bold text-slate-900">
          {blog.title}
        </h1>

        {blog.date && <p className="mt-3 text-sm text-slate-500">{blog.date}</p>}

        <p className="mt-6 text-xl text-slate-600">{blog.description}</p>

        <article className="mt-10 whitespace-pre-line text-lg leading-8 text-slate-700">
          {blog.content}
        </article>
      </main>

      <Footer />
    </>
  );
}
