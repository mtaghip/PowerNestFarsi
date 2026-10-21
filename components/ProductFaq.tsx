import Link from "next/link";
import { css } from "@/lib/css";
import type { FaqItem } from "@/lib/product-faq";

/**
 * Collapsible Q&A built on <details>, so it works with no JavaScript and the
 * answers are in the HTML for search engines even while collapsed.
 */
export default function ProductFaq({ items, title }: { items: FaqItem[]; title: string }) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="product-faq-title"
      style={css`background:#fff;border:1px solid #E3EAE8;border-radius:20px;margin-top:20px;overflow:hidden`}
    >
      <h2
        id="product-faq-title"
        className="r-roomy"
        style={css`margin:0;padding:22px 28px;font-size:19px;font-weight:800;border-bottom:1px solid #E3EAE8;line-height:1.6`}
      >
        {title}
      </h2>
      {items.map((item, i) => (
        <details key={i} open={i === 0} style={css`border-bottom:1px solid #EDF2F1`}>
          <summary
            style={css`cursor:pointer;padding:18px 28px;font-size:15px;font-weight:700;line-height:1.8;color:#12211F`}
          >
            {item.q}
          </summary>
          <div style={css`padding:0 28px 20px`}>
            <p style={css`margin:0;font-size:14.5px;line-height:2.05;color:#3D5451;text-wrap:pretty`}>{item.a}</p>
            {item.link && (
              <Link
                href={item.link.href}
                style={css`display:inline-block;margin-top:10px;font-size:13.5px;font-weight:600;color:#0F5B52`}
              >
                {item.link.label} ←
              </Link>
            )}
          </div>
        </details>
      ))}
    </section>
  );
}
