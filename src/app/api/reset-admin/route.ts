import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// TEMPORARY - DELETE AFTER USE
export async function GET() {
  try {
    // Simple password without special characters
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const user = await prisma.user.upsert({
      where: { email: "admin@logiflow.fr" },
      update: { password: hashedPassword },
      create: {
        email: "admin@logiflow.fr",
        name: "Admin LogiFlow",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin reset",
      email: user.email,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
