import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const contractId = searchParams.get("contractId");
    const driverId = searchParams.get("driverId");
    const date = searchParams.get("date");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where = {
      AND: [
        search
          ? {
              OR: [
                { routeNumber: { contains: search, mode: "insensitive" as const } },
                { name: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {},
        status ? { status: status as any } : {},
        contractId ? { contractId } : {},
        driverId ? { driverId } : {},
        date
          ? {
              scheduledDate: {
                gte: new Date(date),
                lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
              },
            }
          : {},
      ],
    };

    const [routes, totalCount] = await Promise.all([
      prisma.route.findMany({
        where,
        include: {
          contract: {
            select: { name: true, code: true },
          },
          driver: {
            include: {
              user: { select: { name: true } },
            },
          },
          vehicle: {
            select: { plateNumber: true, type: true },
          },
          _count: {
            select: { stops: true },
          },
        },
        orderBy: { scheduledDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.route.count({ where }),
    ]);

    return NextResponse.json({
      data: routes,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Routes GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des routes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      scheduledDate,
      contractId,
      driverId,
      vehicleId,
      createdById,
      notes,
    } = body;

    if (!scheduledDate || !createdById) {
      return NextResponse.json(
        { error: "La date et le créateur sont requis" },
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

    const route = await prisma.route.create({
      data: {
        routeNumber,
        name,
        scheduledDate: new Date(scheduledDate),
        contractId,
        driverId,
        vehicleId,
        createdById,
        notes,
      },
      include: {
        contract: { select: { name: true, code: true } },
        driver: {
          include: { user: { select: { name: true } } },
        },
        vehicle: { select: { plateNumber: true } },
      },
    });

    return NextResponse.json(route, { status: 201 });
  } catch (error) {
    console.error("Routes POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la route" },
      { status: 500 }
    );
  }
}
