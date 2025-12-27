"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Eye, Download, Send, FileText, Euro, Loader2 } from "lucide-react";
import { getStatusColor, getStatusLabel, formatDate, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { InvoicePDF, type InvoiceData } from "@/components/pdf/invoice-pdf";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  company: string | null;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: string;
  ordersCount: number;
}

interface Customer {
  id: string;
  name: string;
  company: string | null;
}

interface Order {
  id: string;
  trackingNumber: string;
  price: number;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerId: "",
    dueDate: "",
    taxRate: "20",
    notes: "",
  });

  async function handleDownloadPDF(invoiceId: string, invoiceNumber: string) {
    setDownloadingId(invoiceId);
    try {
      // Fetch invoice details
      const res = await fetch(`/api/invoices/${invoiceId}`);
      if (!res.ok) throw new Error("Failed to fetch invoice");
      const invoiceData: InvoiceData = await res.json();

      // Dynamic import to avoid SSR issues
      const { pdf } = await import("@react-pdf/renderer");

      // Generate PDF blob
      const blob = await pdf(<InvoicePDF invoice={invoiceData} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Facture telechargee");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Erreur lors du telechargement");
    } finally {
      setDownloadingId(null);
    }
  }

  useEffect(() => {
    fetchData();
  }, [statusFilter, searchTerm]);

  async function fetchData() {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchTerm) params.set("search", searchTerm);

      const [invoicesRes, customersRes] = await Promise.all([
        fetch(`/api/invoices?${params}`),
        fetch("/api/customers"),
      ]);

      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json();
        setInvoices(invoicesData);
      }
      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomerOrders(customerId: string) {
    try {
      const res = await fetch(`/api/orders?customerId=${customerId}&status=DELIVERED`);
      if (res.ok) {
        const data = await res.json();
        setCustomerOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch customer orders:", error);
    }
  }

  function handleCustomerChange(customerId: string) {
    setFormData({ ...formData, customerId });
    setSelectedOrders([]);
    if (customerId) {
      fetchCustomerOrders(customerId);
    } else {
      setCustomerOrders([]);
    }
  }

  function toggleOrderSelection(orderId: string) {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          orderIds: selectedOrders,
        }),
      });

      if (res.ok) {
        toast.success("Facture creee avec succes");
        setIsDialogOpen(false);
        setFormData({
          customerId: "",
          dueDate: "",
          taxRate: "20",
          notes: "",
        });
        setSelectedOrders([]);
        setCustomerOrders([]);
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation de la facture");
    } finally {
      setIsSubmitting(false);
    }
  }

  const stats = {
    total: invoices.length,
    totalPaid: invoices
      .filter((i) => i.status === "PAID")
      .reduce((acc, i) => acc + i.total, 0),
    totalPending: invoices
      .filter((i) => i.status === "SENT")
      .reduce((acc, i) => acc + i.total, 0),
    totalOverdue: invoices
      .filter((i) => i.status === "OVERDUE")
      .reduce((acc, i) => acc + i.total, 0),
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Facturation" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cyan-500/20 p-2">
                <FileText className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total factures</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/20 p-2">
                <Euro className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Encaisse</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(stats.totalPaid)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cyan-500/20 p-2">
                <Euro className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">En attente</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {formatCurrency(stats.totalPending)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-500/20 p-2">
                <Euro className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">En retard</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(stats.totalOverdue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Rechercher par numero ou client..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="DRAFT">Brouillon</SelectItem>
                <SelectItem value="SENT">Envoyee</SelectItem>
                <SelectItem value="PAID">Payee</SelectItem>
                <SelectItem value="OVERDUE">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle facture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Creer une facture</DialogTitle>
                <DialogDescription>
                  Selectionnez un client et les commandes a facturer
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={handleCustomerChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} {c.company && `(${c.company})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date d emission</Label>
                    <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Date d echeance</Label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Commandes a inclure</Label>
                  <div className="border border-zinc-700 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto bg-zinc-900/50">
                    {customerOrders.length === 0 ? (
                      <p className="text-sm text-zinc-500">
                        {formData.customerId
                          ? "Aucune commande livree pour ce client"
                          : "Selectionnez d'abord un client"}
                      </p>
                    ) : (
                      customerOrders.map((order) => (
                        <label key={order.id} className="flex items-center gap-2 text-zinc-300">
                          <input
                            type="checkbox"
                            className="rounded bg-zinc-800 border-zinc-600"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => toggleOrderSelection(order.id)}
                          />
                          <span>
                            {order.trackingNumber} - {formatCurrency(order.price)}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Taux TVA (%)</Label>
                    <Input
                      type="number"
                      value={formData.taxRate}
                      onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      placeholder="Optionnel"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !formData.customerId || selectedOrders.length === 0}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Creer la facture
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Invoices table */}
        <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="text-zinc-400">N Facture</TableHead>
                  <TableHead className="text-zinc-400">Client</TableHead>
                  <TableHead className="text-zinc-400">Date emission</TableHead>
                  <TableHead className="text-zinc-400">Echeance</TableHead>
                  <TableHead className="text-zinc-400">Commandes</TableHead>
                  <TableHead className="text-zinc-400">Montant HT</TableHead>
                  <TableHead className="text-zinc-400">TVA</TableHead>
                  <TableHead className="text-zinc-400">Total TTC</TableHead>
                  <TableHead className="text-zinc-400">Statut</TableHead>
                  <TableHead className="text-right text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                    <TableCell className="font-medium text-zinc-200">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-zinc-200">{invoice.customer}</p>
                        {invoice.company && (
                          <p className="text-sm text-zinc-500">{invoice.company}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {formatDate(invoice.issueDate)}
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {formatDate(invoice.dueDate)}
                    </TableCell>
                    <TableCell className="text-zinc-300">{invoice.ordersCount}</TableCell>
                    <TableCell className="text-zinc-300">{formatCurrency(invoice.subtotal)}</TableCell>
                    <TableCell className="text-zinc-300">{formatCurrency(invoice.taxAmount)}</TableCell>
                    <TableCell className="font-semibold text-zinc-200">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Voir" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Telecharger PDF"
                          className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                          onClick={() => handleDownloadPDF(invoice.id, invoice.invoiceNumber)}
                          disabled={downloadingId === invoice.id}
                        >
                          {downloadingId === invoice.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                        {invoice.status === "DRAFT" && (
                          <Button variant="ghost" size="icon" title="Envoyer" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow className="border-zinc-800/50">
                    <TableCell colSpan={10} className="text-center py-8 text-zinc-500">
                      Aucune facture trouvee
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
