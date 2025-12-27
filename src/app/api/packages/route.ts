import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const contractId = searchParams.get("contractId");
    const unassigned = searchParams.get("unassigned") === "true";

    const packages = await prisma.package.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { barcode: { contains: search, mode: "insensitive" } },
                  { externalBarcode: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          status ? { status: status as any } : {},
          contractId ? { contractId } : {},
          unassigned ? { routeStopId: null } : {},
        ],
      },
      include: {
        contract: {
          select: { name: true, code: true },
        },
        routeStop: {
          select: {
            id: true,
            address: true,
            city: true,
            postalCode: true,
            recipientName: true,
            route: {
              select: { routeNumber: true, status: true },
            },
          },
        },
        order: {
          select: { trackingNumber: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Packages GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des colis" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packages: packagesData, contractId } = body;

    if (!packagesData || !Array.isArray(packagesData)) {
      return NextResponse.json(
        { error: "Liste de colis requise" },
        { status: 400 }
      );
    }

    const createdPackages = await prisma.$transaction(
      packagesData.map((pkg: any) =>
        prisma.package.create({
          data: {
            externalBarcode: pkg.externalBarcode || null,
            description: pkg.description || `Colis - ${pkg.recipientName || pkg.address}`,
            weight: pkg.weight ? parseFloat(pkg.weight) : null,
            contractId: contractId || null,
          },
        })
      )
    );

    return NextResponse.json(
      { created: createdPackages.length, packages: createdPackages },
      { status: 201 }
    );
  } catch (error) {
    console.error("Packages POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création des colis" },
      { status: 500 }
    );
  }
}
