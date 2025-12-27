"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      setIsLoading(false);
      return;
    }

    try {
      // Get CSRF token first (with credentials to get cookies)
      const csrfRes = await fetch("/api/auth/csrf", {
        credentials: "include",
      });
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken;

      // Submit to NextAuth callback
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          csrfToken,
          email,
          password,
        }),
        credentials: "include",
        redirect: "manual",
      });

      // With redirect: "manual", success returns opaqueredirect
      if (res.type === "opaqueredirect") {
        toast.success("Connexion reussie !");
        window.location.href = "/dashboard";
        return;
      }

      // Check URL for error
      if (res.url?.includes("error")) {
        toast.error("Email ou mot de passe incorrect");
        setIsLoading(false);
        return;
      }

      // Default: try to redirect
      toast.success("Connexion reussie !");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Une erreur est survenue");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-[#12121a] border-zinc-800/50">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            <Truck className="h-10 w-10 text-cyan-400" />
            <span className="text-2xl font-bold text-zinc-100">LogiFlow</span>
          </div>
        </div>
        <CardTitle className="text-2xl text-zinc-100">Connexion</CardTitle>
        <CardDescription className="text-zinc-500">
          Entrez vos identifiants pour acceder a votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@logiflow.fr"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Votre mot de passe"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-zinc-500">Pas encore de compte ? </span>
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 hover:underline">
            Creer un compte
          </Link>
        </div>
        <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <p className="text-xs text-zinc-500 text-center">
            Demo: admin@logiflow.fr / Admin123!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
