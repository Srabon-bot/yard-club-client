<div align="center">

# Yardclub

An industrial equipment rental marketplace connecting contractors and individuals with fleet owners across Dhaka — heavy machinery, construction tools, cinema gear, vehicles, agriculture units, and event infrastructure.

[![Live Site](https://img.shields.io/badge/Live%20Site-yardclub--client.vercel.app-a9d800?style=for-the-badge&logo=vercel&logoColor=black)](https://yardclub-client.vercel.app)
&nbsp;
[![Live API](https://img.shields.io/badge/Live%20API-yardclub--server.vercel.app-060605?style=for-the-badge&logo=express&logoColor=white)](https://yardclub-server.vercel.app)
&nbsp;
[![API Repository](https://img.shields.io/badge/API%20Repo-yard--club--server-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Srabon-bot/yard-club-server)

</div>

---

## Overview

Yardclub is a two-sided equipment rental marketplace. Fleet owners list industrial and event machinery; renters browse, reserve, and pay online. The platform unifies catalogue discovery, availability, Stripe-powered payments, and role-based dashboards (customer, owner, admin) into a single workflow.

- **Live site:** <https://yardclub-client.vercel.app>
- **Live API:** <https://yardclub-server.vercel.app>

## Key Features

- **Marketplace & catalogue** — six equipment categories with server-side search, multi-parameter filtering, sorting, and pagination.
- **Equipment details** — specs, condition grade, terms, operator details, availability calendar, booking modal.
- **Booking & payments** — automatic totals with hosted Stripe Checkout.
- **RBAC** — customer, owner, and admin workspaces enforced server-side via JWT + JWKS.
- **Owner tools** — ImgBB photo uploads, approval states, rental pipeline, earnings analytics.
- **Admin console** — user, equipment, and rental oversight plus platform analytics.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 — App Router, React Server Components, Server Actions |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix UI, Framer Motion, Recharts, Sonner, Lucide |
| Language | TypeScript — strict type-checking |
| Auth | Better Auth (email/password, Google) + JWT plugin; MongoDB adapter; `jose` JWKS verification |
| Database | MongoDB Atlas — native driver & aggregations |
| Payments | Stripe — hosted Checkout Sessions + webhooks |
| Hosting | Vercel |

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Assignment Demo Account

- **Email:** `admin@yardclub.test`
- **Password:** `Admin@123`

---

## Authentication & Security

Better Auth mints short-lived JWTs validated by the Express API against the client's JWKS endpoint (`${BETTER_AUTH_URL}/api/auth/jwks`), with server-side route guards that redirect unauthenticated users to `/login?next=…` and unauthorized roles to their dashboards.
