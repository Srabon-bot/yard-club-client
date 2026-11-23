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

const dbUrl = process.env.BETTER_AUTH_DB_URL;
if (!dbUrl) {
  throw new Error(
    "BETTER_AUTH_DB_URL is missing. Set a MongoDB connection string in the server environment before starting the app.",
  );
}
if (!/^mongodb(\+srv)?:\/\//.test(dbUrl)) {
  throw new Error(
    "BETTER_AUTH_DB_URL must be a mongodb:// or mongodb+srv:// connection string.",
  );
}

declare global {
  var _mongoAuthClient: MongoClient | undefined;
}

const client =
  globalThis._mongoAuthClient ??
  new MongoClient(dbUrl, {
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis._mongoAuthClient = client;
} else {
  // In serverless production, cache client across warm lambda invocations
  globalThis._mongoAuthClient = client;
}

const db = client.db("yardclubDB");
const baseURL = (
  process.env.BETTER_AUTH_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const auth = betterAuth({
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
        // Roles are assigned by admins after sign-up, never by the browser.
        input: false,
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
          // Direct API calls must not be able to create owners or admins.
          return { data: { ...user, role: "customer" } };
        },
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 5 * 24 * 60 * 60,
    },
  },
  plugins: [
    jwt({
      sessionCookieCache: true,
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
  database: mongodbAdapter(db, {
    client,
  }),
});
