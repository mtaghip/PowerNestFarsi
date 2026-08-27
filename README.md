# آشیانه انرژی — Power Nest Energy

Persian (RTL) e-commerce storefront for renewable-energy equipment — inverters,
lithium batteries, complete solar packages, wind turbines, EV chargers, solar
water heaters, and solar water pumps. Built with Next.js (App Router),
Prisma + Postgres, and a small admin panel for managing the catalog.

This is a real implementation of a design produced in Claude Design (see the
original prototype's `Ashianeh Energy.dc.html` if you have it) — same visual
design, layout, brand colors, and copy, but with a real database, cart,
checkout, and admin CRUD instead of the prototype's in-memory state.

## Features

- **Storefront**: home, shop with filters (category, brand, price, stock,
  search) and sorting, product detail pages, side-by-side comparison,
  cart & checkout, a 3-step solar sizing/ROI calculator, a consult/quote lead
  form, and a blog listing.
- **Admin panel** (`/admin`): add, edit, and delete products; change price,
  availability, and description. Protected by a single admin login.
- **Data**: Postgres via Prisma. Products, reviews, carts, orders, and
  consult leads are all persisted.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values (see comments in that
   file for how to generate `ADMIN_PASSWORD_HASH` and `SESSION_SECRET`, and
   the `$`-escaping gotcha for bcrypt hashes in `.env` files).

   For local development without a real Postgres instance, Prisma can run one
   for you:

   ```bash
   npx prisma dev
   ```

   Paste the `DATABASE_URL` it prints into your `.env`.

3. Apply the schema and seed the catalog:

   ```bash
   npx prisma migrate dev
   npm run seed
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Admin panel

Visit `/admin`, log in with the username/password you configured
(`ADMIN_USERNAME` / the plaintext password matching `ADMIN_PASSWORD_HASH`),
and you can add, edit, or delete products, and toggle stock status.

## Project structure

- `app/(site)/` — public storefront pages (home, shop, product, compare,
  calculator, cart, consult, blog), wrapped in `app/(site)/layout.tsx`
  (header/footer/compare tray).
- `app/admin/` — admin login and product management, wrapped in its own
  minimal `app/admin/layout.tsx`.
- `app/actions.ts` — storefront server actions (cart, checkout, consult
  form).
- `app/admin/actions.ts` — admin server actions (login/logout, product CRUD).
- `lib/` — Prisma client, number/date formatting (Persian numerals), the
  solar-sizing calculator logic, cart cookie helpers, admin session signing.
- `components/` — shared UI (header, footer, product card, checkout form,
  admin product form, etc).
- `prisma/schema.prisma` — data model. `prisma/seed.ts` — seed data for the
  12-product catalog.
- `public/img/` — product/hero/blog illustrations (flat teal/amber style
  matching the brand).

## Notes

- Prices are stored as integers in Iranian Toman.
- The compare tray (up to 3 products) is client-side only (`localStorage`),
  matching the ephemeral nature of the original prototype.
- Blog posts are static content in `lib/blog.ts` (not part of the admin CRUD
  scope, which is limited to products).
- Checkout accepts a payment method choice (online gateway / installments /
  B2B) but does not integrate a real payment processor — orders are created
  with `status: "pending"`. Wire up a real gateway (e.g. Zarinpal) in
  `app/actions.ts#placeOrderAction` when you have merchant credentials.
