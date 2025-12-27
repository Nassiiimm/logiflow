import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        contract: true,
        driver: {
          include: { user: { select: { name: true, phone: true } } },
        },
        vehicle: true,
        createdBy: { select: { name: true } },
        stops: {
          orderBy: { stopNumber: "asc" },
          include: {
            packages: true,
          },
        },
      },
    });

    if (!route) {
      return NextResponse.json(
        { error: "Route non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(route);
  } catch (error) {
    console.error("Route GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la route" },
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
    const {
      name,
      status,
      scheduledDate,
      startTime,
      endTime,
      driverId,
      vehicleId,
      notes,
      totalDistance,
    } = body;

    const route = await prisma.route.update({
      where: { id },
      data: {
        name,
        status,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        driverId,
        vehicleId,
        notes,
        totalDistance,
      },
      include: {
        contract: { select: { name: true, code: true } },
        driver: {
          include: { user: { select: { name: true } } },
        },
        vehicle: { select: { plateNumber: true } },
      },
    });

    return NextResponse.json(route);
  } catch (error) {
    console.error("Route PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la route" },
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

    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        stops: {
          include: { packages: true },
        },
      },
    });

    if (!route) {
      return NextResponse.json(
        { error: "Route non trouvée" },
        { status: 404 }
      );
    }

    // Only allow deletion of DRAFT routes
    if (route.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Seules les routes en brouillon peuvent être supprimées" },
        { status: 400 }
      );
    }

    // Delete all packages from stops
    for (const stop of route.stops) {
      await prisma.package.deleteMany({
        where: { routeStopId: stop.id },
      });
    }

    // Delete all stops
    await prisma.routeStop.deleteMany({
      where: { routeId: id },
    });

    // Delete route
    await prisma.route.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Route DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la route" },
      { status: 500 }
    );
  }
}
