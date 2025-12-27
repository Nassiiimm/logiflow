import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        vehicles: true,
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Chauffeur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(driver);
  } catch (error) {
    console.error("Driver GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du chauffeur" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, phone, licenseNumber, licenseExpiry, isAvailable } = body;

    const driver = await prisma.driver.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Chauffeur non trouvé" },
        { status: 404 }
      );
    }

    // Update user name
    if (name) {
      await prisma.user.update({
        where: { id: driver.userId },
        data: { name },
      });
    }

    // Update driver
    const updatedDriver = await prisma.driver.update({
      where: { id },
      data: {
        phone,
        licenseNumber,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : undefined,
        isAvailable,
      },
    });

    return NextResponse.json(updatedDriver);
  } catch (error) {
    console.error("Driver PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du chauffeur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const driver = await prisma.driver.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Chauffeur non trouvé" },
        { status: 404 }
      );
    }

    // Delete driver first, then user
    await prisma.driver.delete({
      where: { id },
    });

    await prisma.user.delete({
      where: { id: driver.userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Driver DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du chauffeur" },
      { status: 500 }
    );
  }
}
