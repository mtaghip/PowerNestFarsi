import Link from "next/link";
import { css } from "@/lib/css";

export default function Footer() {
  return (
    <footer style={css`background:#0A3F39;color:#BFD9D4;margin-top:auto`}>
      <div
        className="r-footer r-pad"
        style={css`max-width:1280px;margin:0 auto;padding:52px 24px 24px;display:grid;grid-template-columns:minmax(0,1.4fr) 1fr 1fr 1fr;gap:40px`}
      >
        <div>
          <div style={css`display:flex;align-items:center;gap:11px;margin-bottom:18px`}>
            <div
              style={css`width:38px;height:38px;border-radius:10px;background:#0F5B52;display:flex;align-items:center;justify-content:center;color:#EFA00B;font-weight:800;font-size:18px`}
            >
              آ
            </div>
            <div style={css`line-height:1.2`}>
              <div style={css`font-size:17px;font-weight:800;color:#fff`}>آشیانه انرژی</div>
              <div style={css`font-size:10.5px;letter-spacing:1.2px;color:#7FA8A2`}>POWER NEST ENERGY</div>
            </div>
          </div>
          <p style={css`margin:0 0 18px;font-size:13.5px;line-height:2;max-width:340px;text-wrap:pretty`}>
            واردات و فروش تجهیزات انرژی خورشیدی و بادی، طراحی و نصب سیستم برای خانه، صنعت و کشاورزی در سراسر ایران و
            منطقه.
          </p>
          <div style={css`display:flex;gap:8px`}>
            <input
              placeholder="ایمیل برای خبرنامه فنی"
              style={css`flex:1;border:1px solid #1D6259;background:#0F5B52;border-radius:9px;padding:11px 13px;font-size:13px;color:#fff;outline:none`}
            />
            <button
              style={css`border:0;background:#EFA00B;color:#3A2600;padding:11px 18px;border-radius:9px;font-size:13.5px;font-weight:700;cursor:pointer`}
            >
              عضویت
            </button>
          </div>
        </div>
        <div>
          <div style={css`font-size:14.5px;font-weight:700;color:#fff;margin-bottom:16px`}>دسته‌بندی‌ها</div>
          <div style={css`display:grid;gap:11px;font-size:13.5px`}>
            <Link href="/shop?cat=اینورتر" style={css`color:#BFD9D4`}>
              اینورتر
            </Link>
            <Link href="/shop?cat=باتری لیتیوم" style={css`color:#BFD9D4`}>
              باتری لیتیوم
            </Link>
            <Link href="/shop?cat=سیستم کامل" style={css`color:#BFD9D4`}>
              پکیج کامل خورشیدی
            </Link>
            <Link href="/shop?cat=توربین بادی" style={css`color:#BFD9D4`}>
              توربین بادی
            </Link>
            <Link href="/shop?cat=شارژر خودرو برقی" style={css`color:#BFD9D4`}>
              شارژر خودرو برقی
            </Link>
            <Link href="/shop?cat=آبگرمکن خورشیدی" style={css`color:#BFD9D4`}>
              پمپ و آبگرمکن خورشیدی
            </Link>
          </div>
        </div>
        <div>
          <div style={css`font-size:14.5px;font-weight:700;color:#fff;margin-bottom:16px`}>خدمات</div>
          <div style={css`display:grid;gap:11px;font-size:13.5px`}>
            <Link href="/calculator" style={css`color:#BFD9D4`}>
              ماشین‌حساب انرژی
            </Link>
            <Link href="/consult" style={css`color:#BFD9D4`}>
              مشاوره و طراحی سیستم
            </Link>
            <Link href="/consult" style={css`color:#BFD9D4`}>
              نصب و راه‌اندازی
            </Link>
            <Link href="/consult" style={css`color:#BFD9D4`}>
              فروش عمده به نصاب‌ها
            </Link>
            <Link href="/blog" style={css`color:#BFD9D4`}>
              آموزش و وبلاگ
            </Link>
            <Link href="/consult" style={css`color:#BFD9D4`}>
              خرید تضمینی برق مازاد
            </Link>
          </div>
        </div>
        <div>
          <div style={css`font-size:14.5px;font-weight:700;color:#fff;margin-bottom:16px`}>پشتیبانی</div>
          <div style={css`display:grid;gap:11px;font-size:13.5px`}>
            <span>۰۲۱-۹۱۰۰۵۵۰۰</span>
            <span>sales@ashianeh.energy</span>
            <span>تهران، خیابان مطهری، پلاک ۱۴۲</span>
            <span>شنبه تا چهارشنبه ۹ تا ۱۸</span>
          </div>
        </div>
      </div>
      <div style={css`border-top:1px solid #1D6259`}>
        <div
          className="r-wrap r-pad"
          style={css`max-width:1280px;margin:0 auto;padding:18px 24px;display:flex;gap:20px;align-items:center;font-size:12.5px`}
        >
          <span>© ۱۴۰۵ آشیانه انرژی — تمام حقوق محفوظ است.</span>
          <span className="r-wrap-spacer" style={css`flex:1`}></span>
          <span>گارانتی رسمی</span>
          <span>پرداخت امن</span>
          <span>ارسال به سراسر ایران</span>
        </div>
      </div>
    </footer>
  );
}
