"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Truck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));
  }, []);

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
        {/* Native HTML form - submits directly to NextAuth */}
        <form
          method="POST"
          action="/api/auth/callback/credentials"
          className="space-y-4"
        >
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="callbackUrl" value="/dashboard" />

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@logiflow.fr"
              required
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-zinc-200">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Votre mot de passe"
              required
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md transition-colors"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-zinc-500">Pas encore de compte ? </span>
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 hover:underline">
            Creer un compte
          </Link>
        </div>
        <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <p className="text-xs text-zinc-500 text-center">
            Demo: admin@logiflow.fr / admin123
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
