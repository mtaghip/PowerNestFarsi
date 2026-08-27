import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids");
  if (!idsParam) return NextResponse.json([]);
  const ids = idsParam.split(",").filter(Boolean);
  if (ids.length === 0) return NextResponse.json([]);
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const ordered = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  return NextResponse.json(ordered);
}
