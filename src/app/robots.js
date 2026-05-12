import { siteConfig } from "@/lib/site";

const baseUrl = siteConfig.url.replace(/\/$/, "");

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/secure-aliwvide-control-9xq2m", "/api/admin", "/api/n8n"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
