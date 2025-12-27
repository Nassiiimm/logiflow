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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Loader2, Building2, Package, Route } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface Contract {
  id: string;
  name: string;
  code: string;
  type: "SUBCONTRACTOR" | "DIRECT";
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  city: string | null;
  ratePerStop: number | null;
  ratePerPackage: number | null;
  ratePerKm: number | null;
  isActive: boolean;
  _count: {
    routes: number;
    packages: number;
  };
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: "",
    name: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "SUBCONTRACTOR",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    ratePerStop: "",
    ratePerPackage: "",
    ratePerKm: "",
  });

  useEffect(() => {
    fetchContracts();
  }, [searchTerm, typeFilter]);

  async function fetchContracts() {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (typeFilter !== "all") params.set("type", typeFilter);

      const res = await fetch(`/api/contracts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setContracts(data);
      }
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      code: "",
      type: "SUBCONTRACTOR",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      city: "",
      postalCode: "",
      notes: "",
      ratePerStop: "",
      ratePerPackage: "",
      ratePerKm: "",
    });
    setEditingContract(null);
  }

  function openEditDialog(contract: Contract) {
    setEditingContract(contract);
    setFormData({
      name: contract.name,
      code: contract.code,
      type: contract.type,
      contactName: contract.contactName || "",
      contactEmail: contract.contactEmail || "",
      contactPhone: contract.contactPhone || "",
      address: contract.address || "",
      city: contract.city || "",
      postalCode: "",
      notes: "",
      ratePerStop: contract.ratePerStop?.toString() || "",
      ratePerPackage: contract.ratePerPackage?.toString() || "",
      ratePerKm: contract.ratePerKm?.toString() || "",
    });
    setIsCreateDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingContract
        ? `/api/contracts/${editingContract.id}`
        : "/api/contracts";
      const method = editingContract ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingContract ? "Contrat mis a jour" : "Contrat cree avec succes");
        setIsCreateDialogOpen(false);
        resetForm();
        fetchContracts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde du contrat");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/contracts/${deleteDialog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.softDeleted) {
          toast.success("Contrat desactive (routes existantes)");
        } else {
          toast.success("Contrat supprime");
        }
        fetchContracts();
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
    total: contracts.length,
    subcontractors: contracts.filter((c) => c.type === "SUBCONTRACTOR").length,
    direct: contracts.filter((c) => c.type === "DIRECT").length,
    totalRoutes: contracts.reduce((acc, c) => acc + c._count.routes, 0),
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Contrats" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Total contrats</p>
            <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Sous-traitance</p>
            <p className="text-2xl font-bold text-orange-400">{stats.subcontractors}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Clients directs</p>
            <p className="text-2xl font-bold text-cyan-400">{stats.direct}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Total routes</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.totalRoutes}</p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Rechercher par nom ou code..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="SUBCONTRACTOR">Sous-traitance</SelectItem>
                <SelectItem value="DIRECT">Client direct</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau contrat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingContract ? "Modifier le contrat" : "Creer un contrat"}
                </DialogTitle>
                <DialogDescription>
                  {editingContract
                    ? "Modifiez les informations du contrat"
                    : "Ajoutez un nouveau contrat de sous-traitance ou client direct"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Nom du contrat</Label>
                    <Input
                      placeholder="Ex: Amazon Logistics"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input
                      placeholder="Ex: AMZN"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Type de contrat</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUBCONTRACTOR">Sous-traitance</SelectItem>
                      <SelectItem value="DIRECT">Client direct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Contact</Label>
                    <Input
                      placeholder="Nom du contact"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="email@exemple.com"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telephone</Label>
                    <Input
                      placeholder="06 12 34 56 78"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input
                      placeholder="Adresse"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input
                      placeholder="Ville"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <Label className="text-base font-semibold">Tarification</Label>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-500">Par stop (EUR)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.ratePerStop}
                        onChange={(e) => setFormData({ ...formData, ratePerStop: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-500">Par colis (EUR)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.ratePerPackage}
                        onChange={(e) => setFormData({ ...formData, ratePerPackage: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-500">Par km (EUR)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.ratePerKm}
                        onChange={(e) => setFormData({ ...formData, ratePerKm: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingContract ? "Mettre a jour" : "Creer le contrat"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contracts table */}
        <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Contrat</TableHead>
                  <TableHead className="text-zinc-400">Type</TableHead>
                  <TableHead className="text-zinc-400">Contact</TableHead>
                  <TableHead className="text-zinc-400">Tarification</TableHead>
                  <TableHead className="text-zinc-400">Routes</TableHead>
                  <TableHead className="text-zinc-400">Colis</TableHead>
                  <TableHead className="text-right text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-200">{contract.name}</p>
                          <p className="text-sm text-zinc-500">{contract.code}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          contract.type === "SUBCONTRACTOR"
                            ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                            : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                        }
                      >
                        {contract.type === "SUBCONTRACTOR" ? "Sous-traitance" : "Client direct"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {contract.contactName && <p className="text-zinc-300">{contract.contactName}</p>}
                        {contract.contactEmail && (
                          <p className="text-zinc-500">{contract.contactEmail}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1 text-zinc-300">
                        {contract.ratePerStop && (
                          <p>{formatCurrency(contract.ratePerStop)}/stop</p>
                        )}
                        {contract.ratePerPackage && (
                          <p>{formatCurrency(contract.ratePerPackage)}/colis</p>
                        )}
                        {contract.ratePerKm && (
                          <p>{formatCurrency(contract.ratePerKm)}/km</p>
                        )}
                        {!contract.ratePerStop && !contract.ratePerPackage && !contract.ratePerKm && (
                          <p className="text-zinc-500">Non defini</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-zinc-300">
                        <Route className="h-4 w-4 text-zinc-500" />
                        <span>{contract._count.routes}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-zinc-300">
                        <Package className="h-4 w-4 text-zinc-500" />
                        <span>{contract._count.packages}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                          onClick={() => openEditDialog(contract)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => setDeleteDialog({
                            open: true,
                            id: contract.id,
                            name: contract.name,
                          })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {contracts.length === 0 && (
                  <TableRow className="border-zinc-800/50">
                    <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                      Aucun contrat trouve
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
              Etes-vous sur de vouloir supprimer le contrat <strong>{deleteDialog.name}</strong> ?
              Si le contrat a des routes, il sera desactive au lieu d etre supprime.
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
