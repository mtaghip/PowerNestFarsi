"use client";

import { css } from "@/lib/css";
import { deleteProductAction } from "@/app/admin/actions";

export default function DeleteProductButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!confirm("این محصول برای همیشه حذف شود؟")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" style={css`border:0;background:transparent;color:#B4453A;font-size:13px;font-weight:600;cursor:pointer;padding:9px 4px`}>
        حذف
      </button>
    </form>
  );
}
