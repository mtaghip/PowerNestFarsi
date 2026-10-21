import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "آشیانه انرژی | Power Nest Energy",
  description: "بازار آنلاین تجهیزات انرژی خورشیدی و بادی — اینورتر، باتری لیتیوم، پکیج کامل و مشاوره رایگان.",
  // No `alternates.canonical` here on purpose. Metadata merges shallowly, so a
  // canonical set in the root layout is inherited by every page that doesn't
  // override it — and a canonical of "/" on a product page tells Google that
  // page is a duplicate of the homepage, which keeps it out of the results.
  // Each page declares its own canonical instead.
  openGraph: {
    siteName: "آشیانه انرژی",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body style={{ fontFamily: "var(--font-vazirmatn), system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
