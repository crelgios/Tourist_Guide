import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import siteContent from "@/data/site-content.json";
import { siteConfig } from "@/lib/site";

const blogs = siteContent.blogs || [];

export function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export function generateMetadata({ params }) {
  const blog = blogs.find((item) => item.slug === params.slug);

  if (!blog) {
    return { title: "Guide Not Found" };
  }

  return {
    title: blog.title,
    description: blog.description,
    alternates: { canonical: `/blog/${blog.slug}` },
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `${siteConfig.url}/blog/${blog.slug}`,
      type: "article"
    }
  };
}

export default function BlogArticlePage({ params }) {
  const blog = blogs.find((item) => item.slug === params.slug);

  if (!blog) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description,
    datePublished: blog.date,
    dateModified: blog.date,
    author: {
      "@type": "Organization",
      name: "Aliwvide"
    },
    publisher: {
      "@type": "Organization",
      name: "Aliwvide"
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${blog.slug}`
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <main className="min-h-screen bg-white px-6 py-16">
        <article className="mx-auto max-w-3xl">
          <LinkBack />
          <p className="mt-8 font-black uppercase tracking-[.2em] text-emerald-600">Travel guide</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] md:text-6xl">{blog.title}</h1>
          <p className="mt-4 text-sm font-bold text-gray-400">{blog.date}</p>
          <p className="mt-6 text-xl leading-8 text-gray-600">{blog.description}</p>
          <div className="mt-10 whitespace-pre-line text-lg leading-9 text-gray-700">{blog.content}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function LinkBack() {
  return (
    <a href="/blog" className="inline-flex rounded-full bg-gray-100 px-5 py-3 font-bold text-gray-900">
      ← All guides
    </a>
  );
}
