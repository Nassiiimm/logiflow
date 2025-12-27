import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface PackageWithAddress {
  id: string;
  barcode: string;
  externalBarcode: string | null;
  recipientName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string | null;
  instructions: string | null;
  accessCode: string | null;
  description?: string;
  weight?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packages: packagesData,
      contractId,
      driverId,
      vehicleId,
      scheduledDate,
      routeName,
      createdById,
    } = body;

    if (!packagesData || !Array.isArray(packagesData) || packagesData.length === 0) {
      return NextResponse.json(
        { error: "Aucun colis selectionne" },
        { status: 400 }
      );
    }

    if (!scheduledDate || !createdById) {
      return NextResponse.json(
        { error: "Date et createur requis" },
        { status: 400 }
      );
    }

    // Generate route number
    const today = new Date();
    const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, "");
    const count = await prisma.route.count({
      where: {
        routeNumber: { startsWith: `R${datePrefix}` },
      },
    });
    const routeNumber = `R${datePrefix}-${String(count + 1).padStart(3, "0")}`;

    // Group packages by address to create stops
    const addressMap = new Map<string, PackageWithAddress[]>();

    for (const pkg of packagesData) {
      const addressKey = `${pkg.address.toLowerCase().trim()}|${pkg.postalCode}`;
      if (!addressMap.has(addressKey)) {
        addressMap.set(addressKey, []);
      }
      addressMap.get(addressKey)!.push(pkg);
    }

    // Create the route with stops
    const route = await prisma.route.create({
      data: {
        routeNumber,
        name: routeName || `Route ${routeNumber}`,
        status: "DRAFT",
        scheduledDate: new Date(scheduledDate),
        contractId: contractId || null,
        driverId: driverId || null,
        vehicleId: vehicleId || null,
        createdById,
        totalStops: addressMap.size,
        totalPackages: packagesData.length,
        stops: {
          create: Array.from(addressMap.entries()).map(([_, packages], index) => {
            const firstPkg = packages[0];
            return {
              stopNumber: index + 1,
              recipientName: firstPkg.recipientName || null,
              address: firstPkg.address,
              city: firstPkg.city,
              postalCode: firstPkg.postalCode,
              phone: firstPkg.phone || null,
              instructions: firstPkg.instructions || null,
              accessCode: firstPkg.accessCode || null,
              status: "PENDING",
              packages: {
                create: packages.map((pkg) => ({
                  barcode: pkg.barcode || `PKG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  externalBarcode: pkg.externalBarcode || null,
                  description: pkg.description || `Colis pour ${firstPkg.recipientName || firstPkg.address}`,
                  weight: pkg.weight ? parseFloat(pkg.weight) : null,
                  contractId: contractId || null,
                  status: "PENDING",
                })),
              },
            };
          }),
        },
      },
      include: {
        stops: {
          include: {
            packages: true,
          },
        },
        contract: { select: { name: true, code: true } },
        driver: { include: { user: { select: { name: true } } } },
        vehicle: { select: { plateNumber: true, type: true } },
      },
    });

    return NextResponse.json({
      route,
      summary: {
        routeNumber: route.routeNumber,
        stops: route.stops.length,
        packages: route.stops.reduce((acc, stop) => acc + stop.packages.length, 0),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Create route from packages error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la route" },
      { status: 500 }
    );
  }
}
