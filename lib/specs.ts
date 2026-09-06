// A type alias rather than an interface on purpose: interfaces have no
// implicit index signature, so Prisma rejects Spec[] as a Json column value.
export type Spec = { k: string; v: string };

/**
 * Product.specs is a Json column, so anything could be in there (including
 * rows written by an older version of the app). Read defensively and keep
 * only well-formed { k, v } pairs.
 */
export function parseSpecs(value: unknown): Spec[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const { k, v } = row as Record<string, unknown>;
    if (typeof k !== "string" || typeof v !== "string") return [];
    const key = k.trim();
    const val = v.trim();
    return key && val ? [{ k: key, v: val }] : [];
  });
}

/** One "label: value" per line — the shape the admin form edits. */
export function specsToText(value: unknown): string {
  return parseSpecs(value)
    .map((s) => `${s.k}: ${s.v}`)
    .join("\n");
}

export function specsFromText(text: string): Spec[] {
  return text
    .split("\n")
    .flatMap((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return [];
      const k = line.slice(0, idx).trim();
      const v = line.slice(idx + 1).trim();
      return k && v ? [{ k, v }] : [];
    });
}
