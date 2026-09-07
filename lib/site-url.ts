/**
 * Absolute base URL, used for sitemap/robots entries and canonical links,
 * which must be fully qualified.
 *
 * Deliberately does not fall back to VERCEL_PROJECT_PRODUCTION_URL: that can
 * resolve to the *.vercel.app subdomain, which would publish canonicals and
 * sitemap entries on a different host than the live site and split ranking
 * signals between the two. Override with NEXT_PUBLIC_SITE_URL if the domain
 * ever changes.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  return "https://www.ashiyanehenergy.com";
}
