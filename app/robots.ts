import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The admin panel and API are private or meaningless to a crawler;
        // cart and compare are per-visitor state with nothing to index.
        disallow: ["/admin", "/admin/", "/api/", "/cart", "/compare"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
