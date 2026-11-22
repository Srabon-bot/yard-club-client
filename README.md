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

Heavy equipment and production rentals in Bangladesh are traditionally coordinated through scattered broker networks and fragmented phone calls — availability is unpredictable, pricing is opaque, and rental contracts lack escrow protections. Yardclub provides contractors, filmmakers, event planners, and fleet owners a verified marketplace to list machinery, reserve availability, process instant card payments with Stripe, and manage rentals through dedicated role-based dashboards.

**Live site:** [https://yardclub-client.vercel.app](https://yardclub-client.vercel.app)  
**Live API:** [https://yardclub-server.vercel.app](https://yardclub-server.vercel.app)

---

## Features

- **Industrial Equipment Catalogue:** Browse 6 major equipment categories (Construction, Photography & Cinema, Commercial Vehicles, Agriculture, Electronics & Staging, and Event Infrastructure) with live pricing.
- **Server-Side Search & Multi-Param Filtering:** Real-time search by keyword or location with category, rental duration (daily, weekly, monthly), price range sliders, availability toggles, and sorting (price low-to-high, high-to-low, newest).
- **Equipment Details & Specifications:** Inspect detailed mechanical specs, condition grades, operational terms, included operator details, and live availability calendars.
- **Instant Booking Modal & Stripe Checkout:** Select booking dates and quantities; totals are calculated automatically and redirected to hosted Stripe Checkout for payment.
- **Role-Based Access Control (RBAC):** Three role tiers (Customer, Equipment Owner, Administrator) with automated JWT token exchange and server-side layout guards (`requireRole`).
- **Customer Workspace:** Manage personal rental bookings, payment receipts, active rentals, MongoDB-backed favorites shortlist, and profile details.
- **Fleet Owner Workspace:** Add new equipment listings with ImgBB photo upload, track inventory approval statuses, manage rental requests, and view earnings analytics.
- **Administrator Console:** Platform-wide oversight: moderate equipment approvals, adjust user roles, supervise rental transactions, and track revenue charts.
- **Live Analytics Visualizations:** Monthly booking volume, gross revenue bar charts, and category distribution donut charts powered by Recharts.
- **Comparison Tray:** Interactive multi-item comparison tray cached locally to evaluate machinery side-by-side.
- **Authentication:** Email & password authentication with strict password validation (min 6 characters, uppercase + lowercase) and optional Google Social Login.
- **Responsive & Accessible Design:** High-contrast tactical design system in Archivo & Martian Mono, fully responsive across mobile, tablet, and wide desktop displays.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | ![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=flat-square&logo=nextdotjs&logoColor=white) App Router, React Server Components, Server Actions |
| UI Library | ![React](https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=black) |
| Language | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) Strict Type-Checking |
| Styling | ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) Custom `#a9d800` Lime & `#060605` Ink Palette |
| Components | ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white) ![Radix UI](https://img.shields.io/badge/Radix%20UI-5B5BD6?style=flat-square&logo=radixui&logoColor=white) |
| Authentication | ![BetterAuth](https://img.shields.io/badge/BetterAuth-6366F1?style=flat-square&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAxYTUgNSAwIDAgMC01IDV2M0g2YTIgMiAwIDAgMC0yIDJ2MTBhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjExYTIgMiAwIDAgMC0yLTJoLTFWNmE1IDUgMCAwIDAtNS01em0tMyA1YTMgMyAwIDAgMSA2IDB2M0g5VjZ6Ii8+PC9zdmc+) ![JWT](https://img.shields.io/badge/JWT-D63AFF?style=flat-square&logo=jsonwebtokens&logoColor=white) Email/Password, MongoDB Adapter, Remote JWKS |
| Database | ![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white) Aggregations & Native Driver |
| Payments | ![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white) Hosted Checkout & Webhook Handlers |
| Charts & Motion | ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square&logo=recharts&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white) |
| Icons | ![Lucide](https://img.shields.io/badge/Lucide%20React-F56565?style=flat-square&logo=lucide&logoColor=white) |
| Notifications | ![Sonner](https://img.shields.io/badge/Sonner-F59E0B?style=flat-square&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik00IDVoMTZhMiAyIDAgMCAxIDIgMnY2YTIgMiAwIDAgMS0yIDJoLTZsLTQgNHYtNEg0YTIgMiAwIDAgMS0yLTJWN2EyIDIgMCAwIDEgMi0yeiIvPjwvc3ZnPg==) |
| Hosting | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) Edge CDN & Serverless Runtime |

---

## Routes

### Public Routes

| Route | Page / Function |
|---|---|
| `/` | Landing page — Hero, featured listings, categories grid, why choose us, reviews, and how it works |
| `/equipment` | Full equipment catalogue with real-time search, multi-filters, sorting, and pagination |
| `/equipment/[id]` | Comprehensive equipment specifications, terms, hold calendar, and booking modal |
| `/compare` | Side-by-side machinery comparison tray |
| `/about` | Platform mission, fleet safety standards, and team |
| `/how-it-works` | Step-by-step rental guide for customers and equipment owners |
| `/contact` | Dispatch desk, depot locations, and inquiry form |
| `/faq` | Frequently asked questions regarding insurance, security deposits, and transport |
| `/login` | Email/password sign-in with role-aware redirection |
| `/register` | User onboarding with password strength validation |
| `/payment-success` | Stripe payment verification and booking receipt confirmation |
| `/payment-cancelled` | Booking cancellation handler with retry options |

### Customer Dashboard (`/dashboard`)

| Route | Page / Function |
|---|---|
| `/dashboard` | Customer overview — recent rentals, active bookings, quick stats |
| `/dashboard/rentals` | Comprehensive booking history with status filters (Upcoming, Active, Completed, Cancelled) |
| `/dashboard/favorites` | Saved equipment shortlist with instant booking triggers |
| `/dashboard/profile` | Personal contact details, billing address, and account preferences |

### Owner Dashboard (`/owner`)

| Route | Page / Function |
|---|---|
| `/owner` | Fleet overview — total earnings, active units on rent, fleet utilization charts |
| `/owner/add-equipment` | Multi-step machinery listing form with ImgBB image uploading |
| `/owner/equipment` | Fleet inventory manager with approval states (Approved, Pending, Rejected) |
| `/owner/rentals` | Incoming booking requests and rental fulfillment pipeline |
| `/owner/profile` | Public owner profile, yard address, and dispatch terms |

### Admin Dashboard (`/admin`)

| Route | Page / Function |
|---|---|
| `/admin` | Platform metrics — total bookings, gross volume, users, and equipment counts |
| `/admin/users` | User management table — role adjustments (Customer, Owner, Admin) and account status |
| `/admin/equipment` | Inventory moderation — approve, reject, feature, edit, or remove listings |
| `/admin/equipment/[id]/edit` | Universal listing editor regardless of ownership |
| `/admin/rentals` | Master ledger of all platform rental contracts and payment statuses |
| `/admin/profile` | Administrator account settings |

---

## Authentication & Security

Signed-in client sessions interact with Better Auth to generate short-lived JWTs, sending them to the Express API as:

```http
Authorization: Bearer <token>
```

The Express API cryptographically verifies the token against the client's public JWKS endpoint at `${BETTER_AUTH_URL}/api/auth/jwks`. Route guards in `src/app/(dashboard)/layout.tsx`, `owner/layout.tsx`, and `admin/layout.tsx` enforce role permissions server-side, redirecting unauthenticated visitors to `/login?next=...` and unauthorized roles to their respective dashboards.

---

## Assignment Demo Account

A pre-seeded demonstration account is available for assessment and review:

- **Email:** `admin@yardclub.test`
- **Password:** `Admin@123`

---

## Local Development

**Prerequisites:** Node.js 20+, a MongoDB Atlas database cluster, and optionally Google Cloud & Stripe test keys.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Configuration (`.env.local`)

```env
PORT=3000
API_URL=http://localhost:5000

BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_super_secret_32_char_random_key
BETTER_AUTH_DB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net

IMGBB_API_KEY=your_imgbb_api_key

# Optional Social Authentication
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```
