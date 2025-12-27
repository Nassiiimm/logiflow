import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        driver: {
          include: {
            user: { select: { name: true } },
          },
        },
        maintenances: {
          orderBy: { scheduledDate: "desc" },
          take: 5,
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Véhicule non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Vehicle GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du véhicule" },
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
    const { plateNumber, type, brand, model, year, capacity, status } = body;

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        plateNumber,
        type,
        brand,
        model,
        year: year ? parseInt(year) : null,
        capacity: capacity ? parseFloat(capacity) : null,
        status,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Vehicle PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du véhicule" },
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

    await prisma.vehicle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vehicle DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du véhicule" },
      { status: 500 }
    );
  }
}
