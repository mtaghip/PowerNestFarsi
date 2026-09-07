import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import { siteUrl } from "@/lib/site-url";

// Regenerate at most once an hour rather than on every crawler hit.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/consult`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  // Category browse pages. They are query-string URLs rather than clean
  // paths, so they carry less weight than a dedicated route would — but they
  // are real, distinct, linked-to pages, so they belong in the sitemap.
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/shop?cat=${encodeURIComponent(c.name)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // A database hiccup must not take the whole sitemap down — serve the
  // static entries rather than returning an error to the crawler.
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
    productPages = products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    productPages = [];
  }

  // /cart, /compare, /admin/* and /api/* are deliberately absent: they are
  // per-visitor, client-state-only, or private.
  return [...staticPages, ...categoryPages, ...productPages];
}
