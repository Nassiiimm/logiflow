import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { orders: true, inventory: true } },
      },
    });

    return NextResponse.json(
      warehouses.map((w) => ({
        ...w,
        ordersCount: w._count.orders,
        itemsInStock: w._count.inventory,
      }))
    );
  } catch (error) {
    console.error("Warehouses GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des entrepôts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, city, postalCode, phone, email, capacity } = body;

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        address,
        city,
        postalCode,
        phone,
        email,
        capacity: capacity ? parseFloat(capacity) : null,
      },
    });

    return NextResponse.json(warehouse, { status: 201 });
  } catch (error) {
    console.error("Warehouses POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'entrepôt" },
      { status: 500 }
    );
  }
}
