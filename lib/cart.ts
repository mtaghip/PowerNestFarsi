import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "pn_cart_id";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days

export async function getCartId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

async function ensureCart(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) {
    const cart = await prisma.cart.findUnique({ where: { id: existing } });
    if (cart) return cart.id;
  }
  const cart = await prisma.cart.create({ data: {} });
  store.set(COOKIE_NAME, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return cart.id;
}

export async function getCartWithItems() {
  const cartId = await getCartId();
  if (!cartId) return null;
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true }, orderBy: { id: "asc" } } },
  });
}

export async function addToCart(productId: string, qty: number) {
  const cartId = await ensureCart();
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId, productId } },
  });
  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + qty },
    });
  } else {
    await prisma.cartItem.create({ data: { cartId, productId, quantity: qty } });
  }
}

export async function decrementInCart(productId: string) {
  const cartId = await getCartId();
  if (!cartId) return;
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId, productId } },
  });
  if (!existing) return;
  if (existing.quantity <= 1) {
    await prisma.cartItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity - 1 } });
  }
}

export async function setQuantity(productId: string, qty: number) {
  const cartId = await getCartId();
  if (!cartId) return;
  if (qty <= 0) {
    await prisma.cartItem.deleteMany({ where: { cartId, productId } });
    return;
  }
  await prisma.cartItem.updateMany({ where: { cartId, productId }, data: { quantity: qty } });
}

export async function removeFromCart(productId: string) {
  const cartId = await getCartId();
  if (!cartId) return;
  await prisma.cartItem.deleteMany({ where: { cartId, productId } });
}

export async function clearCart() {
  const cartId = await getCartId();
  if (!cartId) return;
  await prisma.cartItem.deleteMany({ where: { cartId } });
}

export async function getCartCount(): Promise<number> {
  const cart = await getCartWithItems();
  if (!cart) return 0;
  return cart.items.reduce((sum, it) => sum + it.quantity, 0);
}
