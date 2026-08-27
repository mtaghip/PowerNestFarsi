import { css } from "@/lib/css";
import { CATEGORIES } from "@/lib/categories";
import type { Product } from "@/app/generated/prisma/client";

const PRODUCT_IMAGES = [
  "/img/prod-inv-hybrid.png",
  "/img/prod-inv-3ph.png",
  "/img/prod-bat-wall.png",
  "/img/prod-bat-rack.png",
  "/img/prod-bat-ind.png",
  "/img/prod-pkg-home.png",
  "/img/prod-pkg-ind.png",
  "/img/prod-wind.png",
  "/img/prod-ev.png",
  "/img/prod-heater.png",
  "/img/prod-pump.png",
  "/img/prod-camp.png",
];

const inputStyle = css`border:1px solid #E3EAE8;border-radius:10px;padding:12px 14px;font-size:14px;outline:none;background:#F9FBFA;width:100%`;
const labelStyle = css`font-size:13px;font-weight:600;color:#3D5451;margin-bottom:6px;display:block`;

export default function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  product?: Product;
  submitLabel: string;
}) {
  return (
    <form action={action} style={css`display:grid;gap:16px;max-width:760px`}>
      {product && <input type="hidden" name="id" value={product.id} />}

      <div style={css`display:grid;grid-template-columns:1fr 1fr;gap:14px`}>
        <div>
          <label style={labelStyle}>نام محصول</label>
          <input name="name" required defaultValue={product?.name} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>اسلاگ (شناسه یکتای انگلیسی)</label>
          <input name="slug" required defaultValue={product?.slug} pattern="[a-z0-9\-]+" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>برند</label>
          <input name="brand" required defaultValue={product?.brand} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>دسته‌بندی</label>
          <select name="category" required defaultValue={product?.category ?? CATEGORIES[0].name} style={inputStyle}>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>قیمت (تومان)</label>
          <input name="price" type="number" min={0} step={1000} required defaultValue={product?.price} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>امتیاز (۱ تا ۵)</label>
          <input name="rating" type="number" min={1} max={5} defaultValue={product?.rating ?? 5} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>توان / ظرفیت</label>
          <input name="power" required defaultValue={product?.power} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>ولتاژ کاری</label>
          <input name="voltage" required defaultValue={product?.voltage} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>گارانتی</label>
          <input name="warranty" required defaultValue={product?.warranty} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>ویژگی شاخص</label>
          <input name="extra" required defaultValue={product?.extra} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>برچسب (اختیاری)</label>
          <input name="badge" defaultValue={product?.badge ?? ""} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>تصویر</label>
          <input name="image" list="product-images" defaultValue={product?.image ?? PRODUCT_IMAGES[0]} style={inputStyle} />
          <datalist id="product-images">
            {PRODUCT_IMAGES.map((src) => (
              <option key={src} value={src} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label style={labelStyle}>توضیحات</label>
        <textarea
          name="description"
          required
          defaultValue={product?.description}
          style={css`width:100%;border:1px solid #E3EAE8;border-radius:10px;padding:12px 14px;font-size:14px;outline:none;background:#F9FBFA;min-height:100px;resize:vertical`}
        />
      </div>

      <label style={css`display:flex;gap:10px;align-items:center;font-size:13.5px;cursor:pointer;color:#3D5451`}>
        <input type="checkbox" name="stock" defaultChecked={product?.stock ?? true} style={{ width: 16, height: 16, accentColor: "#0F5B52" }} />
        موجود در انبار
      </label>

      <button
        type="submit"
        style={css`border:0;background:#0F5B52;color:#fff;padding:14px 28px;border-radius:11px;font-size:15px;font-weight:700;cursor:pointer;width:fit-content`}
      >
        {submitLabel}
      </button>
    </form>
  );
}
