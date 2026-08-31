import { PrismaClient } from "@prisma/client";
import { products, genericReviews } from "../lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    const existing = await prisma.review.count({ where: { productId: product.id } });
    if (existing === 0) {
      await prisma.review.createMany({
        data: genericReviews.map((r) => ({ ...r, productId: product.id })),
      });
    }
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
