import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        vehicles: { select: { plateNumber: true } },
        _count: { select: { orders: true } },
      },
    });

    return NextResponse.json(
      drivers.map((d) => ({
        id: d.id,
        name: d.user.name,
        email: d.user.email,
        phone: d.phone,
        licenseNumber: d.licenseNumber,
        licenseExpiry: d.licenseExpiry,
        isAvailable: d.isAvailable,
        vehicle: d.vehicles[0]?.plateNumber || null,
        deliveriesCount: d._count.orders,
      }))
    );
  } catch (error) {
    console.error("Drivers GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des chauffeurs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, licenseNumber, licenseExpiry } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash("password123", 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "DRIVER",
        phone,
        driver: {
          create: {
            licenseNumber,
            licenseExpiry: new Date(licenseExpiry),
            phone,
          },
        },
      },
      include: { driver: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Drivers POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du chauffeur" },
      { status: 500 }
    );
  }
}
