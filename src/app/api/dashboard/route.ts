import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      ordersToday,
      ordersInTransit,
      ordersDeliveredToday,
      ordersPending,
      totalVehicles,
      vehiclesAvailable,
      vehiclesMaintenance,
      totalCustomers,
      totalDrivers,
      recentOrders,
      ordersThisWeek,
    ] = await Promise.all([
      // Commandes du jour
      prisma.order.count({
        where: { createdAt: { gte: today } },
      }),
      // En transit
      prisma.order.count({
        where: { status: { in: ["IN_TRANSIT", "OUT_FOR_DELIVERY"] } },
      }),
      // Livrées aujourd'hui
      prisma.order.count({
        where: {
          status: "DELIVERED",
          actualDelivery: { gte: today },
        },
      }),
      // En attente
      prisma.order.count({
        where: { status: "PENDING" },
      }),
      // Total véhicules
      prisma.vehicle.count({ where: { isActive: true } }),
      // Véhicules disponibles
      prisma.vehicle.count({ where: { status: "AVAILABLE", isActive: true } }),
      // En maintenance
      prisma.vehicle.count({ where: { status: "MAINTENANCE" } }),
      // Total clients
      prisma.customer.count({ where: { isActive: true } }),
      // Total chauffeurs
      prisma.driver.count(),
      // Commandes récentes
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { name: true } },
        },
      }),
      // Commandes de la semaine pour le graphique
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          createdAt: true,
          status: true,
        },
      }),
    ]);

    // Calculer les stats par jour pour le graphique
    const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = ordersThisWeek.filter(
        (o) => o.createdAt >= date && o.createdAt < nextDate
      );
      const dayDelivered = dayOrders.filter((o) => o.status === "DELIVERED");

      chartData.push({
        name: weekDays[date.getDay()],
        commandes: dayOrders.length,
        livraisons: dayDelivered.length,
      });
    }

    return NextResponse.json({
      stats: {
        ordersToday,
        ordersInTransit,
        ordersDeliveredToday,
        ordersPending,
        totalVehicles,
        vehiclesAvailable,
        vehiclesMaintenance,
        totalCustomers,
        totalDrivers,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        trackingNumber: order.trackingNumber,
        customer: order.customer.name,
        destination: `${order.deliveryCity}, ${order.deliveryPostalCode}`,
        status: order.status,
        date: order.createdAt,
      })),
      chartData,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
