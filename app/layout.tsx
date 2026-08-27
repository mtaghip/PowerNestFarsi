import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "آشیانه انرژی | Power Nest Energy",
  description: "بازار آنلاین تجهیزات انرژی خورشیدی و بادی — اینورتر، باتری لیتیوم، پکیج کامل و مشاوره رایگان.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body style={{ fontFamily: "var(--font-vazirmatn), system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
