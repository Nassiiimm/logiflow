"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-slate-50">
        {children}
        <Toaster position="top-center" richColors />
      </div>
    </SessionProvider>
  );
}
