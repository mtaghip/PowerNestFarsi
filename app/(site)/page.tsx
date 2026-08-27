import Link from "next/link";
import Image from "next/image";
import { css } from "@/lib/css";
import { faNum } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import { posts } from "@/lib/blog";
import ProductCard from "@/components/ProductCard";

const FEATURED_SLUGS = ["pkg-3", "inv-hyb-5", "bat-5", "ev-11"];

const whyUs = [
  { no: "۰۱", t: "طراحی رایگان سیستم", d: "قبل از خرید، کارشناس ما مصرف و محل نصب را بررسی می‌کند و طرح فنی با اعداد واقعی می‌دهد." },
  { no: "۰۲", t: "واردات مستقیم", d: "کالا از نمایندگی رسمی برند تأمین می‌شود؛ سریال و گارانتی قابل استعلام است." },
  { no: "۰۳", t: "نصب توسط تیم مجاز", d: "اجرای سازه، سیم‌کشی و راه‌اندازی توسط تیم‌های دارای مجوز در ۲۸ استان." },
  { no: "۰۴", t: "پشتیبانی ده‌ساله", d: "قطعات یدکی، تعویض سریع و پایش تولید از راه دور در طول عمر سیستم." },
];

export default async function HomePage() {
  const [featured, categoryCounts] = await Promise.all([
    prisma.product.findMany({ where: { slug: { in: FEATURED_SLUGS } } }),
    prisma.product.groupBy({ by: ["category"], _count: { _all: true } }),
  ]);
  const orderedFeatured = FEATURED_SLUGS.map((slug) => featured.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );
  const countByCategory = new Map(categoryCounts.map((c) => [c.category, c._count._all]));

  return (
    <div>
      <section style={css`background:#fff;border-bottom:1px solid #E3EAE8`}>
        <div
          style={css`max-width:1280px;margin:0 auto;padding:56px 24px 60px;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:56px;align-items:center`}
        >
          <div>
            <div
              style={css`display:inline-flex;align-items:center;gap:8px;background:#E8F2F0;color:#0F5B52;border-radius:20px;padding:6px 14px;font-size:13px;font-weight:600;margin-bottom:22px`}
            >
              بازار آزاد انرژی · واردات مستقیم از ۹ برند
            </div>
            <h1 style={css`margin:0 0 18px;font-size:47px;line-height:1.28;font-weight:800;letter-spacing:-.5px;text-wrap:pretty`}>
              برق خودت را بساز،
              <br />
              از خورشید و باد.
            </h1>
            <p style={css`margin:0 0 28px;font-size:17.5px;line-height:1.85;color:#4C6360;max-width:520px;text-wrap:pretty`}>
              پنل، اینورتر، باتری لیتیوم و پکیج کامل — با طراحی رایگان سیستم، نصب توسط تیم مجاز و گارانتی تعویض. برای
              خانه، کارخانه و پیمانکاران.
            </p>
            <div style={css`display:flex;gap:12px;margin-bottom:34px`}>
              <Link
                href="/calculator"
                style={css`border:0;background:#0F5B52;color:#fff;padding:16px 30px;border-radius:12px;font-size:15.5px;font-weight:700;cursor:pointer`}
              >
                سیستم موردنیازم را حساب کن
              </Link>
              <Link
                href="/shop"
                style={css`border:1px solid #CBD9D6;background:#fff;color:#12211F;padding:16px 26px;border-radius:12px;font-size:15.5px;font-weight:600;cursor:pointer`}
              >
                ورود به فروشگاه
              </Link>
            </div>
            <div
              style={css`display:grid;grid-template-columns:repeat(3,auto);gap:34px;justify-content:start;border-top:1px solid #EDF2F1;padding-top:24px`}
            >
              <div>
                <div style={css`font-size:25px;font-weight:800;color:#0F5B52`}>۴٬۳۰۰+</div>
                <div style={css`font-size:13px;color:#7C8F8C;margin-top:3px`}>سیستم نصب‌شده</div>
              </div>
              <div>
                <div style={css`font-size:25px;font-weight:800;color:#0F5B52`}>۲۸ استان</div>
                <div style={css`font-size:13px;color:#7C8F8C;margin-top:3px`}>پوشش خدمات نصب</div>
              </div>
              <div>
                <div style={css`font-size:25px;font-weight:800;color:#0F5B52`}>۱۰ سال</div>
                <div style={css`font-size:13px;color:#7C8F8C;margin-top:3px`}>گارانتی پنل‌ها</div>
              </div>
            </div>
          </div>

          <div style={css`position:relative`}>
            <div style={css`position:relative;height:420px;border-radius:20px;overflow:hidden;background:#EDF2F1;min-width:0`}>
              <Image
                src="/img/hero.png"
                alt="پنل خورشیدی روی پشت‌بام ویلا"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1024px) 100vw, 660px"
                priority
              />
            </div>
            <div
              style={css`position:absolute;bottom:-28px;right:-18px;width:296px;background:#fff;border:1px solid #E3EAE8;border-radius:16px;box-shadow:0 18px 40px rgba(12,45,41,.13);padding:18px 20px`}
            >
              <div style={css`font-size:12.5px;color:#7C8F8C;margin-bottom:12px`}>نمونه پیکربندی · پکیج خانگی</div>
              <div style={css`display:grid;gap:9px;font-size:13.5px`}>
                <div style={css`display:flex;justify-content:space-between;gap:12px`}>
                  <span style={css`color:#5E7370`}>پنل ۶۱۰ واتی</span>
                  <span style={css`font-weight:600`}>۸ عدد</span>
                </div>
                <div style={css`display:flex;justify-content:space-between;gap:12px`}>
                  <span style={css`color:#5E7370`}>اینورتر هیبرید</span>
                  <span style={css`font-weight:600`}>۵ کیلووات</span>
                </div>
                <div style={css`display:flex;justify-content:space-between;gap:12px`}>
                  <span style={css`color:#5E7370`}>باتری لیتیوم</span>
                  <span style={css`font-weight:600`}>۱۰ کیلووات‌ساعت</span>
                </div>
                <div style={css`display:flex;justify-content:space-between;gap:12px;border-top:1px solid #EDF2F1;padding-top:9px`}>
                  <span style={css`color:#5E7370`}>تولید سالانه</span>
                  <span style={css`font-weight:600;color:#0F5B52`}>۷٬۸۰۰ kWh</span>
                </div>
                <div style={css`display:flex;justify-content:space-between;gap:12px`}>
                  <span style={css`color:#5E7370`}>بازگشت سرمایه</span>
                  <span style={css`font-weight:700;color:#0F5B52`}>۳.۹ سال</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={css`max-width:1280px;margin:0 auto;padding:44px 24px 8px`}>
        <div style={css`display:flex;align-items:baseline;gap:14px;margin-bottom:18px`}>
          <h2 style={css`margin:0;font-size:23px;font-weight:700`}>خرید بر اساس دسته‌بندی</h2>
          <span style={css`font-size:14px;color:#7C8F8C`}>۷ گروه کالا، همه با گارانتی رسمی</span>
        </div>
        <div style={css`display:grid;grid-template-columns:repeat(7,1fr);gap:12px`}>
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={`/shop?cat=${encodeURIComponent(c.name)}`}
              style={css`background:#fff;border:1px solid #E3EAE8;border-radius:14px;padding:16px 14px;cursor:pointer;transition:.18s;display:block`}
            >
              <div style={css`height:74px;border-radius:10px;overflow:hidden;background:#F0F4F3;margin-bottom:12px;position:relative`}>
                <Image src={c.image} alt={c.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 33vw, 14vw" />
              </div>
              <div style={css`font-size:14px;font-weight:600;line-height:1.5;color:#12211F`}>{c.name}</div>
              <div style={css`font-size:12px;color:#7C8F8C;margin-top:4px`}>
                {faNum(countByCategory.get(c.name) ?? 0)} کالا
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={css`max-width:1280px;margin:0 auto;padding:44px 24px 0`}>
        <div
          style={css`background:#0F5B52;border-radius:22px;padding:44px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:48px;align-items:center;color:#fff`}
        >
          <div>
            <div style={css`font-size:13px;color:#EFA00B;font-weight:700;margin-bottom:14px`}>ابزار اختصاصی آشیانه</div>
            <h2 style={css`margin:0 0 14px;font-size:32px;font-weight:800;line-height:1.4`}>
              دقیقاً چند پنل و چند کیلووات‌ساعت باتری لازم دارید؟
            </h2>
            <p style={css`margin:0 0 26px;font-size:16px;line-height:1.85;color:#C9DFDB;max-width:520px;text-wrap:pretty`}>
              مصرف ماهانه و شهرتان را وارد کنید. با داده تابش خورشید هر شهر، تعداد پنل، ظرفیت باتری، توان اینورتر،
              هزینه تخمینی و سال بازگشت سرمایه را می‌گیرید — و پکیج متناسب مستقیم به سبد خرید اضافه می‌شود.
            </p>
            <Link
              href="/calculator"
              style={css`border:0;background:#EFA00B;color:#3A2600;padding:15px 28px;border-radius:12px;font-size:15.5px;font-weight:700;cursor:pointer`}
            >
              شروع محاسبه · ۴۰ ثانیه
            </Link>
          </div>
          <div style={css`display:grid;gap:12px`}>
            <div style={css`background:#0B4A43;border:1px solid #1D6259;border-radius:14px;padding:18px 20px`}>
              <div style={css`font-size:13px;color:#9FC6C0;margin-bottom:6px`}>تابش خورشید در یزد</div>
              <div style={css`font-size:22px;font-weight:700`}>۶.۰ kWh/m²/روز</div>
            </div>
            <div style={css`background:#0B4A43;border:1px solid #1D6259;border-radius:14px;padding:18px 20px`}>
              <div style={css`font-size:13px;color:#9FC6C0;margin-bottom:6px`}>میانگین بازگشت سرمایه صنعتی</div>
              <div style={css`font-size:22px;font-weight:700`}>۳.۲ تا ۴.۵ سال</div>
            </div>
            <div style={css`background:#0B4A43;border:1px solid #1D6259;border-radius:14px;padding:18px 20px`}>
              <div style={css`font-size:13px;color:#9FC6C0;margin-bottom:6px`}>خرید تضمینی برق مازاد</div>
              <div style={css`font-size:22px;font-weight:700`}>قرارداد ۲۰ ساله</div>
            </div>
          </div>
        </div>
      </section>

      <section style={css`max-width:1280px;margin:0 auto;padding:48px 24px 0`}>
        <div style={css`display:flex;align-items:baseline;gap:14px;margin-bottom:18px`}>
          <h2 style={css`margin:0;font-size:23px;font-weight:700`}>پرفروش‌ترین‌های این ماه</h2>
          <span style={css`flex:1`}></span>
          <Link href="/shop" style={css`font-size:14px;font-weight:600`}>
            مشاهده همه محصولات ←
          </Link>
        </div>
        <div style={css`display:grid;grid-template-columns:repeat(4,1fr);gap:16px`}>
          {orderedFeatured.map((p) => (
            <ProductCard key={p.id} product={p} variant="featured" />
          ))}
        </div>
      </section>

      <section style={css`max-width:1280px;margin:0 auto;padding:52px 24px 0`}>
        <div style={css`display:grid;grid-template-columns:repeat(4,1fr);gap:16px`}>
          {whyUs.map((w) => (
            <div key={w.no} style={css`background:#fff;border:1px solid #E3EAE8;border-radius:16px;padding:24px`}>
              <div style={css`font-size:13px;font-weight:700;color:#EFA00B;margin-bottom:12px`}>{w.no}</div>
              <div style={css`font-size:16px;font-weight:700;margin-bottom:9px`}>{w.t}</div>
              <div style={css`font-size:13.5px;line-height:1.85;color:#5E7370;text-wrap:pretty`}>{w.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={css`max-width:1280px;margin:0 auto;padding:52px 24px 0`}>
        <div
          style={css`background:#fff;border:1px solid #E3EAE8;border-radius:22px;overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr)`}
        >
          <div style={css`padding:44px`}>
            <div style={css`font-size:13px;font-weight:700;color:#0F5B52;margin-bottom:14px`}>همکاری تجاری</div>
            <h2 style={css`margin:0 0 14px;font-size:28px;font-weight:800;line-height:1.45`}>
              نصاب یا پیمانکار هستید؟ قیمت عمده و اعتبار خرید بگیرید
            </h2>
            <p style={css`margin:0 0 24px;font-size:15.5px;line-height:1.9;color:#5E7370;max-width:470px;text-wrap:pretty`}>
              حساب B2B با تخفیف پله‌ای از ۵ دستگاه، تسویه ۶۰ روزه، تحویل مستقیم در پروژه و پنل مدیریت سفارش برای تیم
              فروش شما.
            </p>
            <div style={css`display:grid;gap:10px;margin-bottom:26px;font-size:14px`}>
              <div style={css`display:flex;gap:10px;align-items:center;color:#3D5451`}>
                <span style={css`color:#0F5B52;font-weight:700`}>✓</span> تخفیف تا ۱۸٪ روی اینورتر و باتری
              </div>
              <div style={css`display:flex;gap:10px;align-items:center;color:#3D5451`}>
                <span style={css`color:#0F5B52;font-weight:700`}>✓</span> پیش‌فاکتور رسمی برای مناقصه
              </div>
              <div style={css`display:flex;gap:10px;align-items:center;color:#3D5451`}>
                <span style={css`color:#0F5B52;font-weight:700`}>✓</span> پشتیبانی فنی اختصاصی پروژه
              </div>
            </div>
            <Link
              href="/consult"
              style={css`border:0;background:#0F5B52;color:#fff;padding:15px 28px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer`}
            >
              درخواست حساب همکاری
            </Link>
          </div>
          <div style={css`position:relative;min-height:360px;background:#EDF2F1;min-width:0;overflow:hidden`}>
            <Image
              src="/img/b2b.png"
              alt="نصب سیستم خورشیدی صنعتی روی سقف کارخانه"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 1024px) 100vw, 620px"
            />
          </div>
        </div>
      </section>

      <section style={css`max-width:1280px;margin:0 auto;padding:52px 24px 64px`}>
        <div style={css`display:flex;align-items:baseline;gap:14px;margin-bottom:18px`}>
          <h2 style={css`margin:0;font-size:23px;font-weight:700`}>راهنما و آموزش</h2>
          <span style={css`flex:1`}></span>
          <Link href="/blog" style={css`font-size:14px;font-weight:600`}>
            همه مقالات ←
          </Link>
        </div>
        <div style={css`display:grid;grid-template-columns:repeat(3,1fr);gap:16px`}>
          {posts.slice(0, 3).map((b) => (
            <Link
              key={b.id}
              href="/blog"
              style={css`background:#fff;border:1px solid #E3EAE8;border-radius:16px;overflow:hidden;cursor:pointer;display:block`}
            >
              <div style={css`height:170px;background:#F0F4F3;position:relative`}>
                <Image src={b.image} alt={b.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div style={css`padding:18px`}>
                <div style={css`font-size:12px;color:#7C8F8C;margin-bottom:9px`}>
                  {b.cat} · {b.read}
                </div>
                <div style={css`font-size:16px;font-weight:700;line-height:1.6;margin-bottom:9px;color:#12211F`}>
                  {b.title}
                </div>
                <div style={css`font-size:13.5px;line-height:1.85;color:#5E7370;text-wrap:pretty`}>{b.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
