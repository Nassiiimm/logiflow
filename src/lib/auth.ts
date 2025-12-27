import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true, // Enable debug in all environments for now
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        console.log("[auth] ========= AUTHORIZE START =========");
        console.log("[auth] credentials received:", JSON.stringify(credentials));
        console.log("[auth] email:", credentials?.email);
        console.log("[auth] password length:", credentials?.password ? String(credentials.password).length : 0);

        if (!credentials?.email || !credentials?.password) {
          console.log("[auth] FAIL: Missing credentials");
          return null;
        }

        const email = String(credentials.email).trim();
        const password = String(credentials.password);

        console.log("[auth] Trimmed email:", email);

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          console.log("[auth] DB query done, user found:", !!user);

          if (!user || !user.password) {
            console.log("[auth] FAIL: User not found or no password");
            return null;
          }

          console.log("[auth] User email:", user.email);
          console.log("[auth] Comparing passwords...");

          const isPasswordValid = await bcrypt.compare(password, user.password);

          console.log("[auth] Password comparison result:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("[auth] FAIL: Invalid password");
            return null;
          }

          console.log("[auth] SUCCESS: Login for", user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("[auth] ERROR:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
