# Cosmic Cones

A responsive storefront and collection guide for Cosmic Cones, a collectible fidget cone brand made by Gavyan Co. Visitors can browse the current and seasonal collections, but sales are not open and the site does not accept orders.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/cosmic-cones run dev` — run the Cosmic Cones storefront
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/cosmic-cones/src/App.tsx` — storefront and collection browsing
- `artifacts/cosmic-cones/src/index.css` — brand theme and responsive styling
- `artifacts/cosmic-cones/public/cosmic-hero.png` — generated hero artwork

## Architecture decisions

- The storefront is frontend-only for now. Do not add a checkout or payment flow until sales are explicitly opened.
- Product collection names, color descriptions, seasonal windows, and rarity odds come from the supplied Cosmic Cones notes; do not invent prices or product claims.

## Product

The site introduces the brand, lets visitors explore six collections and their individual cone designs, explains rarity, and clearly communicates that sales are coming soon.

## User preferences

- Use navy and yellow as Cosmic Cones' primary brand colors.
- Keep purchases disabled until the user is ready to sell.

## Gotchas

- The source odds are retained as supplied, including rounded collection totals that may not equal exactly 100%.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
