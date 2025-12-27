import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        driver: {
          include: { user: { select: { name: true } } },
        },
        vehicle: true,
        packages: true,
        trackingEvents: {
          orderBy: { timestamp: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la commande" },
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
      status,
      priority,
      driverId,
      vehicleId,
      deliveryAddress,
      deliveryCity,
      deliveryPostalCode,
      specialInstructions,
      estimatedDelivery,
    } = body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        priority,
        driverId,
        vehicleId,
        deliveryAddress,
        deliveryCity,
        deliveryPostalCode,
        specialInstructions,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      },
    });

    // Add tracking event if status changed
    if (status) {
      await prisma.trackingEvent.create({
        data: {
          orderId: id,
          type: status,
          description: getStatusDescription(status),
          location: order.deliveryCity,
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la commande" },
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

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    // Only allow deletion of pending orders
    if (order.status !== "PENDING") {
      // Cancel instead of delete
      await prisma.order.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      await prisma.trackingEvent.create({
        data: {
          orderId: id,
          type: "CANCELLED",
          description: "Commande annulée",
        },
      });

      return NextResponse.json({ success: true, cancelled: true });
    }

    // Delete tracking events first
    await prisma.trackingEvent.deleteMany({
      where: { orderId: id },
    });

    // Delete packages
    await prisma.package.deleteMany({
      where: { orderId: id },
    });

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la commande" },
      { status: 500 }
    );
  }
}

function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    PENDING: "Commande en attente",
    CONFIRMED: "Commande confirmée",
    PICKED_UP: "Colis récupéré",
    IN_TRANSIT: "En transit",
    OUT_FOR_DELIVERY: "En cours de livraison",
    DELIVERED: "Livré",
    CANCELLED: "Commande annulée",
    RETURNED: "Retourné",
  };
  return descriptions[status] || status;
}
