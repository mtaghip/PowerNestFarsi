import Link from "next/link";
import { css } from "@/lib/css";
import { faNum } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, type Category } from "@/lib/categories";
import ProductCard from "@/components/ProductCard";
import { PriceRangeFilter, StockFilter } from "@/components/ShopFilterControls";

const teal = "#0F5B52";
const line = "#E3EAE8";

const SORTS = [
  { v: "default", n: "پیش‌فرض" },
  { v: "cheap", n: "ارزان‌ترین" },
  { v: "exp", n: "گران‌ترین" },
  { v: "rate", n: "امتیاز" },
];

export type ShopParams = Record<string, string | undefined>;

/**
 * Builds a shop link. The category lives in the path (/shop/[slug]); every
 * other filter stays in the query string. `patch.cat` switches category: a
 * category name moves to that category's page, null goes back to the
 * all-products page, and leaving it out keeps the current one.
 */
function hrefFor(current: Category | null, sp: ShopParams, patch: Record<string, string | null>) {
  let target = current;
  if ("cat" in patch) target = patch.cat === null ? null : (CATEGORIES.find((c) => c.name === patch.cat) ?? null);

  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) if (v && k !== "cat") params.set(k, v);
  for (const [k, v] of Object.entries(patch)) {
    if (k === "cat") continue;
    if (v === null) params.delete(k);
    else params.set(k, v);
  }
  const base = target ? `/shop/${target.slug}` : "/shop";
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/** The product listing, shared by /shop and /shop/[category]. */
export default async function ShopListing({ category, sp }: { category: Category | null; sp: ShopParams }) {
  const cat = category ? category.name : "all";
  const brand = sp.brand && sp.brand !== "all" ? sp.brand : "all";
  const sort = sp.sort ?? "default";
  const maxPrice = Number(sp.max ?? 2000);
  const onlyStock = sp.stock === "1";
  const q = sp.q?.trim() ?? "";

  const [allProducts, brandGroups] = await Promise.all([
    prisma.product.findMany(),
    prisma.product.groupBy({ by: ["brand"] }),
  ]);

  const brands = brandGroups.map((b) => b.brand).sort();
  const countIn = (c: string) => allProducts.filter((p) => p.category === c).length;

  let list = allProducts.filter(
    (p) =>
      (cat === "all" || p.category === cat) &&
      (brand === "all" || p.brand === brand) &&
      (!onlyStock || p.stock) &&
      p.price <= maxPrice * 1_000_000 &&
      (!q || p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()))
  );
  if (sort === "cheap") list = list.slice().sort((a, b) => a.price - b.price);
  if (sort === "exp") list = list.slice().sort((a, b) => b.price - a.price);
  if (sort === "rate") list = list.slice().sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);

  const catLabel = cat === "all" ? "همه محصولات" : cat;

  return (
    <div className="r-pad" style={css`max-width:1280px;margin:0 auto;padding:26px 24px 64px`}>
      <nav aria-label="مسیر صفحه" style={css`font-size:13px;color:#7C8F8C;margin-bottom:18px`}>
        <Link href="/" style={css`color:#7C8F8C`}>
          خانه
        </Link>
        {" / "}
        {category ? (
          <Link href="/shop" style={css`color:#7C8F8C`}>
            فروشگاه
          </Link>
        ) : (
          "فروشگاه"
        )}
        {" / "}
        {catLabel}
      </nav>
      {category && (
        <div style={css`margin-bottom:22px`}>
          <h1 style={css`margin:0 0 10px;font-size:27px;font-weight:800`}>{category.name}</h1>
          <p style={css`margin:0;font-size:14.5px;line-height:2;color:#5E7370;max-width:820px;text-wrap:pretty`}>
            {category.intro}
          </p>
        </div>
      )}
      <div className="r-split" style={css`display:grid;grid-template-columns:288px minmax(0,1fr);gap:24px;align-items:start`}>
        <aside className="r-filters" style={css`display:grid;gap:14px`}>
          <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:16px;padding:18px`}>
            <div style={css`font-size:15px;font-weight:700;margin-bottom:14px`}>دسته‌بندی</div>
            <div style={css`display:grid;gap:2px`}>
              <Link
                href={hrefFor(category, sp, { cat: null })}
                style={css`text-align:right;border:0;background:transparent;padding:9px 10px;border-radius:8px;font-size:13.5px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:${cat === "all" ? teal : "#3D5451"};font-weight:${cat === "all" ? "700" : "500"}`}
              >
                <span>همه محصولات</span>
                <span style={css`font-size:12px;color:#93A5A2`}>{faNum(allProducts.length)}</span>
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.name}
                  href={hrefFor(category, sp, { cat: c.name })}
                  style={css`text-align:right;border:0;background:transparent;padding:9px 10px;border-radius:8px;font-size:13.5px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:${cat === c.name ? teal : "#3D5451"};font-weight:${cat === c.name ? "700" : "500"}`}
                >
                  <span>{c.name}</span>
                  <span style={css`font-size:12px;color:#93A5A2`}>{faNum(countIn(c.name))}</span>
                </Link>
              ))}
            </div>
          </div>

          <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:16px;padding:18px`}>
            <div style={css`font-size:15px;font-weight:700;margin-bottom:14px`}>برند</div>
            <div style={css`display:flex;flex-wrap:wrap;gap:8px`}>
              <Link
                href={hrefFor(category, sp, { brand: null })}
                style={css`border:1px solid ${brand === "all" ? teal : line};background:${brand === "all" ? "#E8F2F0" : "#fff"};color:${brand === "all" ? teal : "#3D5451"};padding:7px 13px;border-radius:20px;font-size:13px;cursor:pointer;font-weight:500`}
              >
                همه برندها
              </Link>
              {brands.map((b) => (
                <Link
                  key={b}
                  href={hrefFor(category, sp, { brand: b })}
                  style={css`border:1px solid ${brand === b ? teal : line};background:${brand === b ? "#E8F2F0" : "#fff"};color:${brand === b ? teal : "#3D5451"};padding:7px 13px;border-radius:20px;font-size:13px;cursor:pointer;font-weight:500`}
                >
                  {b}
                </Link>
              ))}
            </div>
          </div>

          <PriceRangeFilter maxPrice={maxPrice} />
          <StockFilter onlyStock={onlyStock} />

          <div style={css`background:#E8F2F0;border:1px solid #CDE2DE;border-radius:16px;padding:20px`}>
            <div style={css`font-size:15px;font-weight:700;margin-bottom:8px;color:#0A3F39`}>مطمئن نیستید کدام سیستم؟</div>
            <div style={css`font-size:13px;line-height:1.85;color:#3D5451;margin-bottom:14px`}>
              مصرف ماهانه‌تان را وارد کنید تا پکیج مناسب را پیشنهاد دهیم.
            </div>
            <Link
              href="/calculator"
              style={css`border:0;background:#0F5B52;color:#fff;padding:11px 18px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;width:100%;display:block;text-align:center`}
            >
              محاسبه سیستم
            </Link>
          </div>
        </aside>

        <div className="r-results">
          <div
            style={css`background:#fff;border:1px solid #E3EAE8;border-radius:16px;padding:14px 18px;display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap`}
          >
            <span style={css`font-size:13.5px;color:#5E7370`}>{faNum(list.length)} کالا</span>
            <span style={css`flex:1`}></span>
            <span style={css`font-size:13.5px;color:#5E7370`}>مرتب‌سازی:</span>
            {SORTS.map((s) => (
              <Link
                key={s.v}
                href={hrefFor(category, sp, { sort: s.v === "default" ? null : s.v })}
                style={css`border:1px solid ${sort === s.v ? teal : line};background:${sort === s.v ? "#E8F2F0" : "#fff"};color:${sort === s.v ? teal : "#3D5451"};padding:7px 14px;border-radius:9px;font-size:13px;cursor:pointer;font-weight:500`}
              >
                {s.n}
              </Link>
            ))}
          </div>

          {list.length > 0 ? (
            <div className="r-cards-3" style={css`display:grid;grid-template-columns:repeat(3,1fr);gap:16px`}>
              {list.map((p) => (
                <ProductCard key={p.id} product={p} variant="shop" />
              ))}
            </div>
          ) : (
            <div className="r-roomy" style={css`background:#fff;border:1px dashed #CBD9D6;border-radius:16px;padding:56px;text-align:center`}>
              <div style={css`font-size:17px;font-weight:700;margin-bottom:8px`}>کالایی با این فیلترها پیدا نشد</div>
              <div style={css`font-size:14px;color:#5E7370;margin-bottom:20px`}>
                سقف قیمت را بالا ببرید یا دسته‌بندی دیگری را انتخاب کنید.
              </div>
              <Link
                href="/shop"
                style={css`border:1px solid #0F5B52;background:#fff;color:#0F5B52;padding:11px 22px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer`}
              >
                حذف فیلترها
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
