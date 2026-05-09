import { siteConfig } from "@/lib/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: []
      }
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
