"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  ArrowLeft,
  Plus,
  Loader2,
  MapPin,
  Package,
  Phone,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Play,
  Edit,
  Map,
} from "lucide-react";
import { formatDate, generateGoogleMapsRouteUrl } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface RouteStop {
  id: string;
  stopNumber: number;
  status: "PENDING" | "IN_PROGRESS" | "ARRIVED" | "COMPLETED" | "FAILED" | "SKIPPED";
  recipientName: string | null;
  address: string;
  city: string;
  postalCode: string;
  phone: string | null;
  accessCode: string | null;
  instructions: string | null;
  signature: string | null;
  signedBy: string | null;
  proofPhoto: string | null;
  deliveryNotes: string | null;
  failureReason: string | null;
  actualArrival: string | null;
  packages: {
    id: string;
    barcode: string;
    externalBarcode: string | null;
    status: string;
    weight: number | null;
    description: string | null;
  }[];
}

interface RouteDetails {
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
  notes: string | null;
  contract: { id: string; name: string; code: string } | null;
  driver: { id: string; user: { name: string; phone: string | null } } | null;
  vehicle: { id: string; plateNumber: string; type: string } | null;
  createdBy: { name: string } | null;
  stops: RouteStop[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: "En attente", color: "bg-gray-100 text-gray-800", icon: Clock },
  IN_PROGRESS: { label: "En route", color: "bg-blue-100 text-blue-800", icon: Play },
  ARRIVED: { label: "Arrive", color: "bg-yellow-100 text-yellow-800", icon: MapPin },
  COMPLETED: { label: "Livre", color: "bg-green-100 text-green-800", icon: CheckCircle },
  FAILED: { label: "Echec", color: "bg-red-100 text-red-800", icon: XCircle },
  SKIPPED: { label: "Saute", color: "bg-orange-100 text-orange-800", icon: XCircle },
};

export default function RouteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string;

  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddStopDialogOpen, setIsAddStopDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteStopDialog, setDeleteStopDialog] = useState<{ open: boolean; id: string; address: string }>({
    open: false,
    id: "",
    address: "",
  });

  const [stopFormData, setStopFormData] = useState({
    recipientName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    accessCode: "",
    instructions: "",
    packages: [{ externalBarcode: "", weight: "", description: "" }],
  });

  useEffect(() => {
    fetchRoute();
  }, [routeId]);

  async function fetchRoute() {
    try {
      const res = await fetch(`/api/routes/${routeId}`);
      if (res.ok) {
        const data = await res.json();
        setRoute(data);
      } else {
        toast.error("Route non trouvee");
        router.push("/routes");
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  function resetStopForm() {
    setStopFormData({
      recipientName: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      accessCode: "",
      instructions: "",
      packages: [{ externalBarcode: "", weight: "", description: "" }],
    });
  }

  function addPackageField() {
    setStopFormData({
      ...stopFormData,
      packages: [...stopFormData.packages, { externalBarcode: "", weight: "", description: "" }],
    });
  }

  function updatePackage(index: number, field: string, value: string) {
    const newPackages = [...stopFormData.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setStopFormData({ ...stopFormData, packages: newPackages });
  }

  function removePackage(index: number) {
    if (stopFormData.packages.length > 1) {
      const newPackages = stopFormData.packages.filter((_, i) => i !== index);
      setStopFormData({ ...stopFormData, packages: newPackages });
    }
  }

  async function handleAddStop(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/routes/${routeId}/stops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...stopFormData,
          packages: stopFormData.packages.filter((p) => p.externalBarcode),
        }),
      });

      if (res.ok) {
        toast.success("Stop ajoute");
        setIsAddStopDialogOpen(false);
        resetStopForm();
        fetchRoute();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de l'ajout");
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout du stop");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteStop() {
    try {
      const res = await fetch(`/api/routes/${routeId}/stops/${deleteStopDialog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Stop supprime");
        fetchRoute();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteStopDialog({ open: false, id: "", address: "" });
    }
  }

  async function handleStartRoute() {
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
        fetchRoute();
      }
    } catch (error) {
      toast.error("Erreur lors du demarrage");
    }
  }

  function openFullRouteInMaps() {
    if (!route || route.stops.length === 0) {
      toast.error("Aucun stop dans cette route");
      return;
    }

    // For dashboard, show all stops (not filtered by status)
    const result = generateGoogleMapsRouteUrl(route.stops);

    if (!result) {
      toast.error("Impossible de generer l'itineraire");
      return;
    }

    if (result.truncated) {
      toast.info(`Route tronquee: ${result.includedStops}/${result.totalStops} stops inclus (limite Google Maps)`);
    }

    window.open(result.url, "_blank");
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Chargement..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!route) {
    return null;
  }

  const progress = route.totalStops > 0
    ? Math.round((route.completedStops / route.totalStops) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full">
      <Header title={route.routeNumber} />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Back button and actions */}
        <div className="flex items-center justify-between">
          <Link href="/routes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux routes
            </Button>
          </Link>
          <div className="flex gap-2">
            {route.stops.length > 0 && (
              <Button variant="outline" onClick={openFullRouteInMaps}>
                <Map className="mr-2 h-4 w-4" />
                Ouvrir dans Maps
              </Button>
            )}
            {route.status === "DRAFT" && route.totalStops > 0 && (
              <Button onClick={handleStartRoute}>
                <Play className="mr-2 h-4 w-4" />
                Demarrer la route
              </Button>
            )}
          </div>
        </div>

        {/* Route info card */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{route.routeNumber}</h2>
              {route.name && <p className="text-slate-500">{route.name}</p>}
              <div className="flex items-center gap-4 mt-3">
                <Badge className={statusConfig[route.status]?.color}>
                  {statusConfig[route.status]?.label}
                </Badge>
                {route.contract && (
                  <Badge variant="outline">{route.contract.code}</Badge>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Date</p>
                <p className="font-medium">{formatDate(route.scheduledDate)}</p>
              </div>
              <div>
                <p className="text-slate-500">Chauffeur</p>
                <p className="font-medium">{route.driver?.user.name || "Non assigne"}</p>
              </div>
              <div>
                <p className="text-slate-500">Vehicule</p>
                <p className="font-medium">{route.vehicle?.plateNumber || "Non assigne"}</p>
              </div>
              <div>
                <p className="text-slate-500">Progres</p>
                <p className="font-medium">{progress}%</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>{route.completedStops} / {route.totalStops} stops</span>
              <span>{route.deliveredPackages} / {route.totalPackages} colis</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stops section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Stops ({route.stops.length})</h3>
            {route.status === "DRAFT" && (
              <Dialog open={isAddStopDialogOpen} onOpenChange={setIsAddStopDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un stop
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter un stop</DialogTitle>
                    <DialogDescription>
                      Ajoutez une adresse de livraison avec ses colis
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddStop} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label>Destinataire</Label>
                        <Input
                          placeholder="Nom du destinataire"
                          value={stopFormData.recipientName}
                          onChange={(e) => setStopFormData({ ...stopFormData, recipientName: e.target.value })}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Adresse</Label>
                        <Input
                          placeholder="Adresse complete"
                          value={stopFormData.address}
                          onChange={(e) => setStopFormData({ ...stopFormData, address: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ville</Label>
                        <Input
                          placeholder="Ville"
                          value={stopFormData.city}
                          onChange={(e) => setStopFormData({ ...stopFormData, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Code postal</Label>
                        <Input
                          placeholder="Code postal"
                          value={stopFormData.postalCode}
                          onChange={(e) => setStopFormData({ ...stopFormData, postalCode: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telephone</Label>
                        <Input
                          placeholder="06 12 34 56 78"
                          value={stopFormData.phone}
                          onChange={(e) => setStopFormData({ ...stopFormData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Code d acces</Label>
                        <Input
                          placeholder="Code immeuble"
                          value={stopFormData.accessCode}
                          onChange={(e) => setStopFormData({ ...stopFormData, accessCode: e.target.value })}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Instructions</Label>
                        <Textarea
                          placeholder="Instructions de livraison..."
                          value={stopFormData.instructions}
                          onChange={(e) => setStopFormData({ ...stopFormData, instructions: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Packages */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-base font-semibold">Colis</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addPackageField}>
                          <Plus className="mr-1 h-3 w-3" />
                          Ajouter colis
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {stopFormData.packages.map((pkg, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <Input
                              placeholder="Code-barre externe"
                              value={pkg.externalBarcode}
                              onChange={(e) => updatePackage(index, "externalBarcode", e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Poids (kg)"
                              type="number"
                              step="0.1"
                              value={pkg.weight}
                              onChange={(e) => updatePackage(index, "weight", e.target.value)}
                              className="w-24"
                            />
                            <Input
                              placeholder="Description"
                              value={pkg.description}
                              onChange={(e) => updatePackage(index, "description", e.target.value)}
                              className="flex-1"
                            />
                            {stopFormData.packages.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removePackage(index)}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => {
                        setIsAddStopDialogOpen(false);
                        resetStopForm();
                      }}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Ajouter le stop
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Stops list */}
          <div className="space-y-3">
            {route.stops.map((stop) => {
              const StatusIcon = statusConfig[stop.status]?.icon || Clock;
              return (
                <div key={stop.id} className="rounded-xl border bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    {/* Stop number */}
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      {stop.stopNumber}
                    </div>

                    {/* Stop info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {stop.recipientName && (
                            <p className="font-medium flex items-center gap-2">
                              <User className="h-4 w-4 text-slate-400" />
                              {stop.recipientName}
                            </p>
                          )}
                          <p className="text-slate-600 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            {stop.address}, {stop.postalCode} {stop.city}
                          </p>
                          {stop.phone && (
                            <p className="text-sm text-slate-500 flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-400" />
                              {stop.phone}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={statusConfig[stop.status]?.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig[stop.status]?.label}
                          </Badge>
                          {route.status === "DRAFT" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => setDeleteStopDialog({
                                open: true,
                                id: stop.id,
                                address: stop.address,
                              })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Packages */}
                      {stop.packages.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {stop.packages.map((pkg) => (
                            <div
                              key={pkg.id}
                              className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded"
                            >
                              <Package className="h-3 w-3" />
                              <span>{pkg.externalBarcode || pkg.barcode.slice(0, 8)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Additional info */}
                      {(stop.accessCode || stop.instructions) && (
                        <div className="mt-2 text-sm text-slate-500">
                          {stop.accessCode && <span>Code: {stop.accessCode}</span>}
                          {stop.accessCode && stop.instructions && <span className="mx-2">|</span>}
                          {stop.instructions && <span>{stop.instructions}</span>}
                        </div>
                      )}

                      {/* Delivery proof */}
                      {stop.status === "COMPLETED" && (
                        <div className="mt-2 flex items-center gap-4 text-sm text-green-600">
                          {stop.signedBy && <span>Signe par: {stop.signedBy}</span>}
                          {stop.actualArrival && <span>a {new Date(stop.actualArrival).toLocaleTimeString()}</span>}
                        </div>
                      )}

                      {/* Failure reason */}
                      {stop.status === "FAILED" && stop.failureReason && (
                        <div className="mt-2 text-sm text-red-600">
                          Raison: {stop.failureReason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {route.stops.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <MapPin className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p>Aucun stop dans cette route</p>
                {route.status === "DRAFT" && (
                  <p className="text-sm">Ajoutez des stops manuellement ou importez un CSV</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Stop Dialog */}
      <AlertDialog open={deleteStopDialog.open} onOpenChange={(open) => setDeleteStopDialog({ ...deleteStopDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer le stop <strong>{deleteStopDialog.address}</strong> ?
              Les colis associes seront aussi supprimes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStop} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
