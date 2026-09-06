import { Prisma, PrismaClient } from "@prisma/client";
import { products, genericReviews, REAL_PRODUCT_SLUG, RENAMED_FROM } from "../lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.updateMany({
    where: { slug: RENAMED_FROM.from },
    data: { slug: RENAMED_FROM.to },
  });

  for (const p of products) {
    // Prisma wants DbNull (not plain null) to clear a nullable Json column.
    const { specs, ...rest } = p;
    const data = { ...rest, specs: specs ?? Prisma.DbNull };

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });

    // Placeholder reviews are for demo catalog entries only — never for a
    // product actually being sold.
    if (product.slug === REAL_PRODUCT_SLUG) {
      await prisma.review.deleteMany({ where: { productId: product.id } });
      continue;
    }

    const existing = await prisma.review.count({ where: { productId: product.id } });
    if (existing === 0) {
      await prisma.review.createMany({
        data: genericReviews.map((r) => ({ ...r, productId: product.id })),
      });
    }
  }

  const inStock = await prisma.product.count({ where: { stock: true } });
  console.log(`Seeded ${products.length} products (${inStock} in stock).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
