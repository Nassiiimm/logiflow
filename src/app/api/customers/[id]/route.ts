import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { orders: true, invoices: true } },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Client non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Customer GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du client" },
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
    const { name, email, phone, company, address, city, postalCode, notes, isActive } = body;

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        company,
        address,
        city,
        postalCode,
        notes,
        isActive,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Customer PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du client" },
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

    // Check if customer has orders
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { _count: { select: { orders: true } } },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Client non trouvé" },
        { status: 404 }
      );
    }

    if (customer._count.orders > 0) {
      // Soft delete - mark as inactive
      await prisma.customer.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, softDeleted: true });
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du client" },
      { status: 500 }
    );
  }
}
