import Image from "next/image";
import { css } from "@/lib/css";
import { prisma } from "@/lib/prisma";
import { PHONE_DISPLAY, EMAIL, OFFICE_HOURS } from "@/lib/contact";
import ConsultForm from "@/components/ConsultForm";

export default async function ConsultPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; product?: string }>;
}) {
  const { sent, product: productSlug } = await searchParams;

  // Arriving from a product page's استعلام button. Look the product up rather
  // than trusting the slug in the URL, so a bad or stale link just renders the
  // ordinary form instead of naming a product that does not exist.
  const product = productSlug
    ? await prisma.product.findUnique({
        where: { slug: productSlug },
        select: { slug: true, name: true, brand: true },
      })
    : null;

  return (
    <div className="r-pad" style={css`max-width:1080px;margin:0 auto;padding:34px 24px 64px`}>
      <div className="r-split" style={css`display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:20px;align-items:start`}>
        <div className="r-roomy" style={css`background:#fff;border:1px solid #E3EAE8;border-radius:20px;padding:34px`}>
          {sent ? (
            <div style={css`text-align:center;padding:40px 0`}>
              <div style={css`width:60px;height:60px;border-radius:50%;background:#E8F2F0;color:#0F5B52;font-size:28px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px`}>
                ✓
              </div>
              <h1 style={css`margin:0 0 10px;font-size:23px;font-weight:800`}>درخواست شما دریافت شد</h1>
              <p style={css`margin:0;font-size:14.5px;line-height:1.9;color:#5E7370`}>
                کارشناس فنی تا پایان روز کاری بعد با شما تماس می‌گیرد و پیش‌فاکتور رسمی ارسال می‌شود.
              </p>
            </div>
          ) : (
            <ConsultForm product={product} />
          )}
        </div>

        <div style={css`display:grid;gap:12px`}>
          <div style={css`background:#0F5B52;border-radius:18px;padding:24px;color:#fff`}>
            <div style={css`font-size:16px;font-weight:700;margin-bottom:14px`}>تماس مستقیم</div>
            <div style={css`font-size:13.5px;line-height:2.1;color:#C9DFDB`}>
              <div>
                تلفن: <span style={css`color:#fff;font-weight:600;direction:ltr;unicode-bidi:isolate;`}>{PHONE_DISPLAY}</span>
              </div>
              <div>
                واتساپ: <span style={css`color:#fff;font-weight:600;direction:ltr;unicode-bidi:isolate;`}>{PHONE_DISPLAY}</span>
              </div>
              <div>
                ایمیل: <span style={css`color:#fff;font-weight:600`}>{EMAIL}</span>
              </div>
              <div style={css`margin-top:10px`}>{OFFICE_HOURS}</div>
            </div>
          </div>
          <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:18px;padding:24px`}>
            <div style={css`font-size:15px;font-weight:700;margin-bottom:14px`}>مسیر همکاری</div>
            <div style={css`display:grid;gap:14px;font-size:13.5px;color:#3D5451;line-height:1.75`}>
              <div style={css`display:flex;gap:12px`}>
                <span style={css`color:#EFA00B;font-weight:800`}>۱</span>تماس کارشناس و بررسی مصرف
              </div>
              <div style={css`display:flex;gap:12px`}>
                <span style={css`color:#EFA00B;font-weight:800`}>۲</span>طراحی سیستم و پیش‌فاکتور رسمی
              </div>
              <div style={css`display:flex;gap:12px`}>
                <span style={css`color:#EFA00B;font-weight:800`}>۳</span>بازدید فنی محل نصب
              </div>
              <div style={css`display:flex;gap:12px`}>
                <span style={css`color:#EFA00B;font-weight:800`}>۴</span>اجرا، راه‌اندازی و تحویل
              </div>
            </div>
          </div>
          <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:18px;overflow:hidden`}>
            <div style={css`height:170px;background:#F0F4F3;position:relative`}>
              <Image src="/img/consult.png" alt="تیم فنی در حال بازدید پروژه" fill style={{ objectFit: "cover" }} sizes="380px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
