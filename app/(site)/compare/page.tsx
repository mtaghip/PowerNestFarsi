"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { css } from "@/lib/css";
import { fa } from "@/lib/format";
import { clearCompare, getCompareIds, getServerCompareIds, subscribeCompare, toggleCompare } from "@/lib/compare-client";
import type { Product } from "@/app/generated/prisma/client";

function useCompareIds(): string[] {
  return useSyncExternalStore(subscribeCompare, getCompareIds, getServerCompareIds);
}

export default function ComparePage() {
  const ids = useCompareIds();
  const [fetched, setFetched] = useState<Product[]>([]);

  useEffect(() => {
    if (ids.length === 0) return;
    let cancelled = false;
    fetch(`/api/products?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setFetched(data);
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  const products = fetched.filter((p) => ids.includes(p.id));
  const loading = ids.length > 0 && products.length === 0;

  const rows =
    products.length > 0
      ? [
          { k: "برند", vals: products.map((p) => p.brand) },
          { k: "توان / ظرفیت", vals: products.map((p) => p.power) },
          { k: "ولتاژ", vals: products.map((p) => p.voltage) },
          { k: "گارانتی", vals: products.map((p) => p.warranty) },
          { k: "ویژگی شاخص", vals: products.map((p) => p.extra) },
          { k: "موجودی", vals: products.map((p) => (p.stock ? "موجود" : "ناموجود")) },
          { k: "قیمت (تومان)", vals: products.map((p) => fa(p.price)) },
        ]
      : [];

  return (
    <div style={css`max-width:1100px;margin:0 auto;padding:26px 24px 64px`}>
      <h1 style={css`margin:0 0 6px;font-size:27px;font-weight:800`}>مقایسه محصولات</h1>
      <p style={css`margin:0 0 22px;font-size:14.5px;color:#5E7370`}>تا ۳ کالا را کنار هم بگذارید و مشخصات کلیدی را ببینید.</p>

      {!loading && products.length === 0 ? (
        <div style={css`background:#fff;border:1px dashed #CBD9D6;border-radius:18px;padding:56px;text-align:center`}>
          <div style={css`font-size:16px;font-weight:700;margin-bottom:10px`}>هنوز کالایی برای مقایسه انتخاب نشده</div>
          <Link
            href="/shop"
            style={css`border:0;background:#0F5B52;color:#fff;padding:12px 22px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;display:inline-block`}
          >
            رفتن به فروشگاه
          </Link>
        </div>
      ) : (
        <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:18px;overflow:hidden`}>
          <div style={{ display: "grid", gridTemplateColumns: `150px repeat(${products.length},1fr)` }}>
            <div style={css`padding:18px;background:#F6F8F7;border-bottom:1px solid #E3EAE8`}></div>
            {products.map((p) => (
              <div key={p.id} style={css`padding:18px;border-bottom:1px solid #E3EAE8;border-right:1px solid #EDF2F1`}>
                <div style={css`height:120px;background:#F0F4F3;border-radius:10px;overflow:hidden;margin-bottom:12px;position:relative`}>
                  <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 33vw, 220px" />
                </div>
                <div style={css`font-size:14px;font-weight:600;line-height:1.6`}>{p.name}</div>
                <button
                  onClick={() => toggleCompare(p.id)}
                  style={css`margin-top:10px;border:0;background:transparent;color:#B4453A;font-size:12.5px;cursor:pointer;padding:0`}
                >
                  حذف از مقایسه
                </button>
              </div>
            ))}
          </div>
          {rows.map((r) => (
            <div
              key={r.k}
              style={{
                display: "grid",
                gridTemplateColumns: `150px repeat(${products.length},1fr)`,
                borderBottom: "1px solid #EDF2F1",
              }}
            >
              <div style={css`padding:15px 18px;background:#F6F8F7;font-size:13.5px;color:#5E7370`}>{r.k}</div>
              {r.vals.map((v, i) => (
                <div key={i} style={css`padding:15px 18px;font-size:14px;font-weight:600;border-right:1px solid #EDF2F1`}>
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {products.length > 0 && (
        <button
          onClick={() => clearCompare()}
          style={css`margin-top:14px;margin-left:10px;border:1px solid #CBD9D6;background:#fff;padding:12px 22px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer`}
        >
          پاک کردن مقایسه
        </button>
      )}
      <Link
        href="/shop"
        style={css`margin-top:20px;border:1px solid #CBD9D6;background:#fff;padding:12px 22px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;display:inline-block`}
      >
        بازگشت به فروشگاه
      </Link>
    </div>
  );
}
