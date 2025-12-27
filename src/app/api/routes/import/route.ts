import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CSVRow {
  address: string;
  city: string;
  postalCode: string;
  recipientName?: string;
  phone?: string;
  accessCode?: string;
  instructions?: string;
  externalBarcode?: string;
  weight?: string;
  packageDescription?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      routeId,
      contractId,
      scheduledDate,
      driverId,
      vehicleId,
      createdById,
      csvData,
      routeName,
    } = body;

    if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
      return NextResponse.json(
        { error: "Données CSV invalides ou vides" },
        { status: 400 }
      );
    }

    if (!createdById) {
      return NextResponse.json(
        { error: "Créateur requis" },
        { status: 400 }
      );
    }

    let route;

    // Create new route if routeId is not provided
    if (!routeId) {
      if (!scheduledDate) {
        return NextResponse.json(
          { error: "Date de route requise pour créer une nouvelle route" },
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

      route = await prisma.route.create({
        data: {
          routeNumber,
          name: routeName,
          scheduledDate: new Date(scheduledDate),
          contractId,
          driverId,
          vehicleId,
          createdById,
        },
      });
    } else {
      route = await prisma.route.findUnique({
        where: { id: routeId },
      });

      if (!route) {
        return NextResponse.json(
          { error: "Route non trouvée" },
          { status: 404 }
        );
      }

      if (route.status !== "DRAFT") {
        return NextResponse.json(
          { error: "Impossible d'importer dans une route non-brouillon" },
          { status: 400 }
        );
      }
    }

    // Get existing stop count for numbering
    const existingStops = await prisma.routeStop.count({
      where: { routeId: route.id },
    });

    // Group CSV rows by address to create stops with multiple packages
    const stopGroups = groupByAddress(csvData);

    let stopNumber = existingStops;
    const createdStops = [];

    for (const [addressKey, rows] of Object.entries(stopGroups)) {
      stopNumber++;
      const firstRow = rows[0];

      // Create stop
      const stop = await prisma.routeStop.create({
        data: {
          routeId: route.id,
          stopNumber,
          recipientName: firstRow.recipientName,
          address: firstRow.address,
          city: firstRow.city,
          postalCode: firstRow.postalCode,
          phone: firstRow.phone,
          accessCode: firstRow.accessCode,
          instructions: firstRow.instructions,
        },
      });

      // Create packages for this stop
      const packages = [];
      for (const row of rows) {
        if (row.externalBarcode) {
          const pkg = await prisma.package.create({
            data: {
              externalBarcode: row.externalBarcode,
              weight: row.weight ? parseFloat(row.weight) : null,
              description: row.packageDescription,
              routeStopId: stop.id,
              contractId: contractId || route.contractId,
            },
          });
          packages.push(pkg);
        }
      }

      createdStops.push({ ...stop, packages });
    }

    // Update route stats
    const allStops = await prisma.routeStop.findMany({
      where: { routeId: route.id },
      include: { packages: true },
    });

    const totalStops = allStops.length;
    const totalPackages = allStops.reduce((acc, s) => acc + s.packages.length, 0);

    await prisma.route.update({
      where: { id: route.id },
      data: {
        totalStops,
        totalPackages,
      },
    });

    return NextResponse.json({
      success: true,
      route: {
        id: route.id,
        routeNumber: route.routeNumber,
      },
      imported: {
        stops: createdStops.length,
        packages: createdStops.reduce((acc, s) => acc + s.packages.length, 0),
      },
    });
  } catch (error) {
    console.error("Route import error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'import de la route" },
      { status: 500 }
    );
  }
}

function groupByAddress(rows: CSVRow[]): Record<string, CSVRow[]> {
  const groups: Record<string, CSVRow[]> = {};

  for (const row of rows) {
    // Create a unique key for the address
    const key = `${row.address.toLowerCase().trim()}|${row.city.toLowerCase().trim()}|${row.postalCode.trim()}`;

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(row);
  }

  return groups;
}
