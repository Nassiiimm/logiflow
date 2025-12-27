import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: {
        inventory: true,
        _count: { select: { orders: true, inventory: true } },
      },
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: "Entrepôt non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(warehouse);
  } catch (error) {
    console.error("Warehouse GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'entrepôt" },
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
    const { name, address, city, postalCode, phone, email, capacity, isActive } = body;

    const warehouse = await prisma.warehouse.update({
      where: { id },
      data: {
        name,
        address,
        city,
        postalCode,
        phone,
        email,
        capacity: capacity ? parseFloat(capacity) : null,
        isActive,
      },
    });

    return NextResponse.json(warehouse);
  } catch (error) {
    console.error("Warehouse PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'entrepôt" },
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

    // Check if warehouse has inventory or orders
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: { _count: { select: { orders: true, inventory: true } } },
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: "Entrepôt non trouvé" },
        { status: 404 }
      );
    }

    if (warehouse._count.orders > 0 || warehouse._count.inventory > 0) {
      // Soft delete - mark as inactive
      await prisma.warehouse.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, softDeleted: true });
    }

    await prisma.warehouse.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Warehouse DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'entrepôt" },
      { status: 500 }
    );
  }
}
