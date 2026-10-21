import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryBySlug } from "@/lib/categories";
import ShopListing, { type ShopParams } from "@/components/ShopListing";

type Props = { params: Promise<{ category: string }>; searchParams: Promise<ShopParams> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ category: slug }, sp] = await Promise.all([params, searchParams]);
  const category = categoryBySlug(slug);
  if (!category) return { title: "دسته‌بندی پیدا نشد | آشیانه انرژی" };

  return {
    title: `خرید ${category.name} | قیمت و مشخصات | آشیانه انرژی`,
    description: `خرید ${category.name} با گارانتی رسمی، مشخصات فنی کامل و مشاوره رایگان انتخاب. ارسال به سراسر ایران.`,
    // Every filter and sort order of a category points at the category itself.
    alternates: { canonical: `/shop/${category.slug}` },
    ...(sp.q?.trim() ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ category: slug }, sp] = await Promise.all([params, searchParams]);
  const category = categoryBySlug(slug);
  if (!category) notFound();

  return <ShopListing category={category} sp={sp} />;
}
