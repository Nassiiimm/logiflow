"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
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
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Upload,
  Calendar,
  MapPin,
  Package,
  User,
  Truck,
  FileSpreadsheet,
  Play,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface Route {
  id: string;
  routeNumber: string;
  name: string | null;
  status: "DRAFT" | "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  scheduledDate: string;
  startTime: string | null;
  endTime: string | null;
  totalStops: number;
  completedStops: number;
  totalPackages: number;
  deliveredPackages: number;
  totalDistance: number | null;
  contract: { name: string; code: string } | null;
  driver: { user: { name: string } } | null;
  vehicle: { plateNumber: string; type: string } | null;
  _count: { stops: number };
}

interface Contract {
  id: string;
  name: string;
  code: string;
}

interface Driver {
  id: string;
  user: { name: string };
}

interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20" },
  PLANNED: { label: "Planifiee", color: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20" },
  IN_PROGRESS: { label: "En cours", color: "bg-amber-500/15 text-amber-400 border border-amber-500/20" },
  COMPLETED: { label: "Terminee", color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
  CANCELLED: { label: "Annulee", color: "bg-red-500/15 text-red-400 border border-red-500/20" },
};

export default function RoutesPage() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; routeNumber: string }>({
    open: false,
    id: "",
    routeNumber: "",
  });

  // Form state for new route
  const [formData, setFormData] = useState({
    name: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    contractId: "",
    driverId: "",
    vehicleId: "",
    notes: "",
  });

  // Import state
  const [importData, setImportData] = useState({
    contractId: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    driverId: "",
    vehicleId: "",
    routeName: "",
    csvData: [] as any[],
    fileName: "",
  });

  useEffect(() => {
    fetchRoutes();
    fetchContracts();
    fetchDrivers();
    fetchVehicles();
  }, [searchTerm, statusFilter, dateFilter]);

  async function fetchRoutes() {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (dateFilter) params.set("date", dateFilter);

      const res = await fetch(`/api/routes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRoutes(data);
      }
    } catch (error) {
      console.error("Failed to fetch routes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchContracts() {
    try {
      const res = await fetch("/api/contracts");
      if (res.ok) {
        const data = await res.json();
        setContracts(data);
      }
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
    }
  }

  async function fetchDrivers() {
    try {
      const res = await fetch("/api/drivers");
      if (res.ok) {
        const data = await res.json();
        setDrivers(data);
      }
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    }
  }

  async function fetchVehicles() {
    try {
      const res = await fetch("/api/vehicles");
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      scheduledDate: new Date().toISOString().split("T")[0],
      contractId: "",
      driverId: "",
      vehicleId: "",
      notes: "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          createdById: (session?.user as any)?.id,
        }),
      });

      if (res.ok) {
        toast.success("Route creee avec succes");
        setIsCreateDialogOpen(false);
        resetForm();
        fetchRoutes();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation de la route");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = parseCSV(text);
        setImportData({ ...importData, csvData: rows, fileName: file.name });
        toast.success(`${rows.length} lignes detectees`);
      } catch (error) {
        toast.error("Erreur lors de la lecture du fichier CSV");
      }
    };
    reader.readAsText(file);
  }

  function parseCSV(text: string): any[] {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: any = {};

      headers.forEach((header, index) => {
        // Map common header names
        if (header.includes("address") || header.includes("adresse")) {
          row.address = values[index];
        } else if (header.includes("city") || header.includes("ville")) {
          row.city = values[index];
        } else if (header.includes("postal") || header.includes("code")) {
          row.postalCode = values[index];
        } else if (header.includes("recipient") || header.includes("destinataire") || header.includes("nom")) {
          row.recipientName = values[index];
        } else if (header.includes("phone") || header.includes("tel")) {
          row.phone = values[index];
        } else if (header.includes("barcode") || header.includes("code-barre") || header.includes("tracking")) {
          row.externalBarcode = values[index];
        } else if (header.includes("weight") || header.includes("poids")) {
          row.weight = values[index];
        } else if (header.includes("instruction") || header.includes("note")) {
          row.instructions = values[index];
        } else if (header.includes("access") || header.includes("acces")) {
          row.accessCode = values[index];
        }
      });

      if (row.address && row.city && row.postalCode) {
        rows.push(row);
      }
    }

    return rows;
  }

  async function handleImport() {
    if (importData.csvData.length === 0) {
      toast.error("Aucune donnee a importer");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/routes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...importData,
          createdById: (session?.user as any)?.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Route importee: ${data.imported.stops} stops, ${data.imported.packages} colis`);
        setIsImportDialogOpen(false);
        setImportData({
          contractId: "",
          scheduledDate: new Date().toISOString().split("T")[0],
          driverId: "",
          vehicleId: "",
          routeName: "",
          csvData: [],
          fileName: "",
        });
        fetchRoutes();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de l'import");
      }
    } catch (error) {
      toast.error("Erreur lors de l'import de la route");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/routes/${deleteDialog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Route supprimee");
        fetchRoutes();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteDialog({ open: false, id: "", routeNumber: "" });
    }
  }

  async function handleStartRoute(routeId: string) {
    try {
      const res = await fetch(`/api/routes/${routeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "IN_PROGRESS",
          startTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        toast.success("Route demarree");
        fetchRoutes();
      }
    } catch (error) {
      toast.error("Erreur lors du demarrage");
    }
  }

  const stats = {
    total: routes.length,
    draft: routes.filter((r) => r.status === "DRAFT").length,
    inProgress: routes.filter((r) => r.status === "IN_PROGRESS").length,
    completed: routes.filter((r) => r.status === "COMPLETED").length,
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Routes" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Total routes</p>
            <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Brouillons</p>
            <p className="text-2xl font-bold text-zinc-400">{stats.draft}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">En cours</p>
            <p className="text-2xl font-bold text-amber-400">{stats.inProgress}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Terminees</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Rechercher..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="DRAFT">Brouillon</SelectItem>
                <SelectItem value="PLANNED">Planifiee</SelectItem>
                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                <SelectItem value="COMPLETED">Terminee</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="w-40"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {/* Import Dialog */}
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Importer CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Importer une route depuis CSV</DialogTitle>
                  <DialogDescription>
                    Importez un fichier CSV avec les colonnes: address, city, postalCode, recipientName, phone, barcode
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contrat</Label>
                      <Select
                        value={importData.contractId}
                        onValueChange={(v) => setImportData({ ...importData, contractId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {contracts.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name} ({c.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={importData.scheduledDate}
                        onChange={(e) => setImportData({ ...importData, scheduledDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Chauffeur</Label>
                      <Select
                        value={importData.driverId}
                        onValueChange={(v) => setImportData({ ...importData, driverId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Vehicule</Label>
                      <Select
                        value={importData.vehicleId}
                        onValueChange={(v) => setImportData({ ...importData, vehicleId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.plateNumber} - {v.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Nom de la route (optionnel)</Label>
                    <Input
                      placeholder="Ex: Route Montreal Nord - 15 Dec"
                      value={importData.routeName}
                      onChange={(e) => setImportData({ ...importData, routeName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fichier CSV</Label>
                    <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center bg-zinc-900/50">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {importData.fileName ? (
                        <div className="space-y-2">
                          <FileSpreadsheet className="mx-auto h-10 w-10 text-emerald-400" />
                          <p className="font-medium text-zinc-200">{importData.fileName}</p>
                          <p className="text-sm text-zinc-500">{importData.csvData.length} lignes</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Changer de fichier
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="mx-auto h-10 w-10 text-zinc-500" />
                          <p className="text-zinc-500">Glissez un fichier ou</p>
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Parcourir
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={isSubmitting || importData.csvData.length === 0}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Importer {importData.csvData.length} stops
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle route
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Creer une nouvelle route</DialogTitle>
                  <DialogDescription>
                    Creez une route vide et ajoutez les stops manuellement
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom de la route</Label>
                    <Input
                      placeholder="Ex: Route Montreal Nord"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contrat</Label>
                      <Select
                        value={formData.contractId}
                        onValueChange={(v) => setFormData({ ...formData, contractId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {contracts.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Chauffeur</Label>
                      <Select
                        value={formData.driverId}
                        onValueChange={(v) => setFormData({ ...formData, driverId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Vehicule</Label>
                      <Select
                        value={formData.vehicleId}
                        onValueChange={(v) => setFormData({ ...formData, vehicleId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.plateNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="Notes sur la route..."
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
                      Creer la route
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Routes table */}
        <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Route</TableHead>
                  <TableHead className="text-zinc-400">Contrat</TableHead>
                  <TableHead className="text-zinc-400">Chauffeur</TableHead>
                  <TableHead className="text-zinc-400">Stops</TableHead>
                  <TableHead className="text-zinc-400">Colis</TableHead>
                  <TableHead className="text-zinc-400">Statut</TableHead>
                  <TableHead className="text-zinc-400">Date</TableHead>
                  <TableHead className="text-right text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-zinc-200">{route.routeNumber}</p>
                        {route.name && (
                          <p className="text-sm text-zinc-500">{route.name}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {route.contract ? (
                        <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700">{route.contract.code}</Badge>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {route.driver ? (
                        <div className="flex items-center gap-2 text-zinc-300">
                          <User className="h-4 w-4 text-zinc-500" />
                          <span>{route.driver.user.name}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-500">Non assigne</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-zinc-300">
                        <MapPin className="h-4 w-4 text-zinc-500" />
                        <span>
                          {route.completedStops}/{route.totalStops}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-zinc-300">
                        <Package className="h-4 w-4 text-zinc-500" />
                        <span>
                          {route.deliveredPackages}/{route.totalPackages}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[route.status]?.color}>
                        {statusConfig[route.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Calendar className="h-4 w-4" />
                        {formatDate(route.scheduledDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {route.status === "DRAFT" && route.totalStops > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                            onClick={() => handleStartRoute(route.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Link href={`/routes/${route.id}`}>
                          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {route.status === "DRAFT" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => setDeleteDialog({
                              open: true,
                              id: route.id,
                              routeNumber: route.routeNumber,
                            })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {routes.length === 0 && (
                  <TableRow className="border-zinc-800/50">
                    <TableCell colSpan={8} className="text-center py-8 text-zinc-500">
                      Aucune route trouvee
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
              Etes-vous sur de vouloir supprimer la route <strong>{deleteDialog.routeNumber}</strong> ?
              Cette action supprimera aussi tous les stops et colis associes.
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
