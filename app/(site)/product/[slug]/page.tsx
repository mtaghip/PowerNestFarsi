import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { css } from "@/lib/css";
import { prisma } from "@/lib/prisma";
import { parseSpecs } from "@/lib/specs";
import { categoryHref } from "@/lib/categories";
import { siteUrl } from "@/lib/site-url";
import { jsonLd, tomanToRial, excerpt } from "@/lib/json-ld";
import ProductDetail from "@/components/ProductDetail";
import ProductFaq from "@/components/ProductFaq";
import { getProductFaq } from "@/lib/product-faq";

// generateMetadata and the page both need the product; cache() makes that one
// database query per request rather than two.
const getProduct = cache((slug: string) => prisma.product.findUnique({ where: { slug } }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "محصول پیدا نشد | آشیانه انرژی" };

  const description = excerpt(product.description);

  return {
    // The product name leads, so the words a buyer searches for are the first
    // thing in the search result.
    title: `${product.name} | آشیانه انرژی`,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      url: `/product/${product.slug}`,
      siteName: "آشیانه انرژی",
      locale: "fa_IR",
      type: "website",
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
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

  const base = siteUrl();
  const url = `${base}/product/${product.slug}`;
  const categoryUrl = `${base}${categoryHref(product.category)}`;

  // schema.org Product, which is what lets Google show price and availability
  // under the result. aggregateRating is deliberately absent: the product has
  // no real reviews yet, and Google treats ratings without reviews behind them
  // as spam.
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [`${base}${product.image}`],
    sku: product.slug,
    brand: { "@type": "Brand", name: product.brand },
    category: product.category,
    offers: {
      "@type": "Offer",
      url,
      price: tomanToRial(product.price),
      priceCurrency: "IRR",
      availability: product.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "آشیانه انرژی", url: base },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "فروشگاه", item: `${base}/shop` },
      { "@type": "ListItem", position: 3, name: product.category, item: categoryUrl },
      { "@type": "ListItem", position: 4, name: product.name, item: url },
    ],
  };

  const faq = getProductFaq(product.slug);

  // Google no longer shows FAQ rich results for most commercial sites, but the
  // markup is still valid, still read by other search and AI engines, and
  // costs nothing when it mirrors Q&A that is visibly on the page.
  const faqLd =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <div className="r-pad" style={css`max-width:1280px;margin:0 auto;padding:26px 24px 64px`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqLd) }} />}

      {/* Real links rather than plain text, so the trail is also a path back
          up the site for both visitors and crawlers. */}
      <nav aria-label="مسیر صفحه" style={css`font-size:13px;color:#7C8F8C;margin-bottom:18px;line-height:1.9`}>
        <Link href="/" style={css`color:#7C8F8C`}>
          خانه
        </Link>
        {" / "}
        <Link href="/shop" style={css`color:#7C8F8C`}>
          فروشگاه
        </Link>
        {" / "}
        <Link href={categoryHref(product.category)} style={css`color:#7C8F8C`}>
          {product.category}
        </Link>
        {" / "}
        <span>{product.name}</span>
      </nav>
      <ProductDetail product={product} specBase={specBase} specFull={specFull} reviews={reviews} />
      <ProductFaq items={faq} title="سؤالات متداول" />
    </div>
  );
}
