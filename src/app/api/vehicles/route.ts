import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        driver: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(
      vehicles.map((v) => ({
        ...v,
        driverName: v.driver?.user?.name || null,
      }))
    );
  } catch (error) {
    console.error("Vehicles GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des véhicules" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plateNumber, type, brand, model, year, capacity } = body;

    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plateNumber },
    });

    if (existingVehicle) {
      return NextResponse.json(
        { error: "Un véhicule avec cette immatriculation existe déjà" },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber,
        type,
        brand,
        model,
        year: year ? parseInt(year) : null,
        capacity: capacity ? parseFloat(capacity) : null,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Vehicles POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du véhicule" },
      { status: 500 }
    );
  }
}
