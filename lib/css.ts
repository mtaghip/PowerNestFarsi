import type { CSSProperties } from "react";

/**
 * Tagged template that turns a CSS-declaration string (the same shorthand used
 * in the original Claude Design prototype's inline `style="..."` attributes)
 * into a React style object, so screens can be ported near-verbatim.
 */
export function css(strings: TemplateStringsArray, ...values: unknown[]): CSSProperties {
  const text = strings.reduce((acc, s, i) => acc + s + (i < values.length ? String(values[i]) : ""), "");
  const style: Record<string, string> = {};
  for (const rule of text.split(";")) {
    const idx = rule.indexOf(":");
    if (idx === -1) continue;
    const prop = rule.slice(0, idx).trim();
    const val = rule.slice(idx + 1).trim();
    if (!prop || !val) continue;
    const camel = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    style[camel] = val;
  }
  return style as CSSProperties;
}
