"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { css } from "@/lib/css";
import { fa, faNum, stars } from "@/lib/format";
import { addToCartAction } from "@/app/actions";
import type { Product, Review } from "@/app/generated/prisma/client";

const teal = "#0F5B52";

interface Spec {
  k: string;
  v: string;
}

export default function ProductDetail({
  product,
  specBase,
  specFull,
  reviews,
}: {
  product: Product;
  specBase: Spec[];
  specFull: Spec[];
  reviews: Review[];
}) {
  const thumbs = [
    { src: product.image, alt: product.name },
    { src: "/img/detail-1.png", alt: "ترمینال‌ها" },
    { src: "/img/detail-2.png", alt: "پلاک مشخصات" },
    { src: "/img/detail-3.png", alt: "محتویات جعبه" },
    { src: "/img/hero.png", alt: "نصب‌شده" },
  ];
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"spec" | "install" | "reviews">("spec");
  const [pending, startTransition] = useTransition();

  const tabs: { v: typeof tab; n: string }[] = [
    { v: "spec", n: "مشخصات فنی" },
    { v: "install", n: "نصب و راه‌اندازی" },
    { v: "reviews", n: "دیدگاه کاربران" },
  ];

  function add() {
    const fd = new FormData();
    fd.set("productId", product.id);
    fd.set("qty", String(qty));
    startTransition(() => addToCartAction(fd));
  }

  return (
    <>
      <div
        style={css`background:#fff;border:1px solid #E3EAE8;border-radius:20px;padding:28px;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:36px`}
      >
        <div>
          <div style={css`height:400px;background:#F0F4F3;border-radius:14px;overflow:hidden;margin-bottom:12px;position:relative`}>
            <Image
              src={thumbs[active].src}
              alt={thumbs[active].alt}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 1024px) 100vw, 620px"
              priority
            />
          </div>
          <div style={css`display:grid;grid-template-columns:repeat(4,1fr);gap:10px`}>
            {thumbs.slice(1).map((t, i) => (
              <button
                key={t.src + i}
                onClick={() => setActive(i + 1)}
                style={css`height:88px;background:#F0F4F3;border-radius:10px;overflow:hidden;position:relative;border:2px solid ${active === i + 1 ? teal : "transparent"};cursor:pointer;padding:0`}
              >
                <Image src={t.src} alt={t.alt} fill style={{ objectFit: "cover" }} sizes="140px" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={css`display:flex;gap:10px;align-items:center;margin-bottom:14px`}>
            <span style={css`background:#E8F2F0;color:#0F5B52;font-size:12px;font-weight:600;padding:5px 11px;border-radius:6px`}>
              {product.brand}
            </span>
            <span style={css`font-size:12.5px;color:#EFA00B;letter-spacing:2px`}>{stars(product.rating)}</span>
            <span style={css`font-size:12.5px;color:#7C8F8C`}>({faNum(product.reviewCount)} دیدگاه)</span>
          </div>
          <h1 style={css`margin:0 0 16px;font-size:27px;font-weight:800;line-height:1.5;text-wrap:pretty`}>{product.name}</h1>
          <p style={css`margin:0 0 22px;font-size:14.5px;line-height:1.9;color:#5E7370;text-wrap:pretty`}>{product.description}</p>

          <div style={css`border:1px solid #E3EAE8;border-radius:14px;overflow:hidden;margin-bottom:20px`}>
            {specBase.map((s) => (
              <div
                key={s.k}
                style={css`display:flex;justify-content:space-between;gap:16px;padding:12px 16px;font-size:13.5px;border-bottom:1px solid #EDF2F1`}
              >
                <span style={css`color:#7C8F8C`}>{s.k}</span>
                <span style={css`font-weight:600`}>{s.v}</span>
              </div>
            ))}
          </div>

          <div style={css`background:#F6F8F7;border:1px solid #E3EAE8;border-radius:14px;padding:20px;margin-bottom:16px`}>
            <div style={css`display:flex;align-items:flex-end;gap:12px;margin-bottom:6px`}>
              <div style={css`font-size:29px;font-weight:800;color:#0F5B52`}>{fa(product.price)}</div>
              <div style={css`font-size:14px;color:#7C8F8C;padding-bottom:6px`}>تومان</div>
              <span style={css`flex:1`}></span>
              <div style={css`font-size:13px;color:${product.stock ? "#1D7A4C" : "#B4453A"};font-weight:600;padding-bottom:8px`}>
                {product.stock ? "موجود در انبار" : "ناموجود — استعلام"}
              </div>
            </div>
            <div style={css`font-size:12.5px;color:#7C8F8C;margin-bottom:18px`}>قیمت با احتساب مالیات · امکان پرداخت اقساطی تا ۱۲ ماه</div>
            <div style={css`display:flex;gap:10px`}>
              <div style={css`display:flex;align-items:center;border:1px solid #CBD9D6;border-radius:10px;background:#fff`}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={css`border:0;background:transparent;padding:12px 15px;font-size:17px;cursor:pointer;color:#0F5B52`}
                >
                  −
                </button>
                <span style={css`min-width:34px;text-align:center;font-size:15px;font-weight:600`}>{faNum(qty)}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  style={css`border:0;background:transparent;padding:12px 15px;font-size:17px;cursor:pointer;color:#0F5B52`}
                >
                  +
                </button>
              </div>
              <button
                onClick={add}
                disabled={pending || !product.stock}
                style={css`flex:1;border:0;background:#0F5B52;color:#fff;padding:15px;border-radius:11px;font-size:15px;font-weight:700;cursor:pointer;opacity:${pending || !product.stock ? "0.6" : "1"}`}
              >
                افزودن به سبد خرید
              </button>
              <a
                href="/consult"
                style={css`border:1px solid #CBD9D6;background:#fff;color:#12211F;padding:15px 20px;border-radius:11px;font-size:14.5px;font-weight:600;cursor:pointer;text-decoration:none;display:flex;align-items:center`}
              >
                استعلام نصب
              </a>
            </div>
          </div>

          <div style={css`display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:12.5px;color:#3D5451`}>
            <div style={css`border:1px solid #E3EAE8;border-radius:11px;padding:13px;background:#fff`}>ارسال ۳ تا ۷ روز کاری</div>
            <div style={css`border:1px solid #E3EAE8;border-radius:11px;padding:13px;background:#fff`}>گارانتی تعویض ۷ روزه</div>
            <div style={css`border:1px solid #E3EAE8;border-radius:11px;padding:13px;background:#fff`}>نصب توسط تیم مجاز</div>
          </div>
        </div>
      </div>

      <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:20px;margin-top:20px;overflow:hidden`}>
        <div style={css`display:flex;border-bottom:1px solid #E3EAE8`}>
          {tabs.map((t) => (
            <button
              key={t.v}
              onClick={() => setTab(t.v)}
              style={css`border:0;background:transparent;padding:17px 26px;font-size:14.5px;font-weight:600;cursor:pointer;color:${tab === t.v ? teal : "#5E7370"};border-bottom:3px solid ${tab === t.v ? teal : "transparent"}`}
            >
              {t.n}
            </button>
          ))}
        </div>
        <div style={css`padding:28px`}>
          {tab === "spec" && (
            <div style={css`display:grid;grid-template-columns:1fr 1fr;gap:0 40px`}>
              {specFull.map((s) => (
                <div
                  key={s.k}
                  style={css`display:flex;justify-content:space-between;gap:16px;padding:13px 0;font-size:14px;border-bottom:1px solid #EDF2F1`}
                >
                  <span style={css`color:#7C8F8C`}>{s.k}</span>
                  <span style={css`font-weight:600`}>{s.v}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "install" && (
            <div style={css`max-width:760px;font-size:14.5px;line-height:2;color:#3D5451`}>
              <p style={css`margin:0 0 14px`}>
                نصب این محصول باید توسط تیم دارای مجوز انجام شود. پس از ثبت سفارش، کارشناس آشیانه برای بازدید فنی و
                اندازه‌گیری محل نصب با شما تماس می‌گیرد.
              </p>
              <div style={css`display:grid;gap:10px;margin-top:18px`}>
                <div style={css`display:flex;gap:14px;align-items:flex-start;background:#F6F8F7;border-radius:12px;padding:16px`}>
                  <span style={css`color:#0F5B52;font-weight:800`}>۱</span>
                  <span>بازدید فنی و تأیید ظرفیت تابلو برق — ۲ روز کاری</span>
                </div>
                <div style={css`display:flex;gap:14px;align-items:flex-start;background:#F6F8F7;border-radius:12px;padding:16px`}>
                  <span style={css`color:#0F5B52;font-weight:800`}>۲</span>
                  <span>ارسال کالا و اجرای سازه و سیم‌کشی — ۱ تا ۳ روز</span>
                </div>
                <div style={css`display:flex;gap:14px;align-items:flex-start;background:#F6F8F7;border-radius:12px;padding:16px`}>
                  <span style={css`color:#0F5B52;font-weight:800`}>۳</span>
                  <span>راه‌اندازی، تنظیم اپلیکیشن مانیتورینگ و تحویل — همان روز</span>
                </div>
              </div>
            </div>
          )}
          {tab === "reviews" && (
            <div style={css`display:grid;gap:14px;max-width:820px`}>
              {reviews.map((r) => (
                <div key={r.id} style={css`border:1px solid #E3EAE8;border-radius:14px;padding:18px`}>
                  <div style={css`display:flex;gap:12px;align-items:center;margin-bottom:10px`}>
                    <span style={css`font-size:14px;font-weight:700`}>{r.author}</span>
                    <span style={css`font-size:12px;color:#EFA00B;letter-spacing:2px`}>{stars(r.rating)}</span>
                    <span style={css`flex:1`}></span>
                    <span style={css`font-size:12px;color:#93A5A2`}>
                      {new Date(r.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                  <div style={css`font-size:14px;line-height:1.9;color:#3D5451;text-wrap:pretty`}>{r.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
