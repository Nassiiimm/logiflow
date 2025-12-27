import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// TEMPORARY endpoint to seed admin user - DELETE AFTER USE
export async function GET() {
  try {
    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@logiflow.fr" }
    });

    if (existingAdmin) {
      // Reset password
      const hashedPassword = await bcrypt.hash("Admin123!", 12);
      await prisma.user.update({
        where: { email: "admin@logiflow.fr" },
        data: { password: hashedPassword }
      });
      return NextResponse.json({
        message: "Admin password reset",
        email: existingAdmin.email
      });
    }

    // Create admin
    const hashedPassword = await bcrypt.hash("Admin123!", 12);
    const admin = await prisma.user.create({
      data: {
        email: "admin@logiflow.fr",
        name: "Admin LogiFlow",
        password: hashedPassword,
        role: "ADMIN"
      }
    });

    return NextResponse.json({
      message: "Admin created successfully",
      email: admin.email
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
