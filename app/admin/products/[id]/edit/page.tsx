import { notFound } from "next/navigation";
import { css } from "@/lib/css";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { updateProductAction } from "@/app/admin/actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div style={css`max-width:1180px;margin:0 auto;padding:30px 24px 64px`}>
      <h1 style={css`margin:0 0 22px;font-size:23px;font-weight:800`}>ویرایش محصول</h1>
      {error === "duplicate-slug" && (
        <div style={css`background:#FBEAE8;color:#B4453A;border-radius:10px;padding:12px 16px;font-size:13.5px;margin-bottom:18px`}>
          این اسلاگ قبلاً برای محصول دیگری استفاده شده — یک شناسه یکتا انتخاب کنید.
        </div>
      )}
      <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:16px;padding:28px`}>
        <ProductForm action={updateProductAction} product={product} submitLabel="ذخیره تغییرات" />
      </div>
    </div>
  );
}
