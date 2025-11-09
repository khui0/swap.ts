import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "$lib/server/db";
import { sendChangeEmail, sendResetPassword, sendVerifyEmail } from "./server/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        await sendChangeEmail(user.email, user.name, newEmail, url);
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPassword(user.email, user.name, url);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerifyEmail(user.email, user.name, url);
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
});
