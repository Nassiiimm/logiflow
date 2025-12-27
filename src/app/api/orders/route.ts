import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateTrackingNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const customerId = searchParams.get("customerId");

    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (search) {
      where.OR = [
        { trackingNumber: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true } },
        driver: { select: { user: { select: { name: true } } } },
        vehicle: { select: { plateNumber: true } },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const {
      customerId,
      priority,
      pickupAddress,
      pickupCity,
      pickupPostalCode,
      deliveryAddress,
      deliveryCity,
      deliveryPostalCode,
      weight,
      price,
      specialInstructions,
    } = body;

    const order = await prisma.order.create({
      data: {
        trackingNumber: generateTrackingNumber(),
        customerId,
        createdById: session.user.id,
        priority: priority || "NORMAL",
        pickupAddress,
        pickupCity,
        pickupPostalCode,
        deliveryAddress,
        deliveryCity,
        deliveryPostalCode,
        weight: weight ? parseFloat(weight) : null,
        price: price ? parseFloat(price) : 0,
        specialInstructions,
        trackingEvents: {
          create: {
            type: "ORDER_CREATED",
            description: "Commande créée",
            location: pickupCity,
          },
        },
      },
      include: {
        customer: { select: { name: true } },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}
