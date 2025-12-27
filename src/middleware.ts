import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Simple in-memory rate limit store (resets on server restart)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxAttempts = 5;

  let entry = loginAttempts.get(ip);

  if (!entry || entry.resetTime < now) {
    entry = { count: 1, resetTime: now + windowMs };
    loginAttempts.set(ip, entry);
    return { allowed: true, remaining: maxAttempts - 1, resetIn: 60 };
  }

  entry.count++;

  if (entry.count > maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  return {
    allowed: true,
    remaining: maxAttempts - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Rate limit login attempts
  if (path === "/api/auth/callback/credentials" && request.method === "POST") {
    const ip = getClientIp(request);
    const { allowed, remaining, resetIn } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Trop de tentatives de connexion",
          message: `Reessayez dans ${resetIn} secondes`,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(resetIn),
            "Retry-After": String(resetIn),
          },
        }
      );
    }
  }

  // Protect dashboard routes
  if (path.startsWith("/dashboard") || path.startsWith("/orders") ||
      path.startsWith("/routes") || path.startsWith("/packages") ||
      path.startsWith("/customers") || path.startsWith("/contracts") ||
      path.startsWith("/fleet") || path.startsWith("/warehouses") ||
      path.startsWith("/invoices") || path.startsWith("/settings")) {

    const session = await auth();

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect driver routes
  if (path.startsWith("/driver")) {
    const session = await auth();

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if user is a driver
    if (session.user.role !== "DRIVER" && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/routes/:path*",
    "/packages/:path*",
    "/customers/:path*",
    "/contracts/:path*",
    "/fleet/:path*",
    "/warehouses/:path*",
    "/invoices/:path*",
    "/settings/:path*",
    "/driver/:path*",
    "/api/auth/callback/credentials",
  ],
};
