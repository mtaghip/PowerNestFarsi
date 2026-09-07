"use client";

import { useState } from "react";
import { css } from "@/lib/css";
import { fa } from "@/lib/format";
import { placeOrderAction } from "@/app/actions";

const teal = "#0F5B52";
const line = "#E3EAE8";
const ink = "#12211F";

const PAYMENTS = [
  { v: "gateway", n: "پرداخت آنلاین (درگاه بانکی)", h: "شتاب · تسویه فوری" },
  { v: "install", n: "اقساط ۱۲ ماهه", h: "با اعتبارسنجی، پیش‌پرداخت ۳۰٪" },
  { v: "b2b", n: "حساب همکاری B2B", h: "تسویه ۶۰ روزه برای نصاب‌ها" },
];

export default function CheckoutForm({
  subtotal,
  vat,
  shipping,
  grandTotal,
}: {
  subtotal: number;
  vat: number;
  shipping: number;
  grandTotal: number;
}) {
  const [pay, setPay] = useState("gateway");

  return (
    <form
      action={placeOrderAction}
      className="r-split"
      style={css`display:grid;grid-template-columns:minmax(0,1fr) 372px;gap:20px;align-items:start`}
    >
      <input type="hidden" name="paymentMethod" value={pay} />
      <div style={css`display:grid;gap:16px`}>
        <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:18px;padding:24px`}>
          <div style={css`font-size:16px;font-weight:700;margin-bottom:18px`}>اطلاعات ارسال و نصب</div>
          <div className="r-pair" style={css`display:grid;grid-template-columns:1fr 1fr;gap:12px`}>
            <input
              name="name"
              required
              placeholder="نام و نام خانوادگی"
              style={css`border:1px solid #E3EAE8;border-radius:10px;padding:13px 14px;font-size:14px;outline:none;background:#F9FBFA`}
            />
            <input
              name="phone"
              required
              placeholder="شماره موبایل"
              style={css`border:1px solid #E3EAE8;border-radius:10px;padding:13px 14px;font-size:14px;outline:none;background:#F9FBFA`}
            />
            <input
              name="province"
              required
              placeholder="استان و شهر"
              style={css`border:1px solid #E3EAE8;border-radius:10px;padding:13px 14px;font-size:14px;outline:none;background:#F9FBFA`}
            />
            <input
              name="postalCode"
              required
              placeholder="کد پستی"
              style={css`border:1px solid #E3EAE8;border-radius:10px;padding:13px 14px;font-size:14px;outline:none;background:#F9FBFA`}
            />
            <textarea
              name="address"
              required
              placeholder="نشانی کامل محل نصب"
              style={css`width:100%;border:1px solid #E3EAE8;border-radius:10px;padding:13px 14px;font-size:14px;outline:none;background:#F9FBFA;grid-column:span 2;min-height:84px;resize:vertical`}
            />
          </div>
          <div style={css`font-size:15px;font-weight:700;margin:24px 0 14px`}>روش پرداخت</div>
          <div style={css`display:grid;gap:10px`}>
            {PAYMENTS.map((m) => (
              <button
                key={m.v}
                type="button"
                onClick={() => setPay(m.v)}
                style={css`border:1px solid ${pay === m.v ? teal : line};background:${pay === m.v ? "#E8F2F0" : "#fff"};padding:15px 18px;border-radius:12px;cursor:pointer;text-align:right;display:flex;gap:14px;align-items:center`}
              >
                <span style={css`width:16px;height:16px;border-radius:50%;border:5px solid ${pay === m.v ? teal : "#D6E0DE"};flex:none`}></span>
                <span style={{ flex: 1 }}>
                  <span style={css`font-size:14.5px;font-weight:600;color:${pay === m.v ? teal : ink}`}>{m.n}</span>
                  <span style={css`font-size:12.5px;color:#7C8F8C;display:block;margin-top:3px`}>{m.h}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:18px;padding:24px;position:sticky;top:150px`}>
        <div style={css`font-size:16px;font-weight:700;margin-bottom:18px`}>خلاصه سفارش</div>
        <div style={css`display:grid;gap:12px;font-size:14px`}>
          <div style={css`display:flex;justify-content:space-between`}>
            <span style={css`color:#5E7370`}>جمع کالاها</span>
            <span style={css`font-weight:600`}>{fa(subtotal)}</span>
          </div>
          <div style={css`display:flex;justify-content:space-between`}>
            <span style={css`color:#5E7370`}>مالیات بر ارزش افزوده ۹٪</span>
            <span style={css`font-weight:600`}>{fa(vat)}</span>
          </div>
          <div style={css`display:flex;justify-content:space-between`}>
            <span style={css`color:#5E7370`}>هزینه ارسال</span>
            <span style={css`font-weight:600;color:#0F5B52`}>{shipping === 0 ? "رایگان" : fa(shipping)}</span>
          </div>
          <div style={css`display:flex;justify-content:space-between;border-top:1px solid #EDF2F1;padding-top:14px;margin-top:2px`}>
            <span style={css`font-size:15px;font-weight:700`}>مبلغ قابل پرداخت</span>
            <span style={css`font-size:19px;font-weight:800;color:#0F5B52`}>{fa(grandTotal)}</span>
          </div>
          <div style={css`font-size:12.5px;color:#7C8F8C;text-align:left`}>تومان</div>
        </div>
        <button
          type="submit"
          style={css`margin-top:20px;border:0;background:#EFA00B;color:#3A2600;padding:16px;border-radius:12px;font-size:15.5px;font-weight:800;cursor:pointer;width:100%`}
        >
          ثبت و پرداخت سفارش
        </button>
        <div style={css`font-size:12px;color:#93A5A2;line-height:1.9;margin-top:14px`}>
          با ثبت سفارش، شرایط گارانتی و بازگشت کالا را می‌پذیرید. نصب پس از بازدید فنی زمان‌بندی می‌شود.
        </div>
      </div>
    </form>
  );
}
