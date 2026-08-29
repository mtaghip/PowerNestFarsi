import "dotenv/config";
import { defineConfig } from "prisma/config";

// Note: `datasource.url` reads process.env directly (not via the `env()`
// helper from "prisma/config") on purpose. `env()` throws immediately the
// moment this config file is loaded if the variable is unset — which broke
// `prisma generate` (used by our postinstall script) on any host where
// DATABASE_URL isn't set yet at install time, even though `generate` never
// needs a live connection. Falling back to "" keeps `generate` working;
// commands that actually need the database (migrate, db push, the app
// itself) still read the real DATABASE_URL from schema.prisma's own
// `env("DATABASE_URL")` at the point they connect.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
