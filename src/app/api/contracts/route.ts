import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const type = searchParams.get("type");

    const contracts = await prisma.contract.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { code: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          type ? { type: type as "SUBCONTRACTOR" | "DIRECT" } : {},
          { isActive: true },
        ],
      },
      include: {
        _count: {
          select: {
            routes: true,
            packages: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("Contracts GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des contrats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
    } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: "Le nom et le code sont requis" },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existing = await prisma.contract.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ce code de contrat existe déjà" },
        { status: 400 }
      );
    }

    const contract = await prisma.contract.create({
      data: {
        name,
        type: type || "SUBCONTRACTOR",
        code: code.toUpperCase(),
        contactName,
        contactEmail,
        contactPhone,
        address,
        city,
        postalCode,
        notes,
        ratePerStop: ratePerStop ? parseFloat(ratePerStop) : null,
        ratePerPackage: ratePerPackage ? parseFloat(ratePerPackage) : null,
        ratePerKm: ratePerKm ? parseFloat(ratePerKm) : null,
      },
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error("Contracts POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du contrat" },
      { status: 500 }
    );
  }
}
