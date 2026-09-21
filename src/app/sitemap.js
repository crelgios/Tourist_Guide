import { countries } from "@/data/countries";
import { getBlogSitemapEntries } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

const baseUrl = siteConfig.url.replace(/\/$/, "");

const staticRoutes = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/explore", priority: 0.9, changeFrequency: "weekly" },
  { path: "/shop", priority: 0.9, changeFrequency: "weekly" },
  { path: "/category", priority: 0.85, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.85, changeFrequency: "monthly" },
  { path: "/tools/qibla", priority: 0.9, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.65, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
  { path: "/india/taxi-apps", priority: 0.85, changeFrequency: "monthly" }
];

export default async function sitemap() {
  // Do not stamp every static/country URL with the current time. Doing so tells
  // crawlers that hundreds of unchanged pages were modified every hour.
  const pages = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));

  const countryPages = countries.map((country) => ({
    url: `${baseUrl}/country/${country.slug}`,
    changeFrequency: "weekly",
    priority: country.slug === "india" ? 0.95 : 0.8
  }));

  const blogEntries = await getBlogSitemapEntries();
  const blogPages = blogEntries.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.lastModified),
    changeFrequency: "monthly",
    priority: 0.75
  }));

  return [...pages, ...countryPages, ...blogPages];
}
