import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true, company: true } },
        items: true,
      },
    });

    return NextResponse.json(
      invoices.map((i) => ({
        id: i.id,
        invoiceNumber: i.invoiceNumber,
        customer: i.customer.name,
        company: i.customer.company,
        issueDate: i.issueDate,
        dueDate: i.dueDate,
        subtotal: i.subtotal,
        taxRate: i.taxRate,
        taxAmount: i.taxAmount,
        total: i.total,
        status: i.status,
        ordersCount: i.items.length,
      }))
    );
  } catch (error) {
    console.error("Invoices GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des factures" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, createdById, dueDate, taxRate, notes, orderIds } = body;

    if (!customerId || !createdById) {
      return NextResponse.json(
        { error: "Customer ID et Creator ID sont requis" },
        { status: 400 }
      );
    }

    // Get customer orders to calculate totals
    const orders = await prisma.order.findMany({
      where: {
        id: { in: orderIds || [] },
        customerId,
      },
    });

    const subtotal = orders.reduce((acc, o) => acc + (o.price || 0), 0);
    const taxAmount = subtotal * ((taxRate || 20) / 100);
    const total = subtotal + taxAmount;

    // Generate invoice number
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const invoiceNumber = `INV-${yearMonth}-${randomSuffix}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customer: { connect: { id: customerId } },
        createdBy: { connect: { id: createdById } },
        issueDate: new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 86400000),
        subtotal,
        taxRate: taxRate || 20,
        taxAmount,
        total,
        notes,
        items: {
          create: orders.map((order) => ({
            description: `Commande ${order.trackingNumber}`,
            quantity: 1,
            unitPrice: order.price || 0,
            total: order.price || 0,
          })),
        },
      },
      include: {
        customer: { select: { name: true } },
        items: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Invoices POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la facture" },
      { status: 500 }
    );
  }
}
