import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import BlogArticleContent from "@/components/BlogArticleContent";
import { getPublishedBlogBySlug, getPublishedBlogs } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aliwvide.com";

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

  const coverImage = blog.cover_image || "/brand/aliwvide-og-image.jpg";

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
      url: `/blog/${blog.slug}`,
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: blog.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [coverImage]
    }
  };
}

export default async function SingleBlogPage({ params }) {
  const blog = await getPublishedBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  const blogUrl = `${siteUrl}/blog/${blog.slug}`;
  const encodedUrl = encodeURIComponent(blogUrl);
  const encodedTitle = encodeURIComponent(blog.title);
  const coverImage = blog.cover_image || "/brand/aliwvide-og-image.jpg";

  return (
    <>
      <main className="bg-gradient-to-b from-emerald-50/70 via-white to-white">
        <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">
                Travel Guide
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl sm:leading-tight">
              {blog.title}
            </h1>

            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">
              {blog.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Share WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700"
              >
                Share Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700"
              >
                Share X
              </a>
            </div>

            <div className="mt-10 overflow-hidden rounded-[1.7rem] border border-slate-100 bg-slate-50 shadow-sm">
              <img
                src={coverImage}
                alt={blog.title}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <BlogArticleContent content={blog.content} />
        </section>
      </main>

      <Footer />
    </>
  );
}
