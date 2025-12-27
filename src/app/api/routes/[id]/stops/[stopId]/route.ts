import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  try {
    const { stopId } = await params;

    const stop = await prisma.routeStop.findUnique({
      where: { id: stopId },
      include: {
        packages: true,
        route: {
          select: { routeNumber: true, status: true },
        },
      },
    });

    if (!stop) {
      return NextResponse.json(
        { error: "Stop non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(stop);
  } catch (error) {
    console.error("Stop GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du stop" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  try {
    const { id: routeId, stopId } = await params;
    const body = await request.json();
    const {
      status,
      recipientName,
      address,
      city,
      postalCode,
      phone,
      latitude,
      longitude,
      accessCode,
      instructions,
      actualArrival,
      departureTime,
      signature,
      signedBy,
      proofPhoto,
      deliveryNotes,
      failureReason,
    } = body;

    const stop = await prisma.routeStop.update({
      where: { id: stopId },
      data: {
        status,
        recipientName,
        address,
        city,
        postalCode,
        phone,
        latitude,
        longitude,
        accessCode,
        instructions,
        actualArrival: actualArrival ? new Date(actualArrival) : undefined,
        departureTime: departureTime ? new Date(departureTime) : undefined,
        signature,
        signedBy,
        proofPhoto,
        deliveryNotes,
        failureReason,
      },
      include: {
        packages: true,
      },
    });

    // If stop is completed, update all packages status
    if (status === "COMPLETED") {
      await prisma.package.updateMany({
        where: { routeStopId: stopId },
        data: {
          status: "DELIVERED",
          deliveredAt: new Date(),
          signature,
          signedBy,
          proofPhoto,
          deliveryNotes,
        },
      });
    } else if (status === "FAILED") {
      await prisma.package.updateMany({
        where: { routeStopId: stopId },
        data: {
          status: "FAILED",
          deliveryNotes: failureReason,
        },
      });
    }

    // Update route stats
    await updateRouteStats(routeId);

    return NextResponse.json(stop);
  } catch (error) {
    console.error("Stop PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du stop" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  try {
    const { id: routeId, stopId } = await params;

    const stop = await prisma.routeStop.findUnique({
      where: { id: stopId },
      include: { route: { select: { status: true } } },
    });

    if (!stop) {
      return NextResponse.json(
        { error: "Stop non trouvé" },
        { status: 404 }
      );
    }

    // Only allow deletion if route is in DRAFT status
    if (stop.route.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Impossible de supprimer un stop d'une route active" },
        { status: 400 }
      );
    }

    // Delete packages first
    await prisma.package.deleteMany({
      where: { routeStopId: stopId },
    });

    // Delete stop
    await prisma.routeStop.delete({
      where: { id: stopId },
    });

    // Renumber remaining stops
    const remainingStops = await prisma.routeStop.findMany({
      where: { routeId },
      orderBy: { stopNumber: "asc" },
    });

    for (let i = 0; i < remainingStops.length; i++) {
      await prisma.routeStop.update({
        where: { id: remainingStops[i].id },
        data: { stopNumber: i + 1 },
      });
    }

    // Update route stats
    await updateRouteStats(routeId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Stop DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du stop" },
      { status: 500 }
    );
  }
}

async function updateRouteStats(routeId: string) {
  const stops = await prisma.routeStop.findMany({
    where: { routeId },
    include: { packages: true },
  });

  const totalStops = stops.length;
  const completedStops = stops.filter((s) => s.status === "COMPLETED").length;
  const totalPackages = stops.reduce((acc, s) => acc + s.packages.length, 0);
  const deliveredPackages = stops.reduce(
    (acc, s) => acc + s.packages.filter((p) => p.status === "DELIVERED").length,
    0
  );

  await prisma.route.update({
    where: { id: routeId },
    data: {
      totalStops,
      completedStops,
      totalPackages,
      deliveredPackages,
    },
  });
}
