import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products, genericReviews } from "@/lib/seed-data";

// One-time production database bootstrap, meant to be hit manually from a
// browser when there's no way to run `prisma migrate deploy` / `npm run
// seed` from a machine with Node.js and network access to the database
// (e.g. deploying from an environment that can't reach the DB directly).
//
// Protected by BOOTSTRAP_SECRET so it can't be triggered by anyone else.
// Safe to call more than once — every statement is idempotent (IF NOT
// EXISTS / ON CONFLICT / duplicate_object guards) and product upserts just
// re-apply the same seed data. Once you're done, delete the BOOTSTRAP_SECRET
// env var in Vercel to disable this route (it always rejects if that env
// var isn't set), or delete this file entirely.

const MIGRATION_NAME = "20260827135612_init";
// sha256 of prisma/migrations/20260827135612_init/migration.sql — recorded
// into _prisma_migrations so a later `prisma migrate deploy` (once you do
// have Node.js somewhere) recognizes this migration as already applied
// instead of erroring on "relation already exists".
const MIGRATION_CHECKSUM = "4025def327a289427e9609e6fb8f613c9d69357d5e73af44710ee6a668114723";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "stock" BOOLEAN NOT NULL DEFAULT true,
    "badge" TEXT,
    "power" TEXT NOT NULL,
    "voltage" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "extra" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "Cart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "subtotal" INTEGER NOT NULL,
    "vat" INTEGER NOT NULL,
    "shipping" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE TABLE IF NOT EXISTS "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "city" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
  )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug")`,
  `CREATE INDEX IF NOT EXISTS "Review_productId_idx" ON "Review"("productId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "CartItem_cartId_productId_key" ON "CartItem"("cartId", "productId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Order_trackingCode_key" ON "Order"("trackingCode")`,

  `DO $$ BEGIN
    ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
    ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
];

export async function GET(req: NextRequest) {
  const expected = process.env.BOOTSTRAP_SECRET;
  const provided = req.nextUrl.searchParams.get("secret");

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  for (const sql of STATEMENTS) {
    await prisma.$executeRawUnsafe(sql);
  }

  await prisma.$executeRawUnsafe(
    `INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, applied_steps_count)
     SELECT gen_random_uuid()::text, $1, now(), $2, 1
     WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE migration_name = $2)`,
    MIGRATION_CHECKSUM,
    MIGRATION_NAME
  );

  let seeded = 0;
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    const existingReviews = await prisma.review.count({ where: { productId: product.id } });
    if (existingReviews === 0) {
      await prisma.review.createMany({
        data: genericReviews.map((r) => ({ ...r, productId: product.id })),
      });
    }
    seeded += 1;
  }

  return NextResponse.json({
    ok: true,
    message: `Schema created/verified and ${seeded} products seeded. You can now remove BOOTSTRAP_SECRET.`,
  });
}
