import Link from "next/link";
import Image from "next/image";
import { css } from "@/lib/css";
import { fa } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { toggleStockAction } from "@/app/admin/actions";
import AdminTabs from "@/components/admin/AdminTabs";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="r-pad" style={css`max-width:1180px;margin:0 auto;padding:30px 24px 64px`}>
      <AdminTabs active="products" />

      <div className="r-wrap" style={css`display:flex;align-items:center;gap:14px;margin-bottom:20px;flex-wrap:wrap`}>
        <h1 style={css`margin:0;font-size:25px;font-weight:800`}>مدیریت محصولات</h1>
        <span className="r-wrap-spacer" style={css`flex:1`}></span>
        <Link
          href="/admin/products/new"
          style={css`border:0;background:#0F5B52;color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer`}
        >
          + افزودن محصول
        </Link>
      </div>

      <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:16px;overflow:hidden`}>
        {products.map((p) => (
          <div
            key={p.id}
            className="r-row-admin"
            style={css`display:grid;grid-template-columns:56px minmax(0,1fr) 120px 110px auto;gap:16px;padding:14px 18px;border-bottom:1px solid #EDF2F1;align-items:center`}
          >
            <div style={css`width:56px;height:44px;border-radius:8px;overflow:hidden;background:#F0F4F3;position:relative`}>
              <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} sizes="56px" />
            </div>
            <div>
              <div style={css`font-size:14px;font-weight:600`}>{p.name}</div>
              <div style={css`font-size:12px;color:#7C8F8C;margin-top:3px`}>
                {p.brand} · {p.category}
              </div>
            </div>
            <div style={css`font-size:14px;font-weight:700;color:#0F5B52`}>{fa(p.price)}</div>
            <form action={toggleStockAction}>
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                style={css`border:1px solid ${p.stock ? "#CDE2DE" : "#F0C9C4"};background:${p.stock ? "#E8F2F0" : "#FBEAE8"};color:${p.stock ? "#1D7A4C" : "#B4453A"};padding:7px 12px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer`}
              >
                {p.stock ? "موجود" : "ناموجود"}
              </button>
            </form>
            <div style={css`display:flex;gap:8px`}>
              <Link
                href={`/admin/products/${p.id}/edit`}
                style={css`border:1px solid #CBD9D6;background:#fff;color:#12211F;padding:9px 16px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer`}
              >
                ویرایش
              </Link>
              <DeleteProductButton id={p.id} />
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div style={css`padding:40px;text-align:center;color:#7C8F8C;font-size:14px`}>هنوز محصولی ثبت نشده است.</div>
        )}
      </div>
    </div>
  );
}
