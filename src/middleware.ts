import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Simple in-memory rate limit store
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

function checkRateLimit(ip: string): { allowed: boolean; resetIn: number } {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxAttempts = 5;

  let entry = loginAttempts.get(ip);

  if (!entry || entry.resetTime < now) {
    entry = { count: 1, resetTime: now + windowMs };
    loginAttempts.set(ip, entry);
    return { allowed: true, resetIn: 60 };
  }

  entry.count++;

  if (entry.count > maxAttempts) {
    return { allowed: false, resetIn: Math.ceil((entry.resetTime - now) / 1000) };
  }

  return { allowed: true, resetIn: Math.ceil((entry.resetTime - now) / 1000) };
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protected routes check
  const protectedPaths = [
    "/dashboard", "/orders", "/routes", "/packages",
    "/customers", "/contracts", "/fleet", "/warehouses",
    "/invoices", "/settings", "/driver"
  ];

  const isProtected = protectedPaths.some(p => path.startsWith(p));

  if (isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      cookieName: "__Secure-authjs.session-token",
    });

    console.log("[middleware] token:", token ? "found" : "not found");

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Driver routes - check role
    if (path.startsWith("/driver")) {
      if (token.role !== "DRIVER" && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
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
  ],
};
