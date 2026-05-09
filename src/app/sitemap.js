import { countries } from "@/data/countries";
import { siteConfig } from "@/lib/site";

export default function sitemap() {
  const now = new Date();

  const staticRoutes = ["", "/category", "/explore", "/faq", "/contact", "/terms", "/india/taxi-apps"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));

  const countryRoutes = countries.map((country) => ({
    url: `${siteConfig.url}/country/${country.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85
  }));

  return [...staticRoutes, ...countryRoutes];
}
