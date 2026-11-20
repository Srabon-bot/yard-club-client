# yard-club-client

Next.js frontend for Yardclub, an equipment rental platform.

## Setup

```bash
npm install
npm run dev
```

The app expects these environment variables in `.env`:

| Name | Purpose |
| --- | --- |
| `BETTER_AUTH_SECRET` | Better Auth signing secret. |
| `BETTER_AUTH_URL` | Public URL of this Next.js app. |
| `BETTER_AUTH_DB_URL` | MongoDB connection string used by Better Auth. |
| `API_URL` | Base URL of the Express API, usually `http://localhost:5000`. |
| `API_INTERNAL_KEY` | Shared server-only key used when calling the Express dashboard API. It must match the server's value. |

`API_INTERNAL_KEY` is a temporary bridge until JWT authentication is added.
It is only read on the server and is never exposed to the browser.

Open [http://localhost:3000](http://localhost:3000) after both the client and
server are running.
