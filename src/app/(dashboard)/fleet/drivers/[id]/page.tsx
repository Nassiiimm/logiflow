"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  ArrowLeft,
  User,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Truck,
  Package,
  MapPin,
  Clock,
  AlertTriangle,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { toast } from "sonner";

interface Driver {
  id: string;
  licenseNumber: string;
  licenseExpiry: string;
  phone: string | null;
  emergencyContact: string | null;
  isAvailable: boolean;
  currentLocation: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  vehicles: Array<{
    id: string;
    plateNumber: string;
    type: string;
    brand: string | null;
    model: string | null;
  }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    deliveryAddress: string;
  }>;
}

interface DriverStats {
  totalDeliveries: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  averagePerDay: number;
}

export default function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchDriver();
  }, [id]);

  async function fetchDriver() {
    try {
      const res = await fetch(`/api/drivers/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDriver(data);

        // Calculate stats
        const completed = data.orders?.filter((o: { status: string }) => o.status === "DELIVERED").length || 0;
        const pending = data.orders?.filter((o: { status: string }) => ["PENDING", "IN_TRANSIT"].includes(o.status)).length || 0;
        const total = data.orders?.length || 0;

        // Calculate average per day (based on account age)
        const accountAge = Math.max(1, Math.ceil((Date.now() - new Date(data.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
        const avgPerDay = total / accountAge;

        setStats({
          totalDeliveries: total,
          completedDeliveries: completed,
          pendingDeliveries: pending,
          averagePerDay: Math.round(avgPerDay * 10) / 10,
        });
      } else {
        toast.error("Chauffeur non trouve");
        router.push("/fleet");
      }
    } catch (error) {
      console.error("Failed to fetch driver:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  async function toggleAvailability() {
    if (!driver) return;

    try {
      const res = await fetch(`/api/drivers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !driver.isAvailable }),
      });

      if (res.ok) {
        setDriver({ ...driver, isAvailable: !driver.isAvailable });
        toast.success(driver.isAvailable ? "Chauffeur marque indisponible" : "Chauffeur marque disponible");
      } else {
        toast.error("Erreur lors de la mise a jour");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise a jour");
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/drivers/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Chauffeur supprime");
        router.push("/fleet");
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  }

  function isLicenseExpiringSoon(): boolean {
    if (!driver) return false;
    const expiryDate = new Date(driver.licenseExpiry);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Chargement..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </div>
    );
  }

  if (!driver) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={driver.user.name} />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Back button and actions */}
        <div className="flex items-center justify-between">
          <Link href="/fleet">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour a la flotte
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 text-red-400 border-red-400/50 hover:bg-red-400/10"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>

        {/* License expiry warning */}
        {isLicenseExpiringSoon() && (
          <div className="rounded-xl border border-orange-500/50 bg-orange-500/10 p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <div>
              <p className="text-orange-400 font-medium">Permis expirant bientot</p>
              <p className="text-sm text-orange-400/70">
                Le permis de ce chauffeur expire le {formatDate(driver.licenseExpiry)}
              </p>
            </div>
          </div>
        )}

        {/* Main info grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Driver info */}
          <Card className="md:col-span-2 bg-[#12121a] border-zinc-800/50">
            <CardHeader>
              <CardTitle className="text-zinc-100">Informations du chauffeur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50">
                  <User className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-zinc-500">Nom</p>
                    <p className="text-zinc-200">{driver.user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-zinc-500">Email</p>
                    <p className="text-zinc-200">{driver.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50">
                  <Phone className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-zinc-500">Telephone</p>
                    <p className="text-zinc-200">{driver.phone || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50">
                  <CreditCard className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-zinc-500">N Permis</p>
                    <p className="text-zinc-200">{driver.licenseNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-zinc-500">Expiration permis</p>
                    <p className={isLicenseExpiringSoon() ? "text-orange-400" : "text-zinc-200"}>
                      {formatDate(driver.licenseExpiry)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-zinc-500">Membre depuis</p>
                    <p className="text-zinc-200">{formatDate(driver.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Availability toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${driver.isAvailable ? "bg-emerald-500/20" : "bg-zinc-800"}`}>
                    <User className={`h-5 w-5 ${driver.isAvailable ? "text-emerald-400" : "text-zinc-500"}`} />
                  </div>
                  <div>
                    <p className="text-zinc-200 font-medium">Disponibilite</p>
                    <p className="text-sm text-zinc-500">
                      {driver.isAvailable ? "Disponible pour les livraisons" : "Indisponible"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={driver.isAvailable}
                  onCheckedChange={toggleAvailability}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Stats card */}
          <Card className="bg-[#12121a] border-zinc-800/50">
            <CardHeader>
              <CardTitle className="text-zinc-100">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-zinc-900/50 text-center">
                <p className="text-3xl font-bold text-cyan-400">{stats?.totalDeliveries || 0}</p>
                <p className="text-sm text-zinc-500">Livraisons totales</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-zinc-900/50 text-center">
                  <p className="text-xl font-bold text-emerald-400">{stats?.completedDeliveries || 0}</p>
                  <p className="text-xs text-zinc-500">Completees</p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/50 text-center">
                  <p className="text-xl font-bold text-orange-400">{stats?.pendingDeliveries || 0}</p>
                  <p className="text-xs text-zinc-500">En cours</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/50 text-center">
                <p className="text-xl font-bold text-violet-400">{stats?.averagePerDay || 0}</p>
                <p className="text-xs text-zinc-500">Moyenne / jour</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicles section */}
        <Card className="bg-[#12121a] border-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <Truck className="h-5 w-5 text-cyan-400" />
              Vehicules assignes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {driver.vehicles.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {driver.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800"
                  >
                    <p className="font-medium text-zinc-200">{vehicle.plateNumber}</p>
                    <p className="text-sm text-zinc-500">
                      {vehicle.brand} {vehicle.model}
                    </p>
                    <Badge className="mt-2 bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                      {vehicle.type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-center py-4">Aucun vehicule assigne</p>
            )}
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card className="bg-[#12121a] border-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <Package className="h-5 w-5 text-cyan-400" />
              Dernieres livraisons
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Les 10 dernieres commandes assignees
            </CardDescription>
          </CardHeader>
          <CardContent>
            {driver.orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800/50 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Commande</TableHead>
                    <TableHead className="text-zinc-400">Adresse</TableHead>
                    <TableHead className="text-zinc-400">Date</TableHead>
                    <TableHead className="text-zinc-400">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driver.orders.map((order) => (
                    <TableRow key={order.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                      <TableCell className="font-medium text-zinc-200">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell className="text-zinc-300 max-w-[200px] truncate">
                        {order.deliveryAddress}
                      </TableCell>
                      <TableCell className="text-zinc-500">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-zinc-500 text-center py-8">Aucune livraison</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer le chauffeur{" "}
              <strong>{driver.user.name}</strong> ? Cette action est irreversible.
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
