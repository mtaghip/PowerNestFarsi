"use client";

import { useMemo, useState, useTransition } from "react";
import { css } from "@/lib/css";
import { fa, faDec, faNum } from "@/lib/format";
import { CITIES, TARIFF, sizeSystem, type Goal } from "@/lib/calc";
import { addPackageAction } from "@/app/actions";

const teal = "#0F5B52";
const line = "#E3EAE8";

type UserType = "home" | "ind" | "agri";

const USER_TYPES: { v: UserType; n: string; h: string; kwh: number }[] = [
  { v: "home", n: "خانه و ویلا", h: "معمولاً ۳۰۰ تا ۹۰۰ kWh", kwh: 600 },
  { v: "ind", n: "کارگاه و صنعت", h: "از ۲٬۰۰۰ kWh به بالا", kwh: 3000 },
  { v: "agri", n: "کشاورزی و چاه آب", h: "مصرف فصلی و پمپاژ", kwh: 1500 },
];

const GOALS: { v: Goal; n: string; h: string; tag: string }[] = [
  { v: "saving", n: "کاهش هزینه برق", h: "بیشترین تولید در روز، باتری کوچک برای پیک مصرف.", tag: "رایج‌ترین" },
  { v: "backup", n: "بک‌آپ در قطعی برق", h: "باتری بزرگ‌تر برای تأمین بار خانه در ساعات قطعی.", tag: "با باتری" },
  { v: "offgrid", n: "مستقل از شبکه", h: "تأمین کامل مصرف بدون اتصال به برق شهری.", tag: "آف‌گرید" },
];

const GOAL_LABEL: Record<Goal, string> = { saving: "کاهش هزینه برق", backup: "بک‌آپ در قطعی", offgrid: "مستقل از شبکه" };

const STEP_NAMES = ["مصرف", "شهر", "هدف", "نتیجه"];

export default function CalculatorPage() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType>("home");
  const [kwh, setKwh] = useState(600);
  const [city, setCity] = useState("تهران");
  const [goal, setGoal] = useState<Goal>("saving");
  const [backupHours, setBackupHours] = useState(8);
  const [pending, startTransition] = useTransition();

  const result = useMemo(() => sizeSystem({ kwh, city, goal, backupHours }), [kwh, city, goal, backupHours]);
  const coverage = Math.min(100, Math.round((result.annualGen / (kwh * 12)) * 100));

  function addPackage() {
    const fd = new FormData();
    fd.set("productSlug", result.panels > 12 ? "pkg-20" : "pkg-3");
    startTransition(() => addPackageAction(fd));
  }

  return (
    <div className="r-pad" style={css`max-width:1080px;margin:0 auto;padding:34px 24px 64px`}>
      <div style={css`text-align:center;margin-bottom:30px`}>
        <div style={css`font-size:13px;font-weight:700;color:#EFA00B;margin-bottom:10px`}>ماشین‌حساب انرژی آشیانه</div>
        <h1 className="r-h2" style={css`margin:0 0 12px;font-size:33px;font-weight:800`}>سیستم خورشیدی من چقدر باید باشد؟</h1>
        <p style={css`margin:0 auto;font-size:15.5px;line-height:1.85;color:#5E7370;max-width:620px;text-wrap:pretty`}>
          سه سؤال، و تعداد پنل، ظرفیت باتری، توان اینورتر، هزینه تخمینی و سال بازگشت سرمایه را می‌گیرید.
        </p>
      </div>

      <div className="r-wrap" style={css`display:flex;gap:8px;justify-content:center;margin-bottom:26px`}>
        {STEP_NAMES.map((name, i) => {
          const idx = i + 1;
          const bg = step === idx ? teal : step > idx ? "#E8F2F0" : "#fff";
          const border = step >= idx ? teal : line;
          const color = step === idx ? "#fff" : step > idx ? teal : "#7C8F8C";
          return (
            <div
              key={name}
              style={css`display:flex;align-items:center;gap:10px;background:${bg};border:1px solid ${border};color:${color};padding:10px 18px;border-radius:24px;font-size:13.5px;font-weight:600`}
            >
              <span style={{ opacity: 0.65 }}>{faNum(idx)}</span>
              {name}
            </div>
          );
        })}
      </div>

      <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:20px;padding:34px`}>
        {step === 1 && (
          <div style={css`max-width:640px;margin:0 auto`}>
            <h2 style={css`margin:0 0 8px;font-size:21px;font-weight:700`}>مصرف برق شما</h2>
            <p style={css`margin:0 0 26px;font-size:14px;color:#5E7370`}>عدد مصرف ماهانه روی قبض برق نوشته شده است (کیلووات‌ساعت).</p>
            <div className="r-cards-3" style={css`display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:28px`}>
              {USER_TYPES.map((u) => (
                <button
                  key={u.v}
                  onClick={() => {
                    setUserType(u.v);
                    setKwh(u.kwh);
                  }}
                  style={css`border:1px solid ${userType === u.v ? teal : line};background:${userType === u.v ? "#E8F2F0" : "#fff"};padding:18px 14px;border-radius:14px;cursor:pointer;text-align:right`}
                >
                  <div style={css`font-size:15px;font-weight:700;color:${userType === u.v ? teal : "#3D5451"};margin-bottom:5px`}>{u.n}</div>
                  <div style={css`font-size:12.5px;color:#7C8F8C`}>{u.h}</div>
                </button>
              ))}
            </div>
            <div style={css`background:#F6F8F7;border:1px solid #E3EAE8;border-radius:14px;padding:22px`}>
              <div style={css`display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px`}>
                <span style={css`font-size:14.5px;font-weight:600`}>مصرف ماهانه</span>
                <span style={css`font-size:22px;font-weight:800;color:#0F5B52`}>
                  {faNum(kwh)} <span style={css`font-size:13px;font-weight:500;color:#7C8F8C`}>کیلووات‌ساعت</span>
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={6000}
                step={50}
                value={kwh}
                onChange={(e) => setKwh(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#0F5B52" }}
              />
              <div style={css`display:flex;justify-content:space-between;font-size:12px;color:#93A5A2;margin-top:8px`}>
                <span>۱۰۰</span>
                <span>۶٬۰۰۰</span>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              style={css`margin-top:26px;border:0;background:#0F5B52;color:#fff;padding:15px 30px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer`}
            >
              مرحله بعد
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={css`max-width:720px;margin:0 auto`}>
            <h2 style={css`margin:0 0 8px;font-size:21px;font-weight:700`}>شهر محل نصب</h2>
            <p style={css`margin:0 0 26px;font-size:14px;color:#5E7370`}>میزان تابش خورشید هر شهر، تعداد پنل موردنیاز را تعیین می‌کند.</p>
            <div className="r-tiles" style={css`display:grid;grid-template-columns:repeat(5,1fr);gap:10px`}>
              {Object.entries(CITIES).map(([name, irr]) => (
                <button
                  key={name}
                  onClick={() => setCity(name)}
                  style={css`border:1px solid ${city === name ? teal : line};background:${city === name ? "#E8F2F0" : "#fff"};padding:15px 10px;border-radius:12px;cursor:pointer;text-align:center`}
                >
                  <div style={css`font-size:14.5px;font-weight:700;color:${city === name ? teal : "#3D5451"};margin-bottom:5px`}>{name}</div>
                  <div style={css`font-size:12px;color:#7C8F8C`}>{irr.toLocaleString("fa-IR")} kWh/m²</div>
                </button>
              ))}
            </div>
            <div className="r-wrap" style={css`display:flex;gap:10px;margin-top:26px`}>
              <button
                onClick={() => setStep(3)}
                style={css`border:0;background:#0F5B52;color:#fff;padding:15px 30px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer`}
              >
                مرحله بعد
              </button>
              <button
                onClick={() => setStep(1)}
                style={css`border:1px solid #CBD9D6;background:#fff;padding:15px 24px;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer`}
              >
                قبلی
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={css`max-width:680px;margin:0 auto`}>
            <h2 style={css`margin:0 0 8px;font-size:21px;font-weight:700`}>هدف شما از سیستم</h2>
            <p style={css`margin:0 0 26px;font-size:14px;color:#5E7370`}>این انتخاب ظرفیت باتری و تعداد پنل را تغییر می‌دهد.</p>
            <div style={css`display:grid;gap:10px`}>
              {GOALS.map((g) => (
                <button
                  key={g.v}
                  onClick={() => setGoal(g.v)}
                  style={css`border:1px solid ${goal === g.v ? teal : line};background:${goal === g.v ? "#E8F2F0" : "#fff"};padding:20px;border-radius:14px;cursor:pointer;text-align:right;display:flex;gap:16px;align-items:center`}
                >
                  <div style={{ flex: 1 }}>
                    <div style={css`font-size:16px;font-weight:700;color:${goal === g.v ? teal : "#3D5451"};margin-bottom:5px`}>{g.n}</div>
                    <div style={css`font-size:13px;color:#5E7370;line-height:1.7`}>{g.h}</div>
                  </div>
                  <div style={css`font-size:13px;color:#7C8F8C;font-weight:600`}>{g.tag}</div>
                </button>
              ))}
            </div>
            <div style={css`background:#F6F8F7;border:1px solid #E3EAE8;border-radius:14px;padding:22px;margin-top:20px`}>
              <div style={css`display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px`}>
                <span style={css`font-size:14.5px;font-weight:600`}>ساعت‌های بک‌آپ در قطعی برق</span>
                <span style={css`font-size:20px;font-weight:800;color:#0F5B52`}>{faNum(backupHours)} ساعت</span>
              </div>
              <input
                type="range"
                min={2}
                max={24}
                step={1}
                value={backupHours}
                onChange={(e) => setBackupHours(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#0F5B52" }}
              />
            </div>
            <div className="r-wrap" style={css`display:flex;gap:10px;margin-top:26px`}>
              <button
                onClick={() => setStep(4)}
                style={css`border:0;background:#EFA00B;color:#3A2600;padding:15px 32px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer`}
              >
                نمایش نتیجه
              </button>
              <button
                onClick={() => setStep(2)}
                style={css`border:1px solid #CBD9D6;background:#fff;padding:15px 24px;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer`}
              >
                قبلی
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div style={css`display:flex;align-items:baseline;gap:14px;margin-bottom:22px;flex-wrap:wrap`}>
              <h2 style={css`margin:0;font-size:21px;font-weight:700`}>سیستم پیشنهادی برای {city}</h2>
              <span style={css`font-size:13.5px;color:#7C8F8C`}>
                {faNum(kwh)} کیلووات‌ساعت در ماه · {GOAL_LABEL[goal]}
              </span>
              <span style={{ flex: 1 }}></span>
              <button
                onClick={() => setStep(1)}
                style={css`border:1px solid #CBD9D6;background:#fff;padding:9px 18px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer`}
              >
                محاسبه مجدد
              </button>
            </div>

            <div className="r-cards-4" style={css`display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px`}>
              {[
                { k: "تعداد پنل ۶۱۰ واتی", v: `${faNum(result.panels)} عدد`, s: `آرایه ${faDec(result.arrayKw)} کیلووات` },
                { k: "ظرفیت باتری", v: `${faNum(result.battery)} kWh`, s: "لیتیوم فسفات آهن" },
                { k: "توان اینورتر", v: `${faNum(result.inverterKw)} کیلووات`, s: goal === "saving" ? "هیبرید یا آنگرید" : "هیبرید" },
                { k: "بازگشت سرمایه", v: `${faDec(result.payback)} سال`, s: "با تعرفه فعلی" },
              ].map((r) => (
                <div key={r.k} style={css`background:#0F5B52;border-radius:16px;padding:22px;color:#fff`}>
                  <div style={css`font-size:13px;color:#A9CCC6;margin-bottom:10px`}>{r.k}</div>
                  <div style={css`font-size:27px;font-weight:800;line-height:1.2`}>{r.v}</div>
                  <div style={css`font-size:12.5px;color:#A9CCC6;margin-top:6px`}>{r.s}</div>
                </div>
              ))}
            </div>

            <div className="r-split" style={css`display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:16px`}>
              <div style={css`border:1px solid #E3EAE8;border-radius:16px;overflow:hidden`}>
                <div style={css`padding:16px 20px;background:#F6F8F7;font-size:15px;font-weight:700;border-bottom:1px solid #E3EAE8`}>
                  جزئیات فنی و اقتصادی
                </div>
                {[
                  { k: `تابش خورشید ${city}`, v: `${result.irr.toLocaleString("fa-IR")} kWh/m² در روز` },
                  { k: "تولید سالانه برق", v: `${fa(result.annualGen)} کیلووات‌ساعت` },
                  { k: "صرفه‌جویی سالانه", v: `${fa(result.annualSave)} تومان` },
                  { k: "سطح موردنیاز پشت‌بام", v: `${fa(result.roof)} متر مربع` },
                  { k: "کاهش انتشار CO₂", v: `${fa(result.co2)} کیلوگرم در سال` },
                  { k: "پوشش مصرف فعلی", v: `${faNum(coverage)}٪` },
                  { k: "مدت اجرا", v: "۳ تا ۷ روز کاری" },
                  { k: "گارانتی مجموعه", v: "۵ سال تجهیزات · ۱۰ سال پنل" },
                ].map((r) => (
                  <div key={r.k} style={css`display:flex;justify-content:space-between;gap:16px;padding:14px 20px;font-size:14px;border-bottom:1px solid #EDF2F1`}>
                    <span style={css`color:#5E7370`}>{r.k}</span>
                    <span style={css`font-weight:700`}>{r.v}</span>
                  </div>
                ))}
              </div>

              <div style={css`display:grid;gap:12px;align-content:start`}>
                <div style={css`background:#E8F2F0;border:1px solid #CDE2DE;border-radius:16px;padding:22px`}>
                  <div style={css`font-size:13px;color:#3D5451;margin-bottom:8px`}>هزینه تخمینی کل با نصب</div>
                  <div style={css`font-size:26px;font-weight:800;color:#0A3F39`}>{fa(result.cost)}</div>
                  <div style={css`font-size:12.5px;color:#5E7370;margin-top:6px`}>تومان · تخمین ±۱۵٪</div>
                  <button
                    onClick={addPackage}
                    disabled={pending}
                    style={css`margin-top:18px;border:0;background:#0F5B52;color:#fff;padding:14px;border-radius:11px;font-size:14.5px;font-weight:700;cursor:pointer;width:100%;opacity:${pending ? "0.6" : "1"}`}
                  >
                    افزودن پکیج به سبد خرید
                  </button>
                  <a
                    href="/consult"
                    style={css`margin-top:8px;border:1px solid #0F5B52;background:transparent;color:#0F5B52;padding:13px;border-radius:11px;font-size:14px;font-weight:600;cursor:pointer;width:100%;display:block;text-align:center;text-decoration:none`}
                  >
                    بررسی توسط کارشناس
                  </a>
                </div>
                <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:16px;padding:20px`}>
                  <div style={css`font-size:14px;font-weight:700;margin-bottom:10px`}>فروش برق مازاد به شبکه</div>
                  {result.surplus > 0 ? (
                    <div style={css`font-size:13px;line-height:1.9;color:#5E7370;text-wrap:pretty`}>
                      با قرارداد خرید تضمینی، برق تولیدی مازاد شما خریداری می‌شود. برای این سیستم حدود {fa(result.surplus)}{" "}
                      کیلووات‌ساعت در سال قابل فروش است.
                    </div>
                  ) : (
                    <div style={css`font-size:13px;line-height:1.9;color:#5E7370;text-wrap:pretty`}>
                      این سیستم {faNum(coverage)}٪ از مصرف شما را پوشش می‌دهد و مازادی برای فروش باقی نمی‌گذارد. با افزودن
                      پنل می‌توانید به قرارداد خرید تضمینی برق برسید.
                    </div>
                  )}
                </div>
                <div style={css`font-size:12px;color:#93A5A2;line-height:1.8;padding:0 4px`}>
                  اعداد بر پایه میانگین تابش شهر، بازده ۷۸٪ سیستم و تعرفه {faNum(TARIFF)} تومان بر کیلووات‌ساعت محاسبه شده و
                  تخمینی است.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
