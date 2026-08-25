# CLAUDE.md

Guidance for working in this repository.

## Project

Marketing site **and** applicant-management system for the **SETA Program** — an 8-week
instructional-design / eLearning bootcamp (Cohort 2, "SETA II"). 3 tracks, 30 seats,
₦45,000 commitment fee. The public site sells the program; the in-app flow lets applicants
apply and pay, and lets admins review payments and grant/deny admission.

## Stack

- **Next.js 16** (App Router, RSC) · **React 19** · **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (new-york style, components in `components/ui/`)
- **Postgres** via **Prisma ORM 7** (`prisma-client` generator + `@prisma/adapter-pg`).
  Default DB is **Prisma Postgres** (`db.prisma.io`); connection string in `DATABASE_URL`.
  Any Postgres works — the adapter just needs the URL. Prisma CLI reads `.env`; Next reads
  `.env.local` (keep `DATABASE_URL` in sync between them). Generated client lives in
  `lib/generated/prisma/` (git-ignored, rebuilt by `postinstall`/`prisma generate`).
- **Paystack** for payments (NGN) — inline init + webhook verification
- **Nodemailer** for transactional email (SMTP)
- Deploy target: **Vercel**

Path alias: `@/*` → repo root. `next.config.mjs` sets `typescript.ignoreBuildErrors` and
`images.unoptimized` — keep this in mind, type errors won't fail the build.

## Commands

```bash
npm run dev          # local dev
npm run build        # production build
npm run lint         # eslint
npm run db:migrate   # create/apply a migration in dev (prisma migrate dev)
npm run db:deploy    # apply migrations in prod/CI (prisma migrate deploy)
npm run db:generate  # regenerate the Prisma client
npm run db:seed      # seed/reset the admin login from ADMIN_EMAIL/ADMIN_PASSWORD
npm run db:studio    # open Prisma Studio
```

## Layout

```
app/
  page.tsx                 # public landing (composed of components/*-section.tsx)
  layout.tsx               # root layout, fonts, metadata
  apply/
    page.tsx               # application form (apply-then-pay)
    success/page.tsx       # post-payment confirmation
  admin/
    login/page.tsx         # admin password login
    page.tsx               # admin dashboard (list + manage)
  api/
    applications/route.ts       # POST: create application + init Paystack
    paystack/
      callback/route.ts         # GET: Paystack redirect -> verify -> success
      webhook/route.ts          # POST: Paystack webhook (source of truth)
    admin/
      login/route.ts            # POST/DELETE: set/clear admin session cookie
      applications/[id]/route.ts# PATCH: update admission status
components/          # landing sections + shared UI (ui/ = shadcn)
lib/
  prisma.ts         # PrismaClient singleton (pg driver adapter)
  generated/prisma/ # generated Prisma client (git-ignored)
  applications.ts   # typed data-access (Prisma queries/mutations)
  paystack.ts       # Paystack init + verify helpers
  email.ts          # nodemailer transporter + templated senders
  auth.ts           # admin session token helpers
  config.ts         # program constants (fee, tracks, currency)
prisma/
  schema.prisma     # data model (Application, Payment)
  migrations/       # migration history
prisma.config.ts    # Prisma 7 config (schema path + datasource url from env)
proxy.ts            # protects /admin/* (except /admin/login)
```

## Data model

- **applications** — one row per applicant. `payment_status` (`pending|paid|failed`) and
  `admission_status` (`pending|admitted|waitlisted|rejected`) are independent. `reference`
  is the unique Paystack transaction reference.
- **payments** — audit log of Paystack transactions (webhook + verify writes here).

`lib/applications.ts` is the only place that should query these tables (via Prisma) — keep
data access there, not in route handlers or components. To change the schema, edit
`prisma/schema.prisma` and run `npm run db:migrate`.

## Conventions

- **Money is stored in kobo** (integer). ₦45,000 = `4_500_000`. See `lib/config.ts`.
- Email sends are **best-effort**: wrap in try/catch, never let a mail failure break the
  application or payment flow.
- Payment truth comes from **Paystack verify/webhook**, never from the client. The client
  only redirects to the Paystack `authorization_url`.
- Admin auth: logins live in the **`admins` table** (email + scrypt-hashed password,
  data access in `lib/admins.ts`). A successful login sets a stateless signed cookie
  (`lib/auth.ts`, signed with `ADMIN_SESSION_SECRET`). Seed/reset the first admin from
  `ADMIN_EMAIL`/`ADMIN_PASSWORD` with `npm run db:seed`. The session cookie is a single
  shared token, not per-admin — fine for the "is an admin logged in" gate.
- New landing content = a `components/*-section.tsx` added to `app/page.tsx`.

## Environment

Copy `.env.example` → `.env.local` and fill in. Required: `DATABASE_URL`,
`PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`, SMTP creds, `ADMIN_PASSWORD`,
`ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAIL`. `DATABASE_URL` points at the
Prisma Postgres database (provisioned via `npx create-db` / the Prisma console). The Prisma
CLI reads `.env`, so keep `DATABASE_URL` identical in both `.env` and `.env.local`.
