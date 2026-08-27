"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { css } from "@/lib/css";
import { faNum } from "@/lib/format";
import { clearCompare, getCompareIds, getServerCompareIds, subscribeCompare } from "@/lib/compare-client";

function useCompareIds(): string[] {
  return useSyncExternalStore(subscribeCompare, getCompareIds, getServerCompareIds);
}

export default function CompareTray() {
  const router = useRouter();
  const ids = useCompareIds();

  if (ids.length === 0) return null;

  return (
    <div
      style={css`position:fixed;bottom:0;right:0;left:0;background:#0A3F39;color:#fff;z-index:50;box-shadow:0 -8px 24px rgba(10,63,57,.22)`}
    >
      <div style={css`max-width:1280px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;gap:16px`}>
        <span style={css`font-size:14px;font-weight:600`}>{faNum(ids.length)} کالا برای مقایسه انتخاب شده</span>
        <span style={css`flex:1`}></span>
        <button
          onClick={() => clearCompare()}
          style={css`border:1px solid #2A5F58;background:transparent;color:#BFD9D4;padding:10px 18px;border-radius:9px;font-size:13.5px;cursor:pointer`}
        >
          پاک کردن
        </button>
        <button
          onClick={() => router.push("/compare")}
          style={css`border:0;background:#EFA00B;color:#3A2600;padding:11px 24px;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer`}
        >
          مقایسه کن
        </button>
      </div>
    </div>
  );
}
