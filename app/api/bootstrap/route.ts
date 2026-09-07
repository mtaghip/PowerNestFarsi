import fs from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { products, genericReviews, REAL_PRODUCT_SLUG, RENAMED_FROM } from "@/lib/seed-data";

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

const SPECS_MIGRATION_NAME = "20260906000000_add_product_specs";
const SPECS_MIGRATION_CHECKSUM = "b3028a0bacc619b06cf9dbd503e0f67b854e2900bed035b0adc0f17e16ca11d1";

const LEAD_MIGRATION_NAME = "20260907000000_add_lead_inbox_fields";
const LEAD_MIGRATION_CHECKSUM = "5bf0ec07373d14774fa3cfef06ebc852928c3b51564c430436d322b3bb026ea9";

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

  // 20260906000000_add_product_specs
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "specs" JSONB`,

  // 20260907000000_add_lead_inbox_fields
  `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "productSlug" TEXT`,
  `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "handled" BOOLEAN NOT NULL DEFAULT false`,
  `CREATE INDEX IF NOT EXISTS "Lead_handled_createdAt_idx" ON "Lead"("handled", "createdAt")`,
];

// Diagnostics, reported alongside any failure so a single request to this
// endpoint says what actually went wrong — no digging through platform logs.
// Only reachable with the BOOTSTRAP_SECRET, and it never echoes credentials.
function describeDatabaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return "NOT SET";
  try {
    const u = new URL(raw);
    return {
      protocol: u.protocol,
      host: u.host,
      database: u.pathname,
      params: u.searchParams.toString(),
      hasUser: Boolean(u.username),
      hasPassword: Boolean(u.password),
    };
  } catch {
    return "set, but could not be parsed as a URL";
  }
}

function listDir(dir: string) {
  try {
    return fs.readdirSync(dir);
  } catch (err) {
    return `unreadable (${(err as Error).message})`;
  }
}

function collectDiagnostics() {
  const cwd = process.cwd();
  return {
    cwd,
    platform: `${process.platform}/${process.arch}`,
    nodeVersion: process.version,
    databaseUrl: describeDatabaseUrl(),
    engineLocations: {
      [`${cwd}/node_modules/.prisma/client`]: listDir(`${cwd}/node_modules/.prisma/client`),
      "/var/task/node_modules/.prisma/client": listDir("/var/task/node_modules/.prisma/client"),
      [`${cwd}/.prisma/client`]: listDir(`${cwd}/.prisma/client`),
    },
  };
}

export async function GET(req: NextRequest) {
  const expected = process.env.BOOTSTRAP_SECRET;
  const provided = req.nextUrl.searchParams.get("secret");

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  if (req.nextUrl.searchParams.get("diagnose") === "1") {
    return NextResponse.json({ diagnostics: collectDiagnostics() });
  }

  try {
    return await runBootstrap();
  } catch (err) {
    const e = err as Error & { code?: string };
    return NextResponse.json(
      {
        ok: false,
        error: {
          name: e.name,
          message: e.message,
          code: e.code ?? null,
          stack: (e.stack ?? "").split("\n").slice(0, 12).join("\n"),
        },
        diagnostics: collectDiagnostics(),
      },
      { status: 500 }
    );
  }
}

async function runBootstrap() {
  for (const sql of STATEMENTS) {
    await prisma.$executeRawUnsafe(sql);
  }

  for (const [name, checksum] of [
    [MIGRATION_NAME, MIGRATION_CHECKSUM],
    [SPECS_MIGRATION_NAME, SPECS_MIGRATION_CHECKSUM],
    [LEAD_MIGRATION_NAME, LEAD_MIGRATION_CHECKSUM],
  ]) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, applied_steps_count)
       SELECT gen_random_uuid()::text, $1, now(), $2, 1
       WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE migration_name = $2)`,
      checksum,
      name
    );
  }

  // A product that was renamed keeps its row (and any orders referencing it)
  // by moving the slug across, rather than being left behind as an orphan
  // next to its replacement. No-op once it has already been renamed.
  const renamed = await prisma.product.updateMany({
    where: { slug: RENAMED_FROM.from },
    data: { slug: RENAMED_FROM.to },
  });

  let seeded = 0;
  for (const p of products) {
    // Prisma wants DbNull (not plain null) to clear a nullable Json column.
    const { specs, ...rest } = p;
    const data = { ...rest, specs: specs ?? Prisma.DbNull };

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });

    // Placeholder reviews belong only to the demo catalog entries. Attaching
    // invented testimonials to a product actually being sold would mislead
    // customers, so the real product is left with whatever genuine reviews
    // it has — none to begin with.
    if (product.slug !== REAL_PRODUCT_SLUG) {
      const existingReviews = await prisma.review.count({ where: { productId: product.id } });
      if (existingReviews === 0) {
        await prisma.review.createMany({
          data: genericReviews.map((r) => ({ ...r, productId: product.id })),
        });
      }
    } else {
      await prisma.review.deleteMany({ where: { productId: product.id } });
    }

    seeded += 1;
  }

  const inStock = await prisma.product.count({ where: { stock: true } });

  return NextResponse.json({
    ok: true,
    message: `Schema verified and ${seeded} products synced. ${inStock} in stock.${
      renamed.count > 0 ? ` Renamed ${RENAMED_FROM.from} → ${RENAMED_FROM.to}.` : ""
    } You can now remove BOOTSTRAP_SECRET.`,
  });
}
