import Link from "next/link";
import { css } from "@/lib/css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#F6F8F7" }}>
      <div style={css`background:#0A3F39;color:#fff`}>
        <div style={css`max-width:1180px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;gap:14px`}>
          <Link href="/admin" style={css`font-size:15px;font-weight:800;color:#fff`}>
            پنل مدیریت آشیانه انرژی
          </Link>
          <span style={css`flex:1`}></span>
          <Link href="/" style={css`font-size:13px;color:#BFD9D4`}>
            بازگشت به فروشگاه ←
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
