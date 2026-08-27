"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { setAdminSession, clearAdminSession, isAdminAuthed } from "@/lib/session";

function isDuplicateSlugError(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002" && String(err.meta?.target ?? "").includes("slug")
  );
}

async function assertAdmin() {
  const ok = await isAdminAuthed();
  if (!ok) redirect("/admin/login");
}

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const expectedUsername = process.env.ADMIN_USERNAME ?? "";
  const expectedHash = process.env.ADMIN_PASSWORD_HASH ?? "";

  const validUsername = username.length > 0 && username === expectedUsername;
  const validPassword = expectedHash.length > 0 && (await bcrypt.compare(password, expectedHash));

  if (!validUsername || !validPassword) {
    redirect("/admin/login?error=1");
  }

  await setAdminSession(username);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

function readProductInput(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    brand: String(formData.get("brand") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    price: Math.max(0, Math.round(Number(formData.get("price") ?? 0))),
    rating: Math.min(5, Math.max(1, Math.round(Number(formData.get("rating") ?? 5)))),
    stock: formData.get("stock") === "on",
    badge: String(formData.get("badge") ?? "").trim() || null,
    power: String(formData.get("power") ?? "").trim(),
    voltage: String(formData.get("voltage") ?? "").trim(),
    warranty: String(formData.get("warranty") ?? "").trim(),
    extra: String(formData.get("extra") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim() || "/img/prod-pkg-home.png",
  };
}

export async function createProductAction(formData: FormData) {
  await assertAdmin();
  const data = readProductInput(formData);
  try {
    await prisma.product.create({ data });
  } catch (err) {
    if (isDuplicateSlugError(err)) redirect("/admin/products/new?error=duplicate-slug");
    throw err;
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProductAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const data = readProductInput(formData);
  try {
    await prisma.product.update({ where: { id }, data });
  } catch (err) {
    if (isDuplicateSlugError(err)) redirect(`/admin/products/${id}/edit?error=duplicate-slug`);
    throw err;
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProductAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.product.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function toggleStockAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;
  await prisma.product.update({ where: { id }, data: { stock: !product.stock } });
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}
