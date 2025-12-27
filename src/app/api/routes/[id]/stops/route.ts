import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const stops = await prisma.routeStop.findMany({
      where: { routeId: id },
      orderBy: { stopNumber: "asc" },
      include: {
        packages: true,
      },
    });

    return NextResponse.json(stops);
  } catch (error) {
    console.error("Route stops GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des stops" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      recipientName,
      address,
      city,
      postalCode,
      phone,
      latitude,
      longitude,
      accessCode,
      instructions,
      packages,
    } = body;

    if (!address || !city || !postalCode) {
      return NextResponse.json(
        { error: "L'adresse complète est requise" },
        { status: 400 }
      );
    }

    // Get route to verify it exists and get contract info
    const route = await prisma.route.findUnique({
      where: { id },
      select: { contractId: true },
    });

    if (!route) {
      return NextResponse.json(
        { error: "Route non trouvée" },
        { status: 404 }
      );
    }

    // Get next stop number
    const lastStop = await prisma.routeStop.findFirst({
      where: { routeId: id },
      orderBy: { stopNumber: "desc" },
    });
    const stopNumber = (lastStop?.stopNumber ?? 0) + 1;

    // Create stop with packages
    const stop = await prisma.routeStop.create({
      data: {
        routeId: id,
        stopNumber,
        recipientName,
        address,
        city,
        postalCode,
        phone,
        latitude,
        longitude,
        accessCode,
        instructions,
        packages: packages?.length
          ? {
              create: packages.map((pkg: any) => ({
                externalBarcode: pkg.externalBarcode,
                weight: pkg.weight ? parseFloat(pkg.weight) : null,
                description: pkg.description,
                contractId: route.contractId,
              })),
            }
          : undefined,
      },
      include: {
        packages: true,
      },
    });

    // Update route stats
    await updateRouteStats(id);

    return NextResponse.json(stop, { status: 201 });
  } catch (error) {
    console.error("Route stop POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du stop" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: routeId } = await params;
    const body = await request.json();
    const { stops } = body; // Array of stop IDs in new order

    if (!stops || !Array.isArray(stops)) {
      return NextResponse.json(
        { error: "Liste des stops requise" },
        { status: 400 }
      );
    }

    // Update stop numbers based on new order
    for (let i = 0; i < stops.length; i++) {
      await prisma.routeStop.update({
        where: { id: stops[i] },
        data: { stopNumber: i + 1 },
      });
    }

    const updatedStops = await prisma.routeStop.findMany({
      where: { routeId },
      orderBy: { stopNumber: "asc" },
      include: { packages: true },
    });

    return NextResponse.json(updatedStops);
  } catch (error) {
    console.error("Route stops reorder error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la réorganisation des stops" },
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
