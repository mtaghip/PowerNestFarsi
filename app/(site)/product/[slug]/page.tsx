import { notFound } from "next/navigation";
import { css } from "@/lib/css";
import { prisma } from "@/lib/prisma";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    orderBy: { createdAt: "desc" },
  });

  const specBase = [
    { k: "برند", v: product.brand },
    { k: "توان / ظرفیت", v: product.power },
    { k: "ولتاژ کاری", v: product.voltage },
    { k: "گارانتی", v: product.warranty },
    { k: "ویژگی شاخص", v: product.extra },
  ];
  const specFull = specBase.concat([
    { k: "کد کالا", v: product.slug.toUpperCase() },
    { k: "دسته‌بندی", v: product.category },
    { k: "استاندارد", v: "IEC 62109 / CE" },
    { k: "محدوده دمای کار", v: "−۲۰ تا ۶۰ درجه" },
    { k: "درجه حفاظت", v: "IP65" },
    { k: "مانیتورینگ", v: "وای‌فای و اپلیکیشن موبایل" },
    { k: "خدمات پس از فروش", v: "سراسر ایران" },
  ]);

  return (
    <div style={css`max-width:1280px;margin:0 auto;padding:26px 24px 64px`}>
      <div style={css`font-size:13px;color:#7C8F8C;margin-bottom:18px`}>
        خانه / فروشگاه / {product.category} / {product.name}
      </div>
      <ProductDetail product={product} specBase={specBase} specFull={specFull} reviews={reviews} />
    </div>
  );
}
