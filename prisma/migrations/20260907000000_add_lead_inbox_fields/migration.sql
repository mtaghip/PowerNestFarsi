-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "productSlug" TEXT;
ALTER TABLE "Lead" ADD COLUMN "handled" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Lead_handled_createdAt_idx" ON "Lead"("handled", "createdAt");
