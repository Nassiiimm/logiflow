import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        routes: {
          orderBy: { scheduledDate: "desc" },
          take: 10,
        },
        _count: {
          select: {
            routes: true,
            packages: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contrat non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error("Contract GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du contrat" },
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
      name,
      type,
      code,
      contactName,
      contactEmail,
      contactPhone,
      address,
      city,
      postalCode,
      notes,
      ratePerStop,
      ratePerPackage,
      ratePerKm,
      isActive,
    } = body;

    // Check if new code conflicts with existing
    if (code) {
      const existing = await prisma.contract.findFirst({
        where: {
          code: code.toUpperCase(),
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Ce code de contrat existe déjà" },
          { status: 400 }
        );
      }
    }

    const contract = await prisma.contract.update({
      where: { id },
      data: {
        name,
        type,
        code: code ? code.toUpperCase() : undefined,
        contactName,
        contactEmail,
        contactPhone,
        address,
        city,
        postalCode,
        notes,
        ratePerStop: ratePerStop !== undefined ? parseFloat(ratePerStop) || null : undefined,
        ratePerPackage: ratePerPackage !== undefined ? parseFloat(ratePerPackage) || null : undefined,
        ratePerKm: ratePerKm !== undefined ? parseFloat(ratePerKm) || null : undefined,
        isActive,
      },
    });

    return NextResponse.json(contract);
  } catch (error) {
    console.error("Contract PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du contrat" },
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

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            routes: true,
            packages: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contrat non trouvé" },
        { status: 404 }
      );
    }

    // Soft delete if has related data
    if (contract._count.routes > 0 || contract._count.packages > 0) {
      await prisma.contract.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, softDeleted: true });
    }

    await prisma.contract.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contract DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du contrat" },
      { status: 500 }
    );
  }
}
