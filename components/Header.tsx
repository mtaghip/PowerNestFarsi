"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { css } from "@/lib/css";
import { faNum } from "@/lib/format";
import { PHONE_DISPLAY } from "@/lib/contact";

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
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div style={css`background:#0A3F39;color:#BFD9D4;font-size:13px`}>
        <div
          className="r-pad"
          style={css`max-width:1280px;margin:0 auto;padding:9px 24px;display:flex;align-items:center;gap:24px;flex-wrap:wrap;white-space:nowrap`}
        >
          <span className="r-hide-md" style={css`color:#F0F7F5;white-space:nowrap`}>
            ارسال به سراسر ایران و منطقه · تسویه ریالی و ارزی
          </span>
          <span style={css`flex:1`}></span>
          <span style={css`white-space:nowrap`}>
            پشتیبانی فنی: <span style={css`color:#EFA00B;font-weight:600;letter-spacing:.5px;direction:ltr;unicode-bidi:isolate;`}>{PHONE_DISPLAY}</span>
          </span>
          <span className="r-hide-sm" style={css`width:1px;height:14px;background:#2A5F58`}></span>
          <Link href="/consult" className="r-hide-sm" style={css`color:#BFD9D4`}>
            درخواست مشاوره رایگان
          </Link>
        </div>
      </div>

      <header style={css`background:#fff;border-bottom:1px solid #E3EAE8;position:sticky;top:0;z-index:40`}>
        <div
          className="r-header-row r-pad"
          style={css`max-width:1280px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;gap:24px`}
        >
          <Link href="/" style={css`display:flex;align-items:center;gap:11px;cursor:pointer;flex:none`}>
            <div
              style={css`width:40px;height:40px;border-radius:11px;background:#0F5B52;display:flex;align-items:center;justify-content:center;color:#EFA00B;font-weight:800;font-size:19px;flex:none`}
            >
              آ
            </div>
            <div style={css`line-height:1.15`}>
              <div style={css`font-size:18px;font-weight:800;color:#0F5B52`}>آشیانه انرژی</div>
              <div style={css`font-size:11px;color:#7C8F8C;letter-spacing:1.2px`}>POWER NEST ENERGY</div>
            </div>
          </Link>

          {/* Pushes the actions to the far edge once the search field has
              wrapped away to its own line and stopped doing that job. */}
          <span className="r-only-md r-header-spacer" style={css`display:none`}></span>

          <form
            action="/shop"
            className="r-header-search"
            style={css`flex:1;display:flex;align-items:center;background:#F6F8F7;border:1px solid #E3EAE8;border-radius:12px;padding:0 6px 0 0;max-width:560px`}
          >
            <input
              name="q"
              placeholder="جستجو در ۱٬۲۴۰ کالا — اینورتر، باتری، پکیج خورشیدی…"
              style={css`flex:1;border:0;background:transparent;padding:13px 14px;font-size:14px;outline:none;color:#12211F;min-width:0`}
            />
            <button
              type="submit"
              style={css`border:0;background:#0F5B52;color:#fff;padding:10px 20px;border-radius:9px;font-size:14px;font-weight:600;cursor:pointer;margin:4px;flex:none`}
            >
              جستجو
            </button>
          </form>

          <div style={css`display:flex;align-items:center;gap:10px;flex:none`}>
            <Link
              href="/calculator"
              className="r-hide-md"
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
              className="r-hide-md"
              style={css`border:1px solid #E3EAE8;background:#fff;padding:11px 15px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;color:#12211F`}
            >
              ورود / ثبت‌نام
            </button>

            <button
              type="button"
              className="r-only-md"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
              style={css`display:none;border:1px solid #E3EAE8;background:#fff;width:44px;height:44px;border-radius:10px;cursor:pointer;color:#12211F;align-items:center;justify-content:center;flex:none;padding:0`}
            >
              <span aria-hidden="true" style={css`display:block;font-size:19px;line-height:1`}>
                {menuOpen ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>

        {/* On phones these links live in the menu panel instead. */}
        <div
          className="r-pad r-hide-md"
          style={css`max-width:1280px;margin:0 auto;padding:0 24px 12px;display:flex;align-items:center;gap:6px`}
        >
          <Link
            href="/shop"
            style={css`border:0;background:#0F5B52;color:#fff;padding:11px 18px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;display:flex;gap:10px;align-items:center;white-space:nowrap`}
          >
            دسته‌بندی محصولات <span style={css`opacity:.7`}>▾</span>
          </Link>
          {navItems.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={css`border:0;background:transparent;padding:11px 14px;font-size:14px;font-weight:500;cursor:pointer;color:#12211F;border-bottom:2px solid ${active ? teal : "transparent"};white-space:nowrap`}
              >
                {item.label}
              </Link>
            );
          })}
          <span style={css`flex:1`}></span>
          <span style={css`font-size:13px;color:#7C8F8C;white-space:nowrap`}>فروش عمده به نصاب‌ها و پیمانکاران</span>
        </div>

        {/* Everything the collapsed header dropped, reachable from the menu. */}
        <nav className="r-menu-panel" data-open={menuOpen}>
          <Link
            href="/shop"
            onClick={closeMenu}
            style={css`background:#0F5B52;color:#fff;padding:13px 16px;border-radius:10px;font-size:14px;font-weight:600;margin-bottom:6px`}
          >
            دسته‌بندی محصولات
          </Link>
          {navItems.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                style={css`padding:13px 12px;font-size:15px;font-weight:500;color:${active ? teal : "#12211F"};border-radius:9px;background:${active ? "#EEF5F3" : "transparent"}`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/calculator"
            onClick={closeMenu}
            style={css`margin-top:8px;border:1px solid #0F5B52;color:#0F5B52;padding:13px 16px;border-radius:10px;font-size:14px;font-weight:600;text-align:center`}
          >
            ماشین‌حساب انرژی
          </Link>
          <button
            type="button"
            style={css`margin-top:6px;border:1px solid #E3EAE8;background:#fff;padding:13px 16px;border-radius:10px;font-size:14px;font-weight:600;color:#12211F;cursor:pointer;width:100%`}
          >
            ورود / ثبت‌نام
          </button>
          <span style={css`font-size:12.5px;color:#7C8F8C;padding:10px 2px 0;text-align:center`}>
            فروش عمده به نصاب‌ها و پیمانکاران
          </span>
        </nav>
      </header>
    </>
  );
}
