/**
 * Serialises a schema.org object for a `<script type="application/ld+json">`.
 *
 * `JSON.stringify` alone is not safe here: a product name or description that
 * contains `</script>` would close the tag early and let the rest run as HTML.
 * Escaping `<` — the approach the Next.js JSON-LD guide recommends — closes
 * that hole without changing what a parser reads back.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Prices are stored in toman, which is not an ISO 4217 currency. Structured
 * data has to use rial (IRR); one toman is ten rial.
 */
export function tomanToRial(toman: number): number {
  return toman * 10;
}

/** Trims to roughly `max` characters on a word boundary, for meta descriptions. */
export function excerpt(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}
