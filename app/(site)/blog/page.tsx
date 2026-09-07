import Image from "next/image";
import { css } from "@/lib/css";
import { posts } from "@/lib/blog";

export default function BlogPage() {
  return (
    <div className="r-pad" style={css`max-width:1080px;margin:0 auto;padding:34px 24px 64px`}>
      <h1 style={css`margin:0 0 10px;font-size:29px;font-weight:800`}>آموزش و وبلاگ</h1>
      <p style={css`margin:0 0 26px;font-size:15px;color:#5E7370`}>راهنمای انتخاب، نصب و نگهداری سیستم‌های انرژی تجدیدپذیر.</p>
      <div style={css`display:grid;gap:16px`}>
        {posts.map((b) => (
          <div
            key={b.id}
            className="r-split"
            style={css`background:#fff;border:1px solid #E3EAE8;border-radius:18px;overflow:hidden;display:grid;grid-template-columns:300px minmax(0,1fr)`}
          >
            <div style={css`min-height:190px;background:#F0F4F3;position:relative`}>
              <Image src={b.image} alt={b.title} fill style={{ objectFit: "cover" }} sizes="300px" />
            </div>
            <div className="r-roomy" style={css`padding:26px`}>
              <div style={css`font-size:12.5px;color:#7C8F8C;margin-bottom:10px`}>
                {b.cat} · {b.read} · {b.date}
              </div>
              <div style={css`font-size:19px;font-weight:700;line-height:1.6;margin-bottom:10px`}>{b.title}</div>
              <div style={css`font-size:14px;line-height:1.95;color:#5E7370;text-wrap:pretty`}>{b.desc}</div>
              <div style={css`margin-top:16px;font-size:13.5px;font-weight:600;color:#0F5B52`}>خواندن مقاله ←</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
