# Yardclub Client

**Purpose:** Next.js frontend for Yardclub, a role-based equipment rental marketplace where customers browse live listings, send booking requests, and track rentals while owners and admins manage the platform.

**Live URL:** add the deployed URL here after deployment.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Better Auth with the MongoDB adapter
- Tailwind CSS 4 and shadcn/ui (Radix primitives)
- Lucide icons, Framer Motion, Recharts, Sonner, cmdk
- date-fns and react-day-picker for booking dates

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Express API must also be running (see `../yardclub-server/README.md`).

### Environment variables

| Name | Purpose |
| --- | --- |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth to sign session data. |
| `BETTER_AUTH_URL` | Public URL of this Next.js app. |
| `BETTER_AUTH_DB_URL` | MongoDB connection string used by Better Auth. |
| `API_URL` | Base URL of the Express API. Defaults to `http://localhost:5000`. |
| `API_INTERNAL_KEY` | Shared server-only key sent to the Express API. Must match the server value. |
| `GOOGLE_CLIENT_ID` | Optional. Enables Google sign-in when paired with the secret below. |
| `GOOGLE_CLIENT_SECRET` | Optional. Enables Google sign-in when paired with the ID above. |

`API_INTERNAL_KEY` and the session bridge are server-only. The browser never receives the internal key or the `x-user-id` header.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Production build; also runs TypeScript checking. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |

## Route map

### Public

| Route | Purpose |
| --- | --- |
| `/` | Live platform counters, featured equipment, categories, and reviews. |
| `/equipment` | Server-side search, filters, sorting, availability filter, and pagination. |
| `/about`, `/how-it-works`, `/faq`, `/contact` | Marketing and support content. |
| `/owners/[id]` | Public owner profile and their approved listings. |
| `/compare` | Side-by-side comparison of saved equipment. |
| `/login`, `/register`, `/forgot-password` | Better Auth screens. The registration form keeps the admin option for the assignment demo. |

`GET /api/stats` and `GET /api/equipment/stats` drive the public counters. Featured equipment falls back to top-rated approved listings when none are flagged.

### Customer dashboard

| Route | Purpose |
| --- | --- |
| `/dashboard` | Overview, booking stats, recent rentals, and favorites. |
| `/dashboard/rentals` | Rental history with status filters, pagination, and request cancellation. |
| `/dashboard/favorites` | Saved equipment backed by the live favorites API. |
| `/dashboard/profile` | Update profile fields and password. |

### Owner dashboard

| Route | Purpose |
| --- | --- |
| `/owner` | Fleet analytics, earnings, bookings, and recent listings. |
| `/owner/add-equipment` | Create a listing; it starts as `pending`. |
| `/owner/equipment` | Filter owned listings by approval status and delete unused ones. |
| `/owner/rentals` | Confirm, start, complete, or decline rental requests for owned equipment. |
| `/owner/profile` | Update owner details shown on the public profile. |

### Admin dashboard

| Route | Purpose |
| --- | --- |
| `/admin` | Platform-wide analytics, pending approvals, and recent activity. |
| `/admin/users` | Search users and change role or account status. |
| `/admin/equipment` | Approve, reject, unlist, feature, or delete any listing. |
| `/admin/rentals` | Manage every booking and its payment status. |
| `/admin/profile` | Update the admin account. |

Private routes use `requireRole(roles, next)` from `src/lib/api.server.ts`. Signed-out visitors go to `/login?next=...`; users in the wrong role return to their own dashboard.

## How live data works

- `src/lib/api.server.ts` reads the Better Auth session and calls the Express API with `x-internal-key` and `x-user-id`. `apiPublic` is used where no session is required.
- `GET /api/equipment` is a same-origin route handler that proxies the public Express catalogue for the command palette. It requests featured, top-rated listings and returns an empty list with HTTP 503 when the API is unreachable, so the browser never needs `API_URL` and the palette still works offline.
- `src/lib/data/*` contains server-only queries for equipment, bookings, users, favorites, owners, reviews, categories, and analytics.
- `src/lib/actions/*` contains server actions for creating bookings and listings, updating profiles, saving favorites, managing bookings, and admin moderation.
- Booking totals are `pricePerDay × quantity × daysBetween(start, end)`. New requests are saved as `bookingStatus: "pending"` and `paymentStatus: "unpaid"`. Pending, upcoming, and active bookings reserve stock so overlapping requests cannot be accepted.
- Favorites are stored in MongoDB through `/api/favorites`. The compare tray stores lightweight item snapshots in `localStorage` and does not depend on mock catalogue data.
- Root error and loading boundaries live in `src/app/error.tsx` and `src/app/loading.tsx`; the catalogue has a more specific skeleton and error page.

### Cache Components

Next.js 16 Cache Components are enabled. Session-backed and live-data segments set `export const instant = false` in `src/app/(dashboard)/layout.tsx` and `src/app/(marketing)/layout.tsx`. This is the documented migration path for routes that read request-time session or API data instead of prerendering it.

### Images

Only `https://i.ibb.co` is allowed through the Next image optimizer. Other remote URLs render with `unoptimized` via `bypassImageOptimization()` in `src/lib/images.ts`.

## Scope notes

This assignment build intentionally does **not** include:

- Better Auth JWT/JWKS issuance or Express `verifyToken`/role middleware. Role checks currently use the session bridge above.
- Stripe Checkout or webhooks. Payment state is a manual admin field; customers send a request before any payment is enabled.
- ImgBB upload integration. Listing forms take a direct image URL.

These are deliberate scope decisions, not missing UI wiring.
