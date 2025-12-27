import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// DEBUG ENDPOINT - DELETE AFTER TESTING
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("[debug-auth] Testing with email:", email);

    // Test 1: Can we connect to DB?
    const userCount = await prisma.user.count();
    console.log("[debug-auth] Total users in DB:", userCount);

    // Test 2: Can we find this user?
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        step: "user_lookup",
        message: "User not found",
        totalUsers: userCount,
      });
    }

    console.log("[debug-auth] User found:", user.email);

    // Test 3: Is password set?
    if (!user.password) {
      return NextResponse.json({
        success: false,
        step: "password_check",
        message: "User has no password set",
      });
    }

    // Test 4: Does password match?
    const isValid = await bcrypt.compare(password, user.password);
    console.log("[debug-auth] Password valid:", isValid);

    if (!isValid) {
      return NextResponse.json({
        success: false,
        step: "password_compare",
        message: "Password does not match",
        passwordLength: user.password.length,
        hashPrefix: user.password.substring(0, 10),
      });
    }

    return NextResponse.json({
      success: true,
      message: "All checks passed!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[debug-auth] Error:", error);
    return NextResponse.json({
      success: false,
      step: "error",
      message: String(error),
    }, { status: 500 });
  }
}
