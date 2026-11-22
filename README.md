# Yardclub Client

**Purpose:** Next.js frontend for Yardclub, a role-based equipment rental marketplace where customers browse live listings and book equipment, owners manage their yards, and admins moderate the platform.

## Deployment status

Both projects are deployed and connected to their GitHub repositories. Pushes to `main` trigger production deployments automatically.

| Vercel project | Root directory | Runtime | Live URL |
| --- | --- | --- | --- |
| Client | `yardclub_client` | Next.js | https://yardclub-client.vercel.app |
| API | `yardclub-server` | Express via `api/index.ts` + `vercel.json` rewrites | https://yardclub-server.vercel.app |

These are the canonical origins used by the environment variables below. Do not substitute preview deployment URLs.

### Assignment-demo admin (not a production feature)

A seeded account exists **only in the shared assignment database** so reviewers can inspect the admin dashboard:

- Email: `admin@yardclub.test`
- Password: `Admin@123`

This is an **assignment-demo-only credential**, not a supported production feature and not a registration path. Public signup always creates a `customer` account. In any non-demo deployment, remove or rotate this account and grant elevated roles only through an admin or the one-time CLI promote-admin script described in [`../yardclub-server/README.md`](../yardclub-server/README.md).

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Better Auth with the MongoDB adapter and JWT plugin
- Tailwind CSS 4 and shadcn/ui (Radix primitives)
- Lucide icons, Framer Motion, Recharts, Sonner, cmdk
- date-fns and react-day-picker for booking dates
- Server-only ImgBB upload route and hosted Stripe Checkout

### Required npm packages

Installed with `npm install`. The versions below reflect `package.json`:

| Group | Packages |
| --- | --- |
| Framework | `next@16.4.6`, `react@19.3.0`, `react-dom@19.3.0` |
| Auth and data | `better-auth@^1.7.26`, `@better-auth/mongo-adapter@^1.7.26`, `mongodb@^7.9.0` |
| UI primitives | `radix-ui@^1.8.1`, `class-variance-authority@^0.7.1`, `cn@^0.5.2`, `shadcn@^4.23.0`, `tw-animate-css@^1.4.0` |
| Icons, motion, charts, feedback | `lucide-react@^1.75.0`, `framer-motion@^14.14.0`, `recharts@^3.8.0`, `sonner@^2.0.8`, `cmdk@^1.1.1` |
| Dates and theme | `date-fns@^4.4.0`, `react-day-picker@^10.0.2`, `next-themes@^0.4.6` |
| Build/dev tooling | `tailwindcss@4.3.3`, `@tailwindcss/turbopack@4.3.3`, `typescript@^5`, `eslint@^9`, `eslint-config-next@16.4.6`, `@types/node`, `@types/react`, `@types/react-dom` |

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Express API must also be running (see `../yardclub-server/README.md`) or `API_URL` must point at a deployed API.

### Environment variables

| Name | Purpose |
| --- | --- |
| `BETTER_AUTH_SECRET` | Server-only secret used by Better Auth to sign session data and JWTs. Keep the placeholder in `.env.example`; use a long random value in real deployments. |
| `BETTER_AUTH_URL` | Canonical origin of this Next.js app, used server-side by Better Auth and as the JWT issuer/audience. |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Same canonical origin, exposed to the browser auth client for sessions and social redirects. |
| `BETTER_AUTH_DB_URL` | MongoDB connection string used by Better Auth (the same user data the Express API reads). |
| `API_URL` | Base URL of the Express API, with no trailing slash. Defaults to `http://localhost:5000` for local development; set it to the deployed API HTTPS origin on Vercel. |
| `IMGBB_API_KEY` | Server-only ImgBB key used by `POST /api/uploads/imgbb`. Never uses a `NEXT_PUBLIC_` prefix. |
| `GOOGLE_CLIENT_ID` | Optional. Enables Google sign-in only when paired with the secret below. |
| `GOOGLE_CLIENT_SECRET` | Optional. Enables Google sign-in only when paired with the ID above. |

> **Origin parity is required:** `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL` (client) and `CLIENT_URL` (API) must be the **same canonical HTTPS origin with no trailing slash**. `API_URL` must be the deployed API HTTPS origin. A mismatch causes 401 responses and sign-in/session reload failures.

### Authentication and roles

- Public registration creates **only `customer` accounts**. There is no admin or owner self-registration.
- Elevated roles are assigned **after** signup by an admin in `/admin/users`, or by the one-time CLI promote-admin script in the server project. The role stored in MongoDB is authoritative, not any role claim in a token.
- Google sign-in uses a real Better Auth social redirect. The button works only when both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured. Register `${BETTER_AUTH_URL}/api/auth/callback/google` as an authorized redirect URI (locally `http://localhost:3000/api/auth/callback/google`). New Google accounts start as customers.
- Forgot-password is **not implemented**; its route and link have been removed. Signed-in users can change their password from the profile page.

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
| `/equipment/[id]` | Listing detail with a **Book Now** modal that collects dates and quantity and submits the booking. |
| `/equipment/[id]/book` | Standalone booking form kept as a fallback (customer role only). |
| `/about`, `/how-it-works`, `/faq`, `/contact` | Marketing and support content. |
| `/owners/[id]` | Public owner profile and their approved listings. |
| `/compare` | Side-by-side comparison of saved equipment. |
| `/payment-success`, `/payment-cancelled` | Stripe Checkout return pages. The success page verifies the session through the Express API before showing the receipt. |
| `/login`, `/register` | Better Auth email/password screens, both offering Google sign-in when configured. |

`GET /api/stats` and `GET /api/equipment/stats` drive the public counters. Featured equipment falls back to top-rated approved listings when none are flagged.

### Customer dashboard

| Route | Purpose |
| --- | --- |
| `/dashboard` | Overview, booking stats, recent rentals, and favorites. |
| `/dashboard/rentals` | Rental history with status filters, pagination, Stripe payment state, and request cancellation. |
| `/dashboard/favorites` | Saved equipment backed by the live favorites API. |
| `/dashboard/profile` | Update profile fields and password. |

### Owner dashboard

| Route | Purpose |
| --- | --- |
| `/owner` | Fleet analytics, earnings, bookings, and recent listings. |
| `/owner/add-equipment` | Create a listing; it starts as `pending`. |
| `/owner/equipment` | Filter owned listings by approval status, edit details, and delete unused ones. |
| `/owner/equipment/[id]/edit` | Edit an owned listing, including pending and rejected rows. |
| `/owner/rentals` | Confirm, start, complete, or decline rental requests for owned equipment. |
| `/owner/profile` | Update owner details shown on the public profile. |

### Admin dashboard

| Route | Purpose |
| --- | --- |
| `/admin` | Platform-wide analytics, pending approvals, and recent activity. |
| `/admin/users` | Search users and change role or account status; this is where `owner` and `admin` roles are granted. |
| `/admin/equipment` | Approve, reject, unlist, feature, edit, or delete any listing. |
| `/admin/equipment/[id]/edit` | Edit any listing regardless of owner or approval status. |
| `/admin/rentals` | Manage every booking and its payment status. |
| `/admin/profile` | Update the admin account. |

Private routes use `requireRole(roles, next)` from `src/lib/api.server.ts`. Signed-out visitors go to `/login?next=...`; users in the wrong role return to their own dashboard.

## How live data works

- `src/lib/api.server.ts` reads the Better Auth session, mints a short-lived JWT with `auth.api.getToken()`, and calls the Express API with `Authorization: Bearer <token>`. The browser never stores or reads that token. The browser auth client uses `NEXT_PUBLIC_BETTER_AUTH_URL`, so the origin parity rule above is essential.
- `GET /api/equipment` is a same-origin route handler that proxies the public Express catalogue for the command palette. It requests featured, top-rated listings and returns an empty list with HTTP 503 when the API is unreachable, so the browser never needs `API_URL` and the palette still works offline.
- `src/lib/data/*` contains server-only queries for equipment, bookings, users, favorites, owners, reviews, categories, and analytics.
- `src/lib/actions/*` contains server actions for creating bookings and starting Stripe Checkout immediately afterwards, creating listings, updating profiles, saving favorites, managing bookings, and admin moderation.
- Signed-in users can upload listing and profile images through `POST /api/uploads/imgbb`. The route keeps the ImgBB key server-side and returns the hosted `i.ibb.co` URL saved in MongoDB. A direct hosted image URL is also accepted by the forms.
- Booking totals are `pricePerDay × quantity × daysBetween(start, end)`. Submitting a booking from the modal (or the fallback page) creates it as `pending` and **immediately starts hosted Stripe Checkout**; the renter is redirected to Stripe. `/payment-success` re-verifies the session through the API, while the signed Stripe webhook is the authoritative writer of payment records. Verification is idempotent, and `/payment-cancelled` lets the renter retry. Owners still handle fulfilment, but payment does not wait for owner confirmation.
- Favorites are stored in MongoDB through `/api/favorites`. The compare tray stores lightweight item snapshots in `localStorage` and does not depend on mock catalogue data.
- Root error and loading boundaries live in `src/app/error.tsx` and `src/app/loading.tsx`; the catalogue has a more specific skeleton and error page.

### Cache Components

Next.js 16 Cache Components are enabled. Session-backed and live-data segments set `export const instant = false` in `src/app/(dashboard)/layout.tsx` and `src/app/(marketing)/layout.tsx`. This is the documented migration path for routes that read request-time session or API data instead of prerendering it.

### Images

Only `https://i.ibb.co` is allowed through the Next image optimizer. Other remote URLs render with `unoptimized` via `bypassImageOptimization()` in `src/lib/images.ts`.

## Deploying to Vercel

1. Create the **API** project with root directory `yardclub-server`. The server's `api/index.ts` is the serverless entry and `vercel.json` rewrites requests to the Express app. Set the API environment variables from [`../yardclub-server/README.md`](../yardclub-server/README.md) and deploy it first.
2. Create the **client** project with root directory `yardclub_client` (Next.js preset). Set the variables above, in particular `API_URL` to the deployed API HTTPS origin and all three canonical-origin variables to the client HTTPS origin.
3. Register `https://yardclub-server.vercel.app/api/payments/webhook` in Stripe and put its signing secret in `STRIPE_WEBHOOK_SECRET` on the API project, then redeploy.
4. If using Google sign-in, register `https://yardclub-client.vercel.app/api/auth/callback/google` in Google Cloud and set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` on the client project.
5. Verify `GET https://yardclub-server.vercel.app/api/health` and a signed-in session on `https://yardclub-client.vercel.app`. Both Vercel projects are connected to their GitHub repositories, so later pushes to `main` redeploy automatically.

## Scope note

All assignment features use live data: there is no mock catalogue, placeholder Google sign-in, or simulated payment. Forgot-password and admin self-registration are intentionally out of scope.
