"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function loginAction(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
    return { success: true };
  } catch (error) {
    // NextAuth throws redirect errors on success, let them through
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      console.log("[loginAction] AuthError:", error.type, error.message);
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Email ou mot de passe incorrect" };
        default:
          return { success: false, error: "Une erreur est survenue" };
      }
    }

    console.error("[loginAction] Unknown error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}
