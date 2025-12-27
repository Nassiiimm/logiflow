"use client";

import { useState, useEffect } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Mail, Phone, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string;
  city: string;
  postalCode: string;
  ordersCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: "",
    name: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  async function fetchCustomers() {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);

      const res = await fetch(`/api/customers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Client cree avec succes");
        setIsCreateDialogOpen(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          address: "",
          city: "",
          postalCode: "",
          notes: "",
        });
        fetchCustomers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation du client");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/customers/${deleteDialog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.softDeleted) {
          toast.success("Client desactive (commandes existantes)");
        } else {
          toast.success("Client supprime");
        }
        fetchCustomers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteDialog({ open: false, id: "", name: "" });
    }
  }

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.isActive).length,
    companies: customers.filter((c) => c.company).length,
    totalOrders: customers.reduce((acc, c) => acc + c.ordersCount, 0),
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Clients" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Total clients</p>
            <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Clients actifs</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Entreprises</p>
            <p className="text-2xl font-bold text-cyan-400">{stats.companies}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Total commandes</p>
            <p className="text-2xl font-bold text-violet-400">{stats.totalOrders}</p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Rechercher par nom, email ou entreprise..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Ajouter un client</DialogTitle>
                <DialogDescription>
                  Remplissez les informations du nouveau client
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom complet</Label>
                    <Input
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Entreprise</Label>
                    <Input
                      placeholder="Optionnel"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="email@exemple.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telephone</Label>
                    <Input
                      placeholder="06 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input
                    placeholder="Adresse complete"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input
                      placeholder="Paris"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Code postal</Label>
                    <Input
                      placeholder="75001"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Notes sur le client..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Ajouter le client
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Customers table */}
        <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Client</TableHead>
                  <TableHead className="text-zinc-400">Contact</TableHead>
                  <TableHead className="text-zinc-400">Adresse</TableHead>
                  <TableHead className="text-zinc-400">Commandes</TableHead>
                  <TableHead className="text-zinc-400">Statut</TableHead>
                  <TableHead className="text-zinc-400">Inscription</TableHead>
                  <TableHead className="text-right text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-zinc-200">{customer.name}</p>
                        {customer.company && (
                          <p className="text-sm text-zinc-500">{customer.company}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-zinc-300">
                          <Mail className="h-3 w-3 text-zinc-500" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1 text-sm text-zinc-500">
                            <Phone className="h-3 w-3 text-zinc-500" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-zinc-300">{customer.address}</p>
                        <p className="text-zinc-500">
                          {customer.postalCode} {customer.city}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-zinc-200">{customer.ordersCount}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          customer.isActive
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                            : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20"
                        }
                      >
                        {customer.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {formatDate(customer.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => setDeleteDialog({
                            open: true,
                            id: customer.id,
                            name: customer.name,
                          })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {customers.length === 0 && (
                  <TableRow className="border-zinc-800/50">
                    <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                      Aucun client trouve
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer le client <strong>{deleteDialog.name}</strong> ?
              Si le client a des commandes, il sera desactive au lieu d etre supprime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
