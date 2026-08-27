"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { css } from "@/lib/css";
import { faNum } from "@/lib/format";

const teal = "#0F5B52";

const navItems = [
  { href: "/", label: "خانه", match: (p: string) => p === "/" },
  { href: "/shop", label: "فروشگاه", match: (p: string) => p === "/shop" || p.startsWith("/product/") },
  { href: "/calculator", label: "محاسبه سیستم", match: (p: string) => p === "/calculator" },
  { href: "/blog", label: "آموزش و وبلاگ", match: (p: string) => p === "/blog" },
  { href: "/consult", label: "مشاوره و استعلام", match: (p: string) => p === "/consult" },
];

export default function Header({ cartCount }: { cartCount: number }) {
  const pathname = usePathname();

  return (
    <>
      <div style={css`background:#0A3F39;color:#BFD9D4;font-size:13px`}>
        <div
          style={css`max-width:1280px;margin:0 auto;padding:9px 24px;display:flex;align-items:center;gap:24px;flex-wrap:wrap;white-space:nowrap`}
        >
          <span style={css`color:#F0F7F5;white-space:nowrap`}>ارسال به سراسر ایران و منطقه · تسویه ریالی و ارزی</span>
          <span style={css`flex:1`}></span>
          <span style={css`white-space:nowrap`}>
            پشتیبانی فنی: <span style={css`color:#EFA00B;font-weight:600;letter-spacing:.5px`}>۰۲۱-۹۱۰۰۵۵۰۰</span>
          </span>
          <span style={css`width:1px;height:14px;background:#2A5F58`}></span>
          <Link href="/consult" style={css`color:#BFD9D4`}>
            درخواست مشاوره رایگان
          </Link>
        </div>
      </div>

      <header style={css`background:#fff;border-bottom:1px solid #E3EAE8;position:sticky;top:0;z-index:40`}>
        <div style={css`max-width:1280px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;gap:24px`}>
          <Link href="/" style={css`display:flex;align-items:center;gap:11px;cursor:pointer;flex:none`}>
            <div
              style={css`width:40px;height:40px;border-radius:11px;background:#0F5B52;display:flex;align-items:center;justify-content:center;color:#EFA00B;font-weight:800;font-size:19px`}
            >
              آ
            </div>
            <div style={css`line-height:1.15`}>
              <div style={css`font-size:18px;font-weight:800;color:#0F5B52`}>آشیانه انرژی</div>
              <div style={css`font-size:11px;color:#7C8F8C;letter-spacing:1.2px`}>POWER NEST ENERGY</div>
            </div>
          </Link>

          <form
            action="/shop"
            style={css`flex:1;display:flex;align-items:center;background:#F6F8F7;border:1px solid #E3EAE8;border-radius:12px;padding:0 6px 0 0;max-width:560px`}
          >
            <input
              name="q"
              placeholder="جستجو در ۱٬۲۴۰ کالا — اینورتر، باتری، پکیج خورشیدی…"
              style={css`flex:1;border:0;background:transparent;padding:13px 14px;font-size:14px;outline:none;color:#12211F`}
            />
            <button
              type="submit"
              style={css`border:0;background:#0F5B52;color:#fff;padding:10px 20px;border-radius:9px;font-size:14px;font-weight:600;cursor:pointer;margin:4px`}
            >
              جستجو
            </button>
          </form>

          <div style={css`display:flex;align-items:center;gap:10px;flex:none`}>
            <Link
              href="/calculator"
              style={css`border:1px solid #0F5B52;background:#fff;color:#0F5B52;padding:11px 16px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer`}
            >
              ماشین‌حساب انرژی
            </Link>
            <Link
              href="/cart"
              style={css`border:1px solid #E3EAE8;background:#fff;padding:11px 15px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;color:#12211F;display:flex;align-items:center;gap:8px`}
            >
              سبد خرید
              <span
                style={css`background:#EFA00B;color:#3A2600;border-radius:20px;padding:1px 8px;font-size:12px;font-weight:700`}
              >
                {faNum(cartCount)}
              </span>
            </Link>
            <button
              style={css`border:1px solid #E3EAE8;background:#fff;padding:11px 15px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;color:#12211F`}
            >
              ورود / ثبت‌نام
            </button>
          </div>
        </div>

        <div style={css`max-width:1280px;margin:0 auto;padding:0 24px 12px;display:flex;align-items:center;gap:6px`}>
          <Link
            href="/shop"
            style={css`border:0;background:#0F5B52;color:#fff;padding:11px 18px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;display:flex;gap:10px;align-items:center`}
          >
            دسته‌بندی محصولات <span style={css`opacity:.7`}>▾</span>
          </Link>
          {navItems.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={css`border:0;background:transparent;padding:11px 14px;font-size:14px;font-weight:500;cursor:pointer;color:#12211F;border-bottom:2px solid ${active ? teal : "transparent"}`}
              >
                {item.label}
              </Link>
            );
          })}
          <span style={css`flex:1`}></span>
          <span style={css`font-size:13px;color:#7C8F8C`}>فروش عمده به نصاب‌ها و پیمانکاران</span>
        </div>
      </header>
    </>
  );
}
