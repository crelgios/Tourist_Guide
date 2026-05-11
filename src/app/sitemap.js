import { countries } from "@/data/countries";
import siteContent from "@/data/site-content.json";
import { siteConfig } from "@/lib/site";

export default function sitemap() {
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

  const blogRoutes = (siteContent.blogs || []).map((blog) => ({
    url: `${siteConfig.url}/blog/${blog.slug}`,
    lastModified: blog.date ? new Date(blog.date) : now,
    changeFrequency: "monthly",
    priority: 0.75
  }));

  return [...staticRoutes, ...countryRoutes, ...blogRoutes];
}
