"use client";

import { css } from "@/lib/css";
import { deleteLeadAction } from "@/app/admin/actions";

export default function DeleteLeadButton({ id }: { id: string }) {
  return (
    <form
      action={deleteLeadAction}
      onSubmit={(e) => {
        if (!confirm("این استعلام برای همیشه حذف شود؟")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        style={css`border:0;background:transparent;color:#B4453A;font-size:13px;font-weight:600;cursor:pointer;padding:9px 4px`}
      >
        حذف
      </button>
    </form>
  );
}
