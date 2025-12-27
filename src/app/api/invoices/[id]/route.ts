import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
        createdBy: {
          select: { name: true, email: true },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Facture non trouvee" },
        { status: 404 }
      );
    }

    // Format for PDF generation
    const invoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      issueDate: invoice.issueDate.toISOString(),
      dueDate: invoice.dueDate.toISOString(),
      customer: {
        name: invoice.customer.name,
        company: invoice.customer.company,
        email: invoice.customer.email,
        address: invoice.customer.address || "",
        city: invoice.customer.city || "",
        postalCode: invoice.customer.postalCode || "",
      },
      company: {
        name: "LogiFlow",
        address: "123 Avenue de la Logistique, 75001 Paris",
        phone: "+33 1 23 45 67 89",
        email: "contact@logiflow.fr",
      },
      items: invoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      subtotal: invoice.subtotal,
      taxRate: invoice.taxRate,
      taxAmount: invoice.taxAmount,
      total: invoice.total,
      notes: invoice.notes,
    };

    return NextResponse.json(invoiceData);
  } catch (error) {
    console.error("Invoice GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation de la facture" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Invoice PATCH error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour de la facture" },
      { status: 500 }
    );
  }
}
