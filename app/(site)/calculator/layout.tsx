import type { Metadata } from "next";

// The calculator page is a client component and cannot export metadata itself.
export const metadata: Metadata = {
  title: "ماشین‌حساب انرژی خورشیدی | محاسبه پنل، باتری و اینورتر | آشیانه انرژی",
  description:
    "با وارد کردن مصرف ماهانه و شهر، تعداد پنل، ظرفیت باتری لیتیوم، توان اینورتر، هزینه تخمینی و دوره بازگشت سرمایه سیستم خورشیدی خود را محاسبه کنید.",
  alternates: { canonical: "/calculator" },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
