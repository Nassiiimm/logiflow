"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0891b2",
  },
  logoSubtitle: {
    fontSize: 10,
    color: "#71717a",
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#18181b",
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#71717a",
    textAlign: "right",
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#71717a",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    color: "#71717a",
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    color: "#18181b",
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f5",
    padding: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#71717a",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
  },
  tableCell: {
    fontSize: 10,
    color: "#18181b",
  },
  colDescription: { width: "50%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "17.5%", textAlign: "right" },
  colTotal: { width: "17.5%", textAlign: "right" },
  totalsSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 6,
    width: 250,
  },
  totalLabel: {
    fontSize: 10,
    color: "#71717a",
    width: 120,
  },
  totalValue: {
    fontSize: 10,
    color: "#18181b",
    width: 130,
    textAlign: "right",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#18181b",
    width: 250,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#18181b",
    width: 120,
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0891b2",
    width: 130,
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#a1a1aa",
    fontSize: 9,
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 20,
  },
  statusBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "4 8",
    borderRadius: 4,
    fontSize: 9,
    fontWeight: "bold",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  statusOverdue: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
});

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  customer: {
    name: string;
    company?: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getStatusStyle(status: string) {
  switch (status) {
    case "PAID":
      return styles.statusBadge;
    case "OVERDUE":
      return { ...styles.statusBadge, ...styles.statusOverdue };
    default:
      return { ...styles.statusBadge, ...styles.statusPending };
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "DRAFT": return "Brouillon";
    case "SENT": return "Envoyee";
    case "PAID": return "Payee";
    case "OVERDUE": return "En retard";
    case "CANCELLED": return "Annulee";
    default: return status;
  }
}

export function InvoicePDF({ invoice }: { invoice: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>LogiFlow</Text>
            <Text style={styles.logoSubtitle}>Gestion Logistique</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        {/* Billing Info */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Emetteur</Text>
            <Text style={styles.value}>{invoice.company.name}</Text>
            <Text style={styles.value}>{invoice.company.address}</Text>
            <Text style={styles.value}>{invoice.company.phone}</Text>
            <Text style={styles.value}>{invoice.company.email}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Facturer a</Text>
            <Text style={styles.value}>{invoice.customer.name}</Text>
            {invoice.customer.company && (
              <Text style={styles.value}>{invoice.customer.company}</Text>
            )}
            <Text style={styles.value}>{invoice.customer.address}</Text>
            <Text style={styles.value}>
              {invoice.customer.postalCode} {invoice.customer.city}
            </Text>
            <Text style={styles.value}>{invoice.customer.email}</Text>
          </View>
        </View>

        {/* Dates & Status */}
        <View style={styles.row}>
          <View style={{ flexDirection: "row", gap: 40 }}>
            <View>
              <Text style={styles.label}>Date d'emission</Text>
              <Text style={styles.value}>{formatDate(invoice.issueDate)}</Text>
            </View>
            <View>
              <Text style={styles.label}>Date d'echeance</Text>
              <Text style={styles.value}>{formatDate(invoice.dueDate)}</Text>
            </View>
            <View>
              <Text style={styles.label}>Statut</Text>
              <Text style={getStatusStyle(invoice.status)}>
                {getStatusLabel(invoice.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qte</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>
              Prix unit.
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
          </View>
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colDescription]}>
                {item.description}
              </Text>
              <Text style={[styles.tableCell, styles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCell, styles.colPrice]}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={[styles.tableCell, styles.colTotal]}>
                {formatCurrency(item.total)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total HT</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.subtotal)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA ({invoice.taxRate}%)</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.taxAmount)}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total TTC</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(invoice.total)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={[styles.section, { marginTop: 30 }]}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.value}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            {invoice.company.name} - {invoice.company.address} -{" "}
            {invoice.company.email}
          </Text>
          <Text style={{ marginTop: 4 }}>
            Merci pour votre confiance !
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export type { InvoiceData, InvoiceItem };
