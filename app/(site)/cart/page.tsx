import Image from "next/image";
import Link from "next/link";
import { css } from "@/lib/css";
import { fa, faNum } from "@/lib/format";
import { getCartWithItems } from "@/lib/cart";
import { incCartAction, decCartAction, removeCartAction } from "@/app/actions";
import CheckoutForm from "@/components/CheckoutForm";

const VAT_RATE = 0.09;
const FREE_SHIPPING_OVER = 500_000_000;
const SHIPPING_FLAT = 4_500_000;

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ ordered?: string }>;
}) {
  const { ordered } = await searchParams;

  if (ordered) {
    return (
      <div style={css`max-width:1180px;margin:0 auto;padding:30px 24px 64px`}>
        <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:20px;padding:64px;text-align:center;max-width:620px;margin:0 auto`}>
          <div style={css`width:64px;height:64px;border-radius:50%;background:#E8F2F0;color:#0F5B52;font-size:30px;display:flex;align-items:center;justify-content:center;margin:0 auto 22px`}>
            ✓
          </div>
          <h1 style={css`margin:0 0 12px;font-size:25px;font-weight:800`}>سفارش شما ثبت شد</h1>
          <p style={css`margin:0 0 28px;font-size:15px;line-height:1.9;color:#5E7370`}>
            شماره پیگیری <span style={css`font-weight:700;color:#0F5B52`}>{ordered}</span>. کارشناس فنی تا ۲۴ ساعت آینده
            برای هماهنگی بازدید و نصب تماس می‌گیرد.
          </p>
          <Link
            href="/shop"
            style={css`border:0;background:#0F5B52;color:#fff;padding:14px 28px;border-radius:11px;font-size:15px;font-weight:700;cursor:pointer;display:inline-block`}
          >
            ادامه خرید
          </Link>
        </div>
      </div>
    );
  }

  const cart = await getCartWithItems();
  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div style={css`max-width:1180px;margin:0 auto;padding:30px 24px 64px`}>
        <div style={css`background:#fff;border:1px dashed #CBD9D6;border-radius:20px;padding:64px;text-align:center;max-width:620px;margin:0 auto`}>
          <h1 style={css`margin:0 0 10px;font-size:23px;font-weight:800`}>سبد خرید خالی است</h1>
          <p style={css`margin:0 0 26px;font-size:14.5px;color:#5E7370`}>اگر نمی‌دانید چه چیزی لازم دارید، از ماشین‌حساب انرژی شروع کنید.</p>
          <div style={css`display:flex;gap:10px;justify-content:center`}>
            <Link
              href="/shop"
              style={css`border:0;background:#0F5B52;color:#fff;padding:13px 26px;border-radius:11px;font-size:14.5px;font-weight:700;cursor:pointer`}
            >
              رفتن به فروشگاه
            </Link>
            <Link
              href="/calculator"
              style={css`border:1px solid #CBD9D6;background:#fff;padding:13px 24px;border-radius:11px;font-size:14.5px;font-weight:600;cursor:pointer`}
            >
              محاسبه سیستم
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  const vat = Math.round(subtotal * VAT_RATE);
  const shipping = subtotal > FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
  const grandTotal = subtotal + vat + shipping;

  return (
    <div style={css`max-width:1180px;margin:0 auto;padding:30px 24px 64px`}>
      <h1 style={css`margin:0 0 22px;font-size:27px;font-weight:800`}>سبد خرید و تسویه</h1>
      <div style={css`display:grid;gap:16px;margin-bottom:16px`}>
        <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:18px;overflow:hidden`}>
          {items.map((it) => (
            <div
              key={it.id}
              style={css`display:grid;grid-template-columns:96px minmax(0,1fr) auto;gap:16px;padding:18px;border-bottom:1px solid #EDF2F1;align-items:center`}
            >
              <div style={css`height:76px;background:#F0F4F3;border-radius:10px;overflow:hidden;position:relative`}>
                <Image src={it.product.image} alt={it.product.name} fill style={{ objectFit: "cover" }} sizes="96px" />
              </div>
              <div>
                <div style={css`font-size:14.5px;font-weight:600;line-height:1.6;margin-bottom:6px`}>{it.product.name}</div>
                <div style={css`font-size:12.5px;color:#7C8F8C`}>
                  {it.product.brand} · {it.product.power}
                </div>
                <form action={removeCartAction}>
                  <input type="hidden" name="productId" value={it.productId} />
                  <button type="submit" style={css`border:0;background:transparent;color:#B4453A;font-size:12.5px;cursor:pointer;padding:6px 0 0`}>
                    حذف
                  </button>
                </form>
              </div>
              <div style={css`display:flex;align-items:center;gap:18px`}>
                <div style={css`display:flex;align-items:center;border:1px solid #CBD9D6;border-radius:9px`}>
                  <form action={decCartAction}>
                    <input type="hidden" name="productId" value={it.productId} />
                    <button type="submit" style={css`border:0;background:transparent;padding:8px 13px;font-size:16px;cursor:pointer;color:#0F5B52`}>
                      −
                    </button>
                  </form>
                  <span style={css`min-width:28px;text-align:center;font-size:14px;font-weight:600`}>{faNum(it.quantity)}</span>
                  <form action={incCartAction}>
                    <input type="hidden" name="productId" value={it.productId} />
                    <button type="submit" style={css`border:0;background:transparent;padding:8px 13px;font-size:16px;cursor:pointer;color:#0F5B52`}>
                      +
                    </button>
                  </form>
                </div>
                <div style={css`min-width:130px;text-align:left;font-size:15.5px;font-weight:700;color:#0F5B52`}>
                  {fa(it.product.price * it.quantity)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CheckoutForm subtotal={subtotal} vat={vat} shipping={shipping} grandTotal={grandTotal} />
    </div>
  );
}
