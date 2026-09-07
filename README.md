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
- **Enquiry inbox** (`/admin/leads`): every consult/quote submission, newest
  first, showing the product the enquiry came from when it started at a
  product page's استعلام button. Each one can be marked handled or deleted,
  and the nav badge counts the unhandled ones.
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

## Deploying (Vercel)

1. Import the repo into Vercel.
2. Under Project Settings → Environment Variables, set `DATABASE_URL`,
   `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, and `SESSION_SECRET`. Paste the
   bcrypt hash **raw/unescaped** here — the `\$` escaping in `.env.example`
   is only needed for a local `.env` file (see the comment there for why).
3. `DATABASE_URL` needs to point at a real reachable Postgres (Supabase, Neon,
   Railway, RDS, ...) — the throwaway `npx prisma dev` database only exists on
   your machine. If your provider fronts Postgres with PgBouncer (or another
   pooler) in transaction mode, append `&pgbouncer=true` to the connection
   string or Prisma queries will intermittently fail with "prepared statement
   already exists".
4. Before or after the first deploy, apply the schema and seed the catalog
   against that database from your machine (Vercel doesn't run migrations for
   you):
   ```bash
   DATABASE_URL="<your production URL>" npx prisma migrate deploy
   DATABASE_URL="<your production URL>" npm run seed
   ```
5. `npm install`'s `postinstall` script runs `prisma generate` automatically,
   so the build doesn't need any extra Vercel configuration beyond the env
   vars above.

### No machine with Node.js + DB access available?

If you can't run step 4's commands from anywhere (e.g. your only network
access to the database is through the deployed app itself), there's a
fallback: `GET /api/bootstrap` (`app/api/bootstrap/route.ts`). It creates the
schema and seeds the catalog using Prisma Client at runtime — no CLI, no
local Node.js — so it works from inside a Vercel serverless function, which
does have network access to your database even when your own machine or
dev environment doesn't.

1. Add a `BOOTSTRAP_SECRET` env var in Vercel (any long random string) and
   redeploy (or wait for the next deploy to pick it up).
2. Visit `https://<your-deployment>/api/bootstrap?secret=<that value>` in a
   browser once.
3. You should get back `{"ok":true,"message":"Schema created/verified and
   12 products seeded...`. If you get `{"error":"not found"}`, the secret
   didn't match or the env var isn't set yet on that deployment.
4. Remove the `BOOTSTRAP_SECRET` env var afterward — the route always 404s
   without it, so removing it disables the endpoint.

It's safe to hit more than once (every statement is idempotent), and it
also records the migration in `_prisma_migrations` so a later `prisma
migrate deploy` from a real machine won't conflict with it.

## Admin panel

Visit `/admin`, log in with the username/password you configured
(`ADMIN_USERNAME` / the plaintext password matching `ADMIN_PASSWORD_HASH`),
and you can add, edit, or delete products, and toggle stock status.

## Project structure

- `app/(site)/` — public storefront pages (home, shop, product, compare,
  calculator, cart, consult, blog), wrapped in `app/(site)/layout.tsx`
  (header/footer/compare tray).
- `app/admin/` — admin login, product management, and the enquiry inbox at
  `app/admin/leads/`, wrapped in its own minimal `app/admin/layout.tsx`.
- `app/actions.ts` — storefront server actions (cart, checkout, consult
  form).
- `app/admin/actions.ts` — admin server actions (login/logout, product CRUD,
  marking enquiries handled).
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
