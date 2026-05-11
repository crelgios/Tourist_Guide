import { countries } from "@/data/countries";
import { getBlogSitemapEntries } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = ["", "/category", "/explore", "/blog", "/faq", "/contact", "/terms", "/india/taxi-apps"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));

  const countryRoutes = countries.map((country) => ({
    url: `${siteConfig.url}/country/${country.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const blogEntries = await getBlogSitemapEntries();
  const blogRoutes = blogEntries.map((blog) => ({
    url: `${siteConfig.url}/blog/${blog.slug}`,
    lastModified: new Date(blog.lastModified),
    changeFrequency: "monthly",
    priority: 0.75
  }));

  return [...staticRoutes, ...countryRoutes, ...blogRoutes];
}
