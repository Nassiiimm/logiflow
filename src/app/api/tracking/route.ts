import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get("number");

    if (!trackingNumber) {
      return NextResponse.json(
        { error: "Numéro de suivi requis" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { trackingNumber: trackingNumber.toUpperCase() },
      include: {
        customer: { select: { name: true } },
        driver: {
          include: { user: { select: { name: true } } },
        },
        vehicle: { select: { plateNumber: true } },
        trackingEvents: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      trackingNumber: order.trackingNumber,
      status: order.status,
      customer: order.customer.name,
      pickupAddress: `${order.pickupAddress}, ${order.pickupPostalCode} ${order.pickupCity}`,
      deliveryAddress: `${order.deliveryAddress}, ${order.deliveryPostalCode} ${order.deliveryCity}`,
      estimatedDelivery: order.estimatedDelivery,
      driver: order.driver?.user?.name || null,
      vehicle: order.vehicle?.plateNumber || null,
      events: order.trackingEvents.map((e) => ({
        id: e.id,
        type: e.type,
        description: e.description,
        location: e.location,
        timestamp: e.timestamp,
      })),
    });
  } catch (error) {
    console.error("Tracking GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du suivi" },
      { status: 500 }
    );
  }
}
