import fallbackContent from "@/data/site-content.json";
import { hasPublicSupabaseConfig, publicSupabaseRequest } from "@/lib/supabase-rest";

function normalizeBlog(blog) {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    description: blog.description,
    content: blog.content,
    cover_image: blog.cover_image || "",
    status: blog.status || "published",
    published_at: blog.published_at || blog.date || null,
    created_at: blog.created_at || null,
    updated_at: blog.updated_at || null,
    date: blog.published_at ? String(blog.published_at).slice(0, 10) : blog.date || ""
  };
}

function normalizeFaq(faq) {
  return {
    id: faq.id,
    category: faq.category || "General",
    question: faq.question,
    answer: faq.answer,
    sort_order: faq.sort_order || 0,
    created_at: faq.created_at || null,
    updated_at: faq.updated_at || null
  };
}

function fallbackBlogs() {
  return (fallbackContent.blogs || []).map(normalizeBlog);
}

function fallbackFaqs() {
  return (fallbackContent.faqs || []).map(normalizeFaq);
}

export async function getPublishedBlogs({ limit } = {}) {
  if (!hasPublicSupabaseConfig()) {
    const blogs = fallbackBlogs();
    return typeof limit === "number" ? blogs.slice(0, limit) : blogs;
  }

  try {
    const query = new URLSearchParams({
      select: "id,title,slug,description,content,cover_image,status,published_at,created_at,updated_at",
      status: "eq.published",
      order: "published_at.desc.nullslast,created_at.desc"
    });

    if (typeof limit === "number") {
      query.set("limit", String(limit));
    }

    const rows = await publicSupabaseRequest("/blogs", {
      query: query.toString(),
      tags: ["blogs"]
    });

    return rows.map(normalizeBlog);
  } catch (error) {
    console.error(error);
    const blogs = fallbackBlogs();
    return typeof limit === "number" ? blogs.slice(0, limit) : blogs;
  }
}

export async function getPublishedBlogBySlug(slug) {
  if (!slug) return null;

  if (!hasPublicSupabaseConfig()) {
    return fallbackBlogs().find((blog) => blog.slug === slug) || null;
  }

  try {
    const query = new URLSearchParams({
      select: "id,title,slug,description,content,cover_image,status,published_at,created_at,updated_at",
      slug: `eq.${slug}`,
      status: "eq.published",
      limit: "1"
    });

    const rows = await publicSupabaseRequest("/blogs", {
      query: query.toString(),
      tags: ["blogs", `blog:${slug}`]
    });

    return rows[0] ? normalizeBlog(rows[0]) : null;
  } catch (error) {
    console.error(error);
    return fallbackBlogs().find((blog) => blog.slug === slug) || null;
  }
}

export async function getPublishedFaqs() {
  if (!hasPublicSupabaseConfig()) {
    return fallbackFaqs();
  }

  try {
    const query = new URLSearchParams({
      select: "id,category,question,answer,sort_order,created_at,updated_at",
      order: "sort_order.asc,created_at.asc"
    });

    const rows = await publicSupabaseRequest("/faqs", {
      query: query.toString(),
      tags: ["faqs"]
    });

    return rows.map(normalizeFaq);
  } catch (error) {
    console.error(error);
    return fallbackFaqs();
  }
}

export async function getBlogSitemapEntries() {
  const blogs = await getPublishedBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
    lastModified: blog.updated_at || blog.published_at || blog.created_at || blog.date || new Date().toISOString()
  }));
}
