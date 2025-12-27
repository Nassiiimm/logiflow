"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Search, Warehouse, MapPin, Package, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WarehouseData {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  capacity: number | null;
  currentStock: number | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  ordersCount: number;
  itemsInStock: number;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: "",
    name: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    capacity: "",
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  async function fetchWarehouses() {
    try {
      const res = await fetch("/api/warehouses");
      if (res.ok) {
        const data = await res.json();
        setWarehouses(data);
      }
    } catch (error) {
      console.error("Failed to fetch warehouses:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/warehouses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Entrepot cree avec succes");
        setIsDialogOpen(false);
        setFormData({
          name: "",
          address: "",
          city: "",
          postalCode: "",
          phone: "",
          email: "",
          capacity: "",
        });
        fetchWarehouses();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation de l'entrepot");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/warehouses/${deleteDialog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.softDeleted) {
          toast.success("Entrepot desactive (donnees existantes)");
        } else {
          toast.success("Entrepot supprime");
        }
        fetchWarehouses();
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

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOccupancyColor = (current: number | null, capacity: number | null) => {
    if (!current || !capacity) return "bg-zinc-600";
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    return "bg-emerald-500";
  };

  const getOccupancyPercentage = (current: number | null, capacity: number | null) => {
    if (!current || !capacity) return 0;
    return Math.round((current / capacity) * 100);
  };

  const stats = {
    total: warehouses.length,
    active: warehouses.filter((w) => w.isActive).length,
    totalItems: warehouses.reduce((acc, w) => acc + (w.itemsInStock || 0), 0),
    totalCapacity: warehouses.reduce((acc, w) => acc + (w.capacity || 0), 0),
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Entrepots" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cyan-500/20 p-2">
                <Warehouse className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total entrepots</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/20 p-2">
                <Warehouse className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Actifs</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-violet-500/20 p-2">
                <Package className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Articles en stock</p>
                <p className="text-2xl font-bold text-violet-400">
                  {stats.totalItems.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-500/20 p-2">
                <Package className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Capacite totale</p>
                <p className="text-2xl font-bold text-orange-400">
                  {stats.totalCapacity.toLocaleString()} m3
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Rechercher un entrepot..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un entrepot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un entrepot</DialogTitle>
                <DialogDescription>
                  Enregistrez un nouvel entrepot
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom de l entrepot</Label>
                  <Input
                    placeholder="Entrepot Paris Est"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input
                    placeholder="Zone Industrielle"
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
                      placeholder="75000"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Telephone</Label>
                    <Input
                      placeholder="01 23 45 67 89"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacite (m3)</Label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="entrepot@logiflow.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !formData.name || !formData.address || !formData.city || !formData.postalCode}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Ajouter
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Warehouses grid */}
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWarehouses.map((warehouse) => (
              <Card key={warehouse.id} className="relative bg-[#12121a] border-zinc-800/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-zinc-100">{warehouse.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-zinc-500 mt-1">
                        <MapPin className="h-4 w-4" />
                        {warehouse.city}, {warehouse.postalCode}
                      </div>
                    </div>
                    <Badge
                      className={
                        warehouse.isActive
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20"
                      }
                    >
                      {warehouse.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Occupancy bar */}
                  {warehouse.capacity && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-500">Occupation</span>
                        <span className="font-medium text-zinc-300">
                          {getOccupancyPercentage(warehouse.currentStock, warehouse.capacity)}%
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getOccupancyColor(warehouse.currentStock, warehouse.capacity)}`}
                          style={{
                            width: `${getOccupancyPercentage(warehouse.currentStock, warehouse.capacity)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500 mt-1">
                        <span>{(warehouse.currentStock || 0).toLocaleString()} m3</span>
                        <span>{warehouse.capacity.toLocaleString()} m3</span>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
                    <div>
                      <p className="text-xs text-zinc-500">Commandes</p>
                      <p className="text-lg font-semibold text-zinc-200">{warehouse.ordersCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Articles en stock</p>
                      <p className="text-lg font-semibold text-zinc-200">{warehouse.itemsInStock}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 border-zinc-700 hover:bg-zinc-800">
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 hover:text-red-300 border-zinc-700 hover:bg-red-500/10"
                      onClick={() => setDeleteDialog({
                        open: true,
                        id: warehouse.id,
                        name: warehouse.name,
                      })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredWarehouses.length === 0 && (
              <div className="col-span-full text-center py-8 text-zinc-500">
                Aucun entrepot trouve
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer l entrepot <strong>{deleteDialog.name}</strong> ?
              Si l entrepot contient des donnees, il sera desactive au lieu d etre supprime.
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
