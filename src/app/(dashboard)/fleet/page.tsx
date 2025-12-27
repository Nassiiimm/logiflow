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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Truck, User, Wrench, Loader2 } from "lucide-react";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  capacity: number | null;
  status: string;
  driverName: string | null;
  lastMaintenanceDate: string | null;
}

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  licenseNumber: string;
  licenseExpiry: string;
  isAvailable: boolean;
  vehicle: string | null;
  deliveriesCount: number;
}

const vehicleTypeLabels: Record<string, string> = {
  VAN: "Fourgon",
  TRUCK: "Camion",
  MOTORCYCLE: "Moto",
  BICYCLE: "Velo",
  CAR: "Voiture",
};

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: "vehicle" | "driver"; id: string; name: string }>({
    open: false,
    type: "vehicle",
    id: "",
    name: "",
  });

  const [vehicleForm, setVehicleForm] = useState({
    plateNumber: "",
    type: "",
    brand: "",
    model: "",
    year: "",
    capacity: "",
  });

  const [driverForm, setDriverForm] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [vehiclesRes, driversRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/drivers"),
      ]);

      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json();
        setVehicles(vehiclesData);
      }
      if (driversRes.ok) {
        const driversData = await driversRes.json();
        setDrivers(driversData);
      }
    } catch (error) {
      console.error("Failed to fetch fleet data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleVehicleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleForm),
      });

      if (res.ok) {
        toast.success("Vehicule ajoute avec succes");
        setIsVehicleDialogOpen(false);
        setVehicleForm({
          plateNumber: "",
          type: "",
          brand: "",
          model: "",
          year: "",
          capacity: "",
        });
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation du vehicule");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDriverSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driverForm),
      });

      if (res.ok) {
        toast.success("Chauffeur ajoute avec succes");
        setIsDriverDialogOpen(false);
        setDriverForm({
          name: "",
          email: "",
          phone: "",
          licenseNumber: "",
          licenseExpiry: "",
        });
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation du chauffeur");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    const { type, id } = deleteDialog;
    const endpoint = type === "vehicle" ? "/api/vehicles" : "/api/drivers";

    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(type === "vehicle" ? "Vehicule supprime" : "Chauffeur supprime");
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteDialog({ open: false, type: "vehicle", id: "", name: "" });
    }
  }

  const filteredVehicles = vehicles.filter((v) =>
    v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter((v) => v.status === "AVAILABLE").length,
    totalDrivers: drivers.length,
    inMaintenance: vehicles.filter((v) => v.status === "MAINTENANCE").length,
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Flotte" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cyan-500/20 p-2">
                <Truck className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Vehicules</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.totalVehicles}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/20 p-2">
                <Truck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Disponibles</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {stats.availableVehicles}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-violet-500/20 p-2">
                <User className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Chauffeurs</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.totalDrivers}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-500/20 p-2">
                <Wrench className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">En maintenance</p>
                <p className="text-2xl font-bold text-orange-400">
                  {stats.inMaintenance}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="vehicles" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-zinc-800">Vehicules</TabsTrigger>
            <TabsTrigger value="drivers" className="data-[state=active]:bg-zinc-800">Chauffeurs</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="space-y-4">
            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Rechercher par immatriculation..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un vehicule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un vehicule</DialogTitle>
                    <DialogDescription>
                      Enregistrez un nouveau vehicule dans la flotte
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleVehicleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Immatriculation</Label>
                        <Input
                          placeholder="AB-123-CD"
                          value={vehicleForm.plateNumber}
                          onChange={(e) =>
                            setVehicleForm({ ...vehicleForm, plateNumber: e.target.value.toUpperCase() })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={vehicleForm.type}
                          onValueChange={(v) => setVehicleForm({ ...vehicleForm, type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type de vehicule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VAN">Fourgon</SelectItem>
                            <SelectItem value="TRUCK">Camion</SelectItem>
                            <SelectItem value="MOTORCYCLE">Moto</SelectItem>
                            <SelectItem value="CAR">Voiture</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Marque</Label>
                        <Input
                          placeholder="Renault"
                          value={vehicleForm.brand}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Modele</Label>
                        <Input
                          placeholder="Master"
                          value={vehicleForm.model}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Annee</Label>
                        <Input
                          type="number"
                          placeholder="2023"
                          value={vehicleForm.year}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Capacite (kg)</Label>
                        <Input
                          type="number"
                          placeholder="1500"
                          value={vehicleForm.capacity}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setIsVehicleDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={isSubmitting || !vehicleForm.plateNumber || !vehicleForm.type}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Ajouter
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Vehicles table */}
            <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800/50 hover:bg-transparent">
                      <TableHead className="text-zinc-400">Immatriculation</TableHead>
                      <TableHead className="text-zinc-400">Type</TableHead>
                      <TableHead className="text-zinc-400">Vehicule</TableHead>
                      <TableHead className="text-zinc-400">Capacite</TableHead>
                      <TableHead className="text-zinc-400">Chauffeur</TableHead>
                      <TableHead className="text-zinc-400">Statut</TableHead>
                      <TableHead className="text-zinc-400">Derniere maintenance</TableHead>
                      <TableHead className="text-right text-zinc-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                        <TableCell className="font-medium text-zinc-200">{vehicle.plateNumber}</TableCell>
                        <TableCell className="text-zinc-300">{vehicleTypeLabels[vehicle.type] || vehicle.type}</TableCell>
                        <TableCell className="text-zinc-300">
                          {vehicle.brand} {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ""}
                        </TableCell>
                        <TableCell className="text-zinc-300">{vehicle.capacity ? `${vehicle.capacity} kg` : "-"}</TableCell>
                        <TableCell className="text-zinc-300">{vehicle.driverName || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(vehicle.status)}>
                            {getStatusLabel(vehicle.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-zinc-500">
                          {vehicle.lastMaintenanceDate ? formatDate(vehicle.lastMaintenanceDate) : "-"}
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
                                type: "vehicle",
                                id: vehicle.id,
                                name: vehicle.plateNumber,
                              })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredVehicles.length === 0 && (
                      <TableRow className="border-zinc-800/50">
                        <TableCell colSpan={8} className="text-center py-8 text-zinc-500">
                          Aucun vehicule trouve
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-4">
            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Rechercher un chauffeur..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un chauffeur
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un chauffeur</DialogTitle>
                    <DialogDescription>
                      Enregistrez un nouveau chauffeur
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleDriverSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nom complet</Label>
                      <Input
                        placeholder="Jean Dupont"
                        value={driverForm.name}
                        onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="jean.dupont@email.com"
                        value={driverForm.email}
                        onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Telephone</Label>
                        <Input
                          placeholder="06 12 34 56 78"
                          value={driverForm.phone}
                          onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>N Permis</Label>
                        <Input
                          placeholder="123456789012"
                          value={driverForm.licenseNumber}
                          onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Expiration du permis</Label>
                      <Input
                        type="date"
                        value={driverForm.licenseExpiry}
                        onChange={(e) => setDriverForm({ ...driverForm, licenseExpiry: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setIsDriverDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={isSubmitting || !driverForm.name || !driverForm.email || !driverForm.licenseNumber}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Ajouter
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Drivers table */}
            <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800/50 hover:bg-transparent">
                      <TableHead className="text-zinc-400">Chauffeur</TableHead>
                      <TableHead className="text-zinc-400">Telephone</TableHead>
                      <TableHead className="text-zinc-400">N Permis</TableHead>
                      <TableHead className="text-zinc-400">Expiration</TableHead>
                      <TableHead className="text-zinc-400">Vehicule</TableHead>
                      <TableHead className="text-zinc-400">Livraisons</TableHead>
                      <TableHead className="text-zinc-400">Statut</TableHead>
                      <TableHead className="text-right text-zinc-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                        <TableCell>
                          <div>
                            <p className="font-medium text-zinc-200">{driver.name}</p>
                            <p className="text-sm text-zinc-500">{driver.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-300">{driver.phone || "-"}</TableCell>
                        <TableCell className="text-zinc-300">{driver.licenseNumber}</TableCell>
                        <TableCell className="text-zinc-500">
                          {formatDate(driver.licenseExpiry)}
                        </TableCell>
                        <TableCell className="text-zinc-300">{driver.vehicle || "-"}</TableCell>
                        <TableCell className="text-zinc-300">{driver.deliveriesCount}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              driver.isAvailable
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                            }
                          >
                            {driver.isAvailable ? "Disponible" : "En course"}
                          </Badge>
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
                                type: "driver",
                                id: driver.id,
                                name: driver.name,
                              })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredDrivers.length === 0 && (
                      <TableRow className="border-zinc-800/50">
                        <TableCell colSpan={8} className="text-center py-8 text-zinc-500">
                          Aucun chauffeur trouve
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer {deleteDialog.type === "vehicle" ? "le vehicule" : "le chauffeur"}{" "}
              <strong>{deleteDialog.name}</strong> ? Cette action est irreversible.
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
