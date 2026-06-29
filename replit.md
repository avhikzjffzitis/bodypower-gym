# Bodypower Gym

A premium full-stack gym website for Bodypower Gym — a modern fitness club in New Delhi. Features dark glassmorphism UI, user authentication, membership plans, multi-step booking + payment flow, user dashboard, and admin analytics dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/bodypower-gym run dev` — run the frontend (port 24808)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + wouter + framer-motion + recharts + shadcn/ui
- API: Express 5 (port 8080, served at `/api`)
- DB: PostgreSQL + Drizzle ORM (`lib/db`)
- Auth: JWT (bcrypt + jsonwebtoken), tokens in `localStorage` as `bodypower_token`
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/bodypower-gym/` — React frontend (all pages, components)
- `artifacts/api-server/` — Express API server
- `lib/db/` — Drizzle ORM schema (users, bookings, payments, login_history)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/` — Generated React Query hooks (from Orval)
- `lib/api-zod/` — Generated Zod schemas (from Orval)
- `artifacts/bodypower-gym/src/lib/auth.ts` — Auth token helpers

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed React Query hooks + Zod schemas
- JWT stored in localStorage with key `bodypower_token`; user object in `bodypower_user`
- `setAuthTokenGetter` wired in `auth.ts` so all generated hooks auto-send `Bearer` headers
- Admin route protected by `requireAdmin` middleware checking `users.role = 'admin'`
- Payment flow is simulated (no real gateway); supports UPI, credit/debit card, net banking UI

## Product

- **Home page** — hero, stats, quote, CTA
- **About page** — gym story, trainers, facilities
- **Membership page** — 3 plans (Demo free, Silver ₹1300, Premium ₹2000), fetched from API
- **Booking page** — 3-step flow: Personal Info → Payment → Confirmation
- **Login / Register** — JWT auth, stored in localStorage, auto-redirects on role
- **User Dashboard** — bookings, membership status, payment history, stats
- **Settings page** — update profile, change password
- **Admin Login** — `/admin` restricted page
- **Admin Dashboard** — analytics charts (revenue by month, bookings by type), user/booking/payment tables with delete

## Test Credentials

- **Admin:** admin@bodypowergym.com / admin@bodypower123
- **User:** rahul@example.com / admin@bodypower123

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- bcrypt requires `onlyBuiltDependencies` entry in `pnpm-workspace.yaml` to build native addon
- `@workspace/api-client-react` needs `./custom-fetch` in its `exports` field for the auth token getter
- Wouter's `<Link>` already renders an `<a>` — never wrap with `<a>` directly; pass className directly to `<Link>`
- The shared proxy routes `/api/*` to the API server and `/` to the frontend
- Always use `localhost:80/api/...` for curl testing (not the raw port 8080)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
