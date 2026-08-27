"use server";

import { randomInt } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { addToCart, decrementInCart, removeFromCart, getCartWithItems, clearCart } from "@/lib/cart";

const VAT_RATE = 0.09;
const FREE_SHIPPING_OVER = 500_000_000;
const SHIPPING_FLAT = 4_500_000;

export async function addToCartAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const qty = Number(formData.get("qty") ?? 1) || 1;
  if (!productId) return;
  await addToCart(productId, qty);
  revalidatePath("/", "layout");
}

export async function incCartAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;
  await addToCart(productId, 1);
  revalidatePath("/", "layout");
}

export async function decCartAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;
  await decrementInCart(productId);
  revalidatePath("/", "layout");
}

export async function removeCartAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;
  await removeFromCart(productId);
  revalidatePath("/", "layout");
}

export async function addPackageAction(formData: FormData) {
  const productSlug = String(formData.get("productSlug") ?? "");
  const product = await prisma.product.findUnique({ where: { slug: productSlug } });
  if (product) {
    await addToCart(product.id, 1);
  }
  revalidatePath("/", "layout");
  redirect("/cart");
}

function trackingCode(): string {
  return `AN-${randomInt(10000, 99999)}`;
}

export async function placeOrderAction(formData: FormData) {
  const cart = await getCartWithItems();
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const name = String(formData.get("name") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const province = String(formData.get("province") ?? "");
  const postalCode = String(formData.get("postalCode") ?? "");
  const address = String(formData.get("address") ?? "");
  const paymentMethod = String(formData.get("paymentMethod") ?? "gateway");

  const subtotal = cart.items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  const vat = Math.round(subtotal * VAT_RATE);
  const shipping = subtotal === 0 || subtotal > FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
  const total = subtotal + vat + shipping;

  const order = await prisma.order.create({
    data: {
      trackingCode: trackingCode(),
      name,
      phone,
      province,
      postalCode,
      address,
      paymentMethod,
      status: "pending",
      subtotal,
      vat,
      shipping,
      total,
      items: {
        create: cart.items.map((it) => ({
          productId: it.productId,
          name: it.product.name,
          price: it.product.price,
          quantity: it.quantity,
        })),
      },
    },
  });

  await clearCart();
  revalidatePath("/", "layout");
  redirect(`/cart?ordered=${order.trackingCode}`);
}

export async function submitConsultAction(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const company = String(formData.get("company") ?? "") || null;
  const city = String(formData.get("city") ?? "");
  const projectType = String(formData.get("projectType") ?? "خانگی");
  const message = String(formData.get("message") ?? "");

  await prisma.lead.create({
    data: { name, phone, company, city, projectType, message },
  });

  redirect("/consult?sent=1");
}
