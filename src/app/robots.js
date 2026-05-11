import { siteConfig } from "@/lib/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/secure-aliwvide-control-9xq2m"]
      }
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
