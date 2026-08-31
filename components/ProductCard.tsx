import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { css } from "@/lib/css";
import { fa, stars } from "@/lib/format";
import { addToCartAction } from "@/app/actions";
import CompareToggle from "@/components/CompareToggle";

export default function ProductCard({
  product,
  variant = "shop",
}: {
  product: Product;
  variant?: "shop" | "featured";
}) {
  const badgeBg = product.stock ? "#EFA00B" : "#B4453A";
  const badgeColor = product.stock ? "#3A2600" : "#fff";
  const imgHeight = variant === "featured" ? 190 : 200;

  return (
    <div
      style={css`background:#fff;border:1px solid #E3EAE8;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;transition:.18s`}
    >
      <Link
        href={`/product/${product.slug}`}
        style={css`position:relative;height:${imgHeight}px;background:#F0F4F3;cursor:pointer;display:block`}
      >
        <Image src={product.image} alt={product.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 25vw" />
        {product.badge && (
          <div
            style={css`position:absolute;top:12px;right:12px;background:${badgeBg};color:${badgeColor};font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:6px;pointer-events:none`}
          >
            {product.badge}
          </div>
        )}
      </Link>
      <div style={css`padding:16px;display:flex;flex-direction:column;gap:10px;flex:1`}>
        <div style={css`font-size:12px;color:#7C8F8C`}>
          {product.brand} · {product.category}
        </div>
        <Link
          href={`/product/${product.slug}`}
          style={css`font-size:14.5px;font-weight:600;line-height:1.65;cursor:pointer;min-height:48px;color:#12211F`}
        >
          {product.name}
        </Link>

        {variant === "featured" ? (
          <div style={css`font-size:12.5px;color:#EFA00B;letter-spacing:2px`}>{stars(product.rating)}</div>
        ) : (
          <div style={css`display:flex;gap:8px;flex-wrap:wrap`}>
            <span style={css`background:#F0F4F3;color:#3D5451;font-size:11.5px;padding:4px 9px;border-radius:6px`}>
              {product.power}
            </span>
            <span style={css`background:#F0F4F3;color:#3D5451;font-size:11.5px;padding:4px 9px;border-radius:6px`}>
              گارانتی {product.warranty}
            </span>
          </div>
        )}

        <div style={css`flex:1`}></div>

        {variant === "shop" && (
          <div style={css`font-size:12.5px;font-weight:600;color:${product.stock ? "#1D7A4C" : "#B4453A"}`}>
            {product.stock ? "موجود در انبار" : "ناموجود — استعلام"}
          </div>
        )}

        <div style={css`font-size:18px;font-weight:800;color:#0F5B52`}>
          {fa(product.price)} <span style={css`font-size:12px;font-weight:500;color:#7C8F8C`}>تومان</span>
        </div>

        {variant === "featured" ? (
          <form action={addToCartAction}>
            <input type="hidden" name="productId" value={product.id} />
            <button
              type="submit"
              style={css`border:0;background:#0F5B52;color:#fff;padding:12px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;width:100%`}
            >
              افزودن به سبد خرید
            </button>
          </form>
        ) : (
          <div style={css`display:flex;gap:8px`}>
            <form action={addToCartAction} style={css`flex:1`}>
              <input type="hidden" name="productId" value={product.id} />
              <button
                type="submit"
                style={css`width:100%;border:0;background:#0F5B52;color:#fff;padding:12px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer`}
              >
                افزودن به سبد
              </button>
            </form>
            <CompareToggle productId={product.id} />
          </div>
        )}
      </div>
    </div>
  );
}
