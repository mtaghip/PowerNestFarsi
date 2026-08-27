"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { css } from "@/lib/css";
import { faNum } from "@/lib/format";

function withParam(sp: URLSearchParams, key: string, value: string | null) {
  const next = new URLSearchParams(sp.toString());
  if (value === null) next.delete(key);
  else next.set(key, value);
  return next.toString();
}

export function PriceRangeFilter({ maxPrice }: { maxPrice: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  return (
    <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:16px;padding:18px`}>
      <div style={css`font-size:15px;font-weight:700;margin-bottom:6px`}>حداکثر قیمت</div>
      <div style={css`font-size:13px;color:#5E7370;margin-bottom:14px`}>تا {faNum(maxPrice)} میلیون تومان</div>
      <input
        type="range"
        min={50}
        max={2000}
        step={50}
        defaultValue={maxPrice}
        onChange={(e) => router.replace(`${pathname}?${withParam(sp, "max", e.target.value)}`, { scroll: false })}
        style={{ width: "100%", accentColor: "#0F5B52" }}
      />
    </div>
  );
}

export function StockFilter({ onlyStock }: { onlyStock: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  return (
    <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:16px;padding:18px`}>
      <div style={css`font-size:15px;font-weight:700;margin-bottom:14px`}>وضعیت</div>
      <label style={css`display:flex;gap:10px;align-items:center;font-size:13.5px;cursor:pointer;color:#3D5451`}>
        <input
          type="checkbox"
          defaultChecked={onlyStock}
          onChange={(e) =>
            router.replace(`${pathname}?${withParam(sp, "stock", e.target.checked ? "1" : null)}`, { scroll: false })
          }
          style={{ width: 16, height: 16, accentColor: "#0F5B52" }}
        />
        فقط کالاهای موجود
      </label>
    </div>
  );
}
