import { notFound } from "next/navigation";
import { css } from "@/lib/css";
import { prisma } from "@/lib/prisma";
import { parseSpecs } from "@/lib/specs";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    orderBy: { createdAt: "desc" },
  });

  // A product carrying real datasheet rows shows those. The generic rows in
  // the else-branch are placeholders inherited from the design prototype and
  // must never appear next to a real datasheet — they would contradict it
  // (e.g. claiming IP65 for a battery rated IP20).
  const datasheet = parseSpecs(product.specs);

  let specBase;
  let specFull;

  if (datasheet.length > 0) {
    specBase = [{ k: "برند", v: product.brand }, ...datasheet.slice(0, 4)];
    specFull = [
      { k: "برند", v: product.brand },
      { k: "دسته‌بندی", v: product.category },
      ...datasheet,
    ];
  } else {
    specBase = [
      { k: "برند", v: product.brand },
      { k: "توان / ظرفیت", v: product.power },
      { k: "ولتاژ کاری", v: product.voltage },
      { k: "گارانتی", v: product.warranty },
      { k: "ویژگی شاخص", v: product.extra },
    ];
    specFull = specBase.concat([
      { k: "کد کالا", v: product.slug.toUpperCase() },
      { k: "دسته‌بندی", v: product.category },
    ]);
  }

  return (
    <div style={css`max-width:1280px;margin:0 auto;padding:26px 24px 64px`}>
      <div style={css`font-size:13px;color:#7C8F8C;margin-bottom:18px`}>
        خانه / فروشگاه / {product.category} / {product.name}
      </div>
      <ProductDetail product={product} specBase={specBase} specFull={specFull} reviews={reviews} />
    </div>
  );
}
