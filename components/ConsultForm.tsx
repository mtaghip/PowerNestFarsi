"use client";

import { useState } from "react";
import { css } from "@/lib/css";
import { submitConsultAction } from "@/app/actions";

const teal = "#0F5B52";
const line = "#E3EAE8";

const PROJECT_TYPES = ["خانگی", "ویلا و باغ", "صنعتی", "کشاورزی", "نصاب / پیمانکار"];

export default function ConsultForm() {
  const [ptype, setPtype] = useState(PROJECT_TYPES[0]);

  return (
    <form action={submitConsultAction}>
      <input type="hidden" name="projectType" value={ptype} />
      <h1 style={css`margin:0 0 10px;font-size:26px;font-weight:800`}>درخواست مشاوره و استعلام قیمت</h1>
      <p style={css`margin:0 0 28px;font-size:14.5px;line-height:1.9;color:#5E7370;text-wrap:pretty`}>
        فرم را پر کنید تا طرح فنی و پیش‌فاکتور رسمی برایتان آماده شود. مشاوره و طراحی اولیه سیستم بدون هزینه است.
      </p>
      <div style={css`display:grid;grid-template-columns:1fr 1fr;gap:12px`}>
        <input
          name="name"
          required
          placeholder="نام و نام خانوادگی"
          style={css`border:1px solid #E3EAE8;border-radius:10px;padding:13px 14px;font-size:14px;outline:none;background:#F9FBFA`}
        />
        <input
          name="phone"
          required
          placeholder="شماره تماس"
          style={css`border:1px solid #E3EAE8;border-radius:10px;padding:13px 14px;font-size:14px;outline:none;background:#F9FBFA`}
        />
        <input
          name="company"
          placeholder="نام شرکت (اختیاری)"
          style={css`border:1px solid #E3EAE8;border-radius:10px;padding:13px 14px;font-size:14px;outline:none;background:#F9FBFA`}
        />
        <input
          name="city"
          required
          placeholder="شهر محل پروژه"
          style={css`border:1px solid #E3EAE8;border-radius:10px;padding:13px 14px;font-size:14px;outline:none;background:#F9FBFA`}
        />
      </div>
      <div style={css`font-size:14.5px;font-weight:700;margin:24px 0 12px`}>نوع پروژه</div>
      <div style={css`display:flex;gap:8px;flex-wrap:wrap`}>
        {PROJECT_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setPtype(t)}
            style={css`border:1px solid ${ptype === t ? teal : line};background:${ptype === t ? "#E8F2F0" : "#fff"};color:${ptype === t ? teal : "#3D5451"};padding:10px 18px;border-radius:22px;font-size:13.5px;font-weight:600;cursor:pointer`}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={css`font-size:14.5px;font-weight:700;margin:24px 0 12px`}>توضیح پروژه</div>
      <textarea
        name="message"
        placeholder="مثلاً: کارگاه ۸۰۰ متری در اصفهان، مصرف ماهانه حدود ۴٬۰۰۰ کیلووات‌ساعت، سقف شیب‌دار فلزی."
        style={css`width:100%;border:1px solid #E3EAE8;border-radius:10px;padding:14px;font-size:14px;outline:none;background:#F9FBFA;min-height:120px;resize:vertical`}
      />
      <button
        type="submit"
        style={css`margin-top:22px;border:0;background:#0F5B52;color:#fff;padding:15px 32px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer`}
      >
        ارسال درخواست
      </button>
    </form>
  );
}
