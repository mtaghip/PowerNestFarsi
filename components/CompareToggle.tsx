"use client";

import { useSyncExternalStore } from "react";
import { css } from "@/lib/css";
import { getCompareIds, getServerCompareIds, subscribeCompare, toggleCompare } from "@/lib/compare-client";

const teal = "#0F5B52";

export default function CompareToggle({ productId }: { productId: string }) {
  const ids = useSyncExternalStore(subscribeCompare, getCompareIds, getServerCompareIds);
  const active = ids.includes(productId);

  return (
    <button
      type="button"
      title="مقایسه"
      onClick={() => toggleCompare(productId)}
      style={css`border:1px solid ${active ? teal : "#CBD9D6"};background:${active ? "#E8F2F0" : "#fff"};color:${active ? teal : "#3D5451"};padding:12px 14px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer`}
    >
      مقایسه
    </button>
  );
}
