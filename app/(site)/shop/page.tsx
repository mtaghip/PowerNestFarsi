import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { categoryByName } from "@/lib/categories";
import ShopListing, { type ShopParams } from "@/components/ShopListing";

export async function generateMetadata({ searchParams }: { searchParams: Promise<ShopParams> }): Promise<Metadata> {
  const sp = await searchParams;
  return {
    title: "فروشگاه تجهیزات خورشیدی | آشیانه انرژی",
    description:
      "خرید باتری لیتیوم، اینورتر، پکیج خورشیدی، توربین بادی، شارژر خودرو برقی و پمپ خورشیدی با گارانتی رسمی.",
    // Sorting and filters only reorder or narrow the same listing.
    alternates: { canonical: "/shop" },
    // Internal search results are thin, endlessly varied pages.
    ...(sp.q?.trim() ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<ShopParams> }) {
  const sp = await searchParams;

  // Categories used to live at /shop?cat=<Persian name>. Those URLs are in
  // Google's index and in old links, so send them — permanently, keeping any
  // other filters — to the category's own page instead of serving a duplicate.
  if (sp.cat) {
    const category = categoryByName(sp.cat);
    const rest = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) if (v && k !== "cat") rest.set(k, v);
    const qs = rest.toString();
    const base = category ? `/shop/${category.slug}` : "/shop";
    permanentRedirect(qs ? `${base}?${qs}` : base);
  }

  return <ShopListing category={null} sp={sp} />;
}
