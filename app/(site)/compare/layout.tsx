import type { Metadata } from "next";

// Client component page; its contents depend on what the visitor picked, so
// there is nothing for a search engine to index.
export const metadata: Metadata = {
  title: "مقایسه محصولات | آشیانه انرژی",
  robots: { index: false, follow: true },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
