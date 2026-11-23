import { betterAuth } from "better-auth";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { APIError } from "@better-auth/core/error";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 128;

/**
 * Assignment rule: passwords must be at least 6 characters long and contain
 * at least one uppercase letter and one lowercase letter. Better Auth only
 * exposes min/max length natively, so strength is enforced through a custom
 * password hash hook, which runs before any user/credential is written.
 */
function assertPasswordStrength(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new APIError("BAD_REQUEST", {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    });
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new APIError("BAD_REQUEST", {
      message: `Password must be at most ${MAX_PASSWORD_LENGTH} characters long.`,
    });
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
    throw new APIError("BAD_REQUEST", {
      message:
        "Password must contain at least one uppercase letter (A-Z) and one lowercase letter (a-z).",
    });
  }
}

const passwordHash = async (password: string) => {
  assertPasswordStrength(password);
  return hashPassword(password);
};

const configuredDbUrl = process.env.BETTER_AUTH_DB_URL;
if (!configuredDbUrl) {
  throw new Error(
    "BETTER_AUTH_DB_URL is missing. Set a MongoDB connection string in the server environment before starting the app.",
  );
}
if (!/^mongodb(\+srv)?:\/\//.test(configuredDbUrl)) {
  throw new Error(
    "BETTER_AUTH_DB_URL must be a mongodb:// or mongodb+srv:// connection string.",
  );
}
const dbUrl: string = configuredDbUrl;

const baseURL = (
  process.env.BETTER_AUTH_URL || "http://localhost:3000"
).replace(/\/$/, "");

function topologyIsClosed(client: MongoClient): boolean {
  // Driver internals are not part of the public typings; check every supported
  // shape so an idle/closed pool is rebuilt instead of reused forever.
  const topology = (
    client as unknown as {
      topology?: {
        isDestroyed?(): boolean;
        isClosed?(): boolean;
        s?: { state?: string };
      };
    }
  ).topology;
  if (!topology) return false;
  if (typeof topology.isDestroyed === "function") return topology.isDestroyed();
  if (typeof topology.isClosed === "function") return topology.isClosed();
  return topology.s?.state === "closed";
}

function createClient(): MongoClient {
  return new MongoClient(dbUrl, {
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30_000,
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    retryReads: true,
    retryWrites: true,
  });
}

function buildAuth() {
  let client = globalThis._yardclubAuthClient;
  if (!client || topologyIsClosed(client)) {
    client = createClient();
    globalThis._yardclubAuthClient = client;
  }
  const db = client.db("yardclubDB");

  return betterAuth({
    emailAndPassword: {
      enabled: true,
      minPasswordLength: MIN_PASSWORD_LENGTH,
      password: {
        hash: passwordHash,
        verify: verifyPassword,
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: true,
          defaultValue: "customer",
          // Owners may self-register from the email sign-up form; Google always
          // lands on the customer default.
          input: true,
        },
        phone: {
          type: "string",
          required: false,
          input: true,
        },
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            // Email sign-ups may choose the owner role; Google always defaults
            // to the customer role, and only customer/owner are open for
            // self-service.
            const role = String((user as { role?: unknown }).role ?? "customer");
            const safeRole = role === "owner" ? "owner" : "customer";
            return { data: { ...user, role: safeRole } };
          },
        },
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        // "compact" is signed with BETTER_AUTH_SECRET alone, so reading a
        // session from the cookie cache never needs MongoDB. The "jwt"
        // strategy verifies through JWKS keys stored in the database, which
        // made every get-session call fail whenever Mongo was unreachable and
        // logged legitimate users out of private routes.
        strategy: "compact",
        maxAge: 5 * 24 * 60 * 60,
      },
    },
    plugins: [
      jwt({
        // The JWT plugin otherwise mints a DB-backed token on every
        // /get-session response. Routes only need the JWT when calling the
        // Express API, which requests it explicitly through getToken().
        disableSettingJwtHeader: true,
        jwt: {
          issuer: baseURL,
          audience: baseURL,
          definePayload: ({ user }) => ({
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }),
        },
      }),
    ],
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL,
    socialProviders: {
      ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
    },
    database: mongodbAdapter(db, { client }),
  });
}

type AuthInstance = ReturnType<typeof buildAuth>;

declare global {
  // Kept on globalThis so warm serverless invocations share one pool instead
  // of opening a new connection on every request. A topology that has been
  // closed by the driver or by a dropped Atlas connection is never reused.
  var _yardclubAuthClient: MongoClient | undefined;
  var _yardclubAuth: AuthInstance | undefined;
}

/**
 * Returns a live auth instance. If the cached MongoDB topology has closed
 * (idle Atlas connection, cold-start race, driver shutdown), both the client
 * and the auth instance are rebuilt before they are used again.
 */
export function getAuth(): AuthInstance {
  if (
    !globalThis._yardclubAuth ||
    !globalThis._yardclubAuthClient ||
    topologyIsClosed(globalThis._yardclubAuthClient)
  ) {
    globalThis._yardclubAuth = buildAuth();
  }
  return globalThis._yardclubAuth;
}

export type Auth = AuthInstance;
