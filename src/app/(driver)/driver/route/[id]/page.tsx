"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  MapPin,
  Package,
  Phone,
  ArrowLeft,
  Camera,
  PenLine,
  CheckCircle,
  XCircle,
  Navigation,
  ScanBarcode,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Map,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { generateGoogleMapsRouteUrl } from "@/lib/utils";

interface StopPackage {
  id: string;
  barcode: string;
  externalBarcode: string | null;
  status: string;
}

interface RouteStop {
  id: string;
  stopNumber: number;
  status: string;
  recipientName: string | null;
  address: string;
  city: string;
  postalCode: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  accessCode: string | null;
  instructions: string | null;
  packages: StopPackage[];
}

interface RouteDetails {
  id: string;
  routeNumber: string;
  name: string | null;
  status: string;
  totalStops: number;
  completedStops: number;
  totalPackages: number;
  deliveredPackages: number;
  contract: { name: string; code: string } | null;
  stops: RouteStop[];
}

const stopStatusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "bg-gray-100 text-gray-800" },
  IN_PROGRESS: { label: "En route", color: "bg-blue-100 text-blue-800" },
  ARRIVED: { label: "Arrive", color: "bg-yellow-100 text-yellow-800" },
  COMPLETED: { label: "Livre", color: "bg-green-100 text-green-800" },
  FAILED: { label: "Echec", color: "bg-red-100 text-red-800" },
  SKIPPED: { label: "Saute", color: "bg-orange-100 text-orange-800" },
};

export default function DriverRoutePage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string;
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStop, setCurrentStop] = useState<RouteStop | null>(null);
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set());

  // Delivery dialog state
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
  const [activeStop, setActiveStop] = useState<RouteStop | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<"success" | "failed">("success");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [signedBy, setSignedBy] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [failureReason, setFailureReason] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState<Set<string>>(new Set());
  const [manualBarcode, setManualBarcode] = useState("");

  // GPS state
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchRoute();
    requestLocation();
  }, [routeId]);

  async function fetchRoute() {
    try {
      const res = await fetch(`/api/routes/${routeId}`);
      if (res.ok) {
        const data = await res.json();
        setRoute(data);
        // Find current stop (first non-completed)
        const current = data.stops.find(
          (s: RouteStop) => s.status === "PENDING" || s.status === "IN_PROGRESS" || s.status === "ARRIVED"
        );
        setCurrentStop(current || null);
      } else {
        router.push("/driver");
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  function requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }

  function toggleStopExpand(stopId: string) {
    const newExpanded = new Set(expandedStops);
    if (newExpanded.has(stopId)) {
      newExpanded.delete(stopId);
    } else {
      newExpanded.add(stopId);
    }
    setExpandedStops(newExpanded);
  }

  function openDeliveryDialog(stop: RouteStop, mode: "success" | "failed") {
    setActiveStop(stop);
    setDeliveryMode(mode);
    setSignatureData(null);
    setPhotoData(null);
    setSignedBy("");
    setDeliveryNotes("");
    setFailureReason("");
    setScannedBarcodes(new Set());
    setDeliveryDialogOpen(true);
  }

  function openNavigation(stop: RouteStop) {
    const address = encodeURIComponent(`${stop.address}, ${stop.postalCode} ${stop.city}`);
    // Try Google Maps first, fallback to Apple Maps on iOS
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(googleMapsUrl, "_blank");
  }

  function openFullRouteInMaps() {
    if (!route) return;

    // Filter only pending/in-progress stops for navigation
    const pendingStops = route.stops.filter(
      (s) => s.status === "PENDING" || s.status === "IN_PROGRESS" || s.status === "ARRIVED"
    );

    if (pendingStops.length === 0) {
      toast.error("Aucun stop restant a naviguer");
      return;
    }

    const result = generateGoogleMapsRouteUrl(pendingStops, currentLocation);

    if (!result) {
      toast.error("Impossible de generer l'itineraire");
      return;
    }

    if (result.truncated) {
      toast.info(`Route tronquee: ${result.includedStops}/${result.totalStops} stops inclus (limite Google Maps)`);
    }

    window.open(result.url, "_blank");
  }

  // Signature canvas handling
  function initSignatureCanvas() {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }

  function handleSignatureStart(e: React.TouchEvent | React.MouseEvent) {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handleSignatureMove(e: React.TouchEvent | React.MouseEvent) {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function handleSignatureEnd() {
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  }

  function clearSignature() {
    setSignatureData(null);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  // Camera handling
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      toast.error("Impossible d'acceder a la camera");
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      setPhotoData(canvas.toDataURL("image/jpeg", 0.8));
    }

    // Stop camera
    const stream = video.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    setShowCamera(false);
  }

  function cancelCamera() {
    const video = videoRef.current;
    if (video) {
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  }

  // Manual barcode entry
  function addManualBarcode() {
    if (manualBarcode.trim()) {
      const newScanned = new Set(scannedBarcodes);
      newScanned.add(manualBarcode.trim());
      setScannedBarcodes(newScanned);
      setManualBarcode("");
      toast.success("Code-barre ajoute");
    }
  }

  // Submit delivery
  async function handleSubmitDelivery() {
    if (!activeStop) return;

    if (deliveryMode === "success") {
      if (!signatureData) {
        toast.error("Signature requise");
        return;
      }
      if (!signedBy.trim()) {
        toast.error("Nom du signataire requis");
        return;
      }
    } else {
      if (!failureReason.trim()) {
        toast.error("Raison de l'echec requise");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/routes/${routeId}/stops/${activeStop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: deliveryMode === "success" ? "COMPLETED" : "FAILED",
          actualArrival: new Date().toISOString(),
          signature: signatureData,
          signedBy: signedBy,
          proofPhoto: photoData,
          deliveryNotes: deliveryNotes,
          failureReason: deliveryMode === "failed" ? failureReason : null,
          latitude: currentLocation?.lat,
          longitude: currentLocation?.lng,
        }),
      });

      if (res.ok) {
        toast.success(
          deliveryMode === "success"
            ? "Livraison confirmee!"
            : "Echec enregistre"
        );
        setDeliveryDialogOpen(false);
        fetchRoute();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la mise a jour");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/driver">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-bold">{route.routeNumber}</h1>
            {route.contract && (
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                {route.contract.code}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={openFullRouteInMaps}
            title="Ouvrir route complete dans Maps"
          >
            <Map className="h-5 w-5" />
          </Button>
          <div className="text-right text-sm">
            <p>{route.completedStops}/{route.totalStops} stops</p>
            <p>{progress}%</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current stop highlight */}
      {currentStop && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <p className="text-sm font-medium text-yellow-800 mb-2">Prochain stop</p>
          <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-yellow-400">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-700">
                {currentStop.stopNumber}
              </div>
              <div className="flex-1">
                {currentStop.recipientName && (
                  <p className="font-medium">{currentStop.recipientName}</p>
                )}
                <p className="text-slate-600">{currentStop.address}</p>
                <p className="text-slate-500 text-sm">{currentStop.postalCode} {currentStop.city}</p>
                {currentStop.phone && (
                  <a
                    href={`tel:${currentStop.phone}`}
                    className="inline-flex items-center gap-1 text-blue-600 text-sm mt-1"
                  >
                    <Phone className="h-4 w-4" />
                    {currentStop.phone}
                  </a>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {currentStop.packages.map((pkg) => (
                    <span
                      key={pkg.id}
                      className="text-xs bg-slate-100 px-2 py-0.5 rounded"
                    >
                      {pkg.externalBarcode || pkg.barcode.slice(0, 8)}
                    </span>
                  ))}
                </div>
                {(currentStop.accessCode || currentStop.instructions) && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                    {currentStop.accessCode && (
                      <p><strong>Code:</strong> {currentStop.accessCode}</p>
                    )}
                    {currentStop.instructions && (
                      <p>{currentStop.instructions}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => openNavigation(currentStop)}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Naviguer
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => openDeliveryDialog(currentStop, "success")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Livrer
              </Button>
              <Button
                variant="destructive"
                onClick={() => openDeliveryDialog(currentStop, "failed")}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* All stops list */}
      <div className="p-4">
        <h2 className="font-semibold mb-3">Tous les stops ({route.stops.length})</h2>
        <div className="space-y-2">
          {route.stops.map((stop) => {
            const isExpanded = expandedStops.has(stop.id);
            const isCurrent = currentStop?.id === stop.id;
            const isCompleted = stop.status === "COMPLETED";
            const isFailed = stop.status === "FAILED";

            return (
              <div
                key={stop.id}
                className={`rounded-xl border bg-white shadow-sm overflow-hidden ${
                  isCurrent ? "ring-2 ring-yellow-400" : ""
                } ${isCompleted ? "opacity-60" : ""}`}
              >
                <div
                  className="p-3 flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleStopExpand(stop.id)}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCompleted
                        ? "bg-green-100 text-green-700"
                        : isFailed
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isFailed ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      stop.stopNumber
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{stop.address}</p>
                    <p className="text-sm text-slate-500">
                      {stop.packages.length} colis
                    </p>
                  </div>
                  <Badge className={stopStatusConfig[stop.status]?.color}>
                    {stopStatusConfig[stop.status]?.label}
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 border-t pt-3">
                    <div className="space-y-2 text-sm">
                      {stop.recipientName && (
                        <p className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          {stop.recipientName}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {stop.address}, {stop.postalCode} {stop.city}
                      </p>
                      {stop.phone && (
                        <a
                          href={`tel:${stop.phone}`}
                          className="flex items-center gap-2 text-blue-600"
                        >
                          <Phone className="h-4 w-4" />
                          {stop.phone}
                        </a>
                      )}
                      {stop.accessCode && (
                        <p><strong>Code:</strong> {stop.accessCode}</p>
                      )}
                      {stop.instructions && (
                        <p className="text-slate-600">{stop.instructions}</p>
                      )}
                    </div>

                    {!isCompleted && !isFailed && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            openNavigation(stop);
                          }}
                        >
                          <Navigation className="mr-1 h-4 w-4" />
                          GPS
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeliveryDialog(stop, "success");
                          }}
                        >
                          Livrer
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeliveryDialog(stop, "failed");
                          }}
                        >
                          Echec
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Dialog */}
      <Dialog open={deliveryDialogOpen} onOpenChange={setDeliveryDialogOpen}>
        <DialogContent className="max-w-lg max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {deliveryMode === "success" ? "Confirmer la livraison" : "Echec de livraison"}
            </DialogTitle>
          </DialogHeader>

          {activeStop && (
            <div className="space-y-4">
              {/* Stop info */}
              <div className="p-3 bg-slate-50 rounded-lg text-sm">
                <p className="font-medium">{activeStop.address}</p>
                <p className="text-slate-500">{activeStop.postalCode} {activeStop.city}</p>
              </div>

              {deliveryMode === "success" ? (
                <>
                  {/* Packages to scan */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Colis ({activeStop.packages.length})
                    </label>
                    <div className="space-y-2">
                      {activeStop.packages.map((pkg) => {
                        const isScanned = scannedBarcodes.has(pkg.externalBarcode || pkg.barcode);
                        return (
                          <div
                            key={pkg.id}
                            className={`flex items-center gap-2 p-2 rounded border ${
                              isScanned ? "bg-green-50 border-green-200" : "bg-slate-50"
                            }`}
                          >
                            <Package className="h-4 w-4 text-slate-400" />
                            <span className="flex-1 font-mono text-sm">
                              {pkg.externalBarcode || pkg.barcode}
                            </span>
                            {isScanned && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Entrer code-barre manuellement"
                        value={manualBarcode}
                        onChange={(e) => setManualBarcode(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={addManualBarcode}>
                        <ScanBarcode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Photo */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Photo de preuve
                    </label>
                    {showCamera ? (
                      <div className="space-y-2">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full rounded-lg"
                        />
                        <div className="flex gap-2">
                          <Button onClick={capturePhoto} className="flex-1">
                            Capturer
                          </Button>
                          <Button variant="outline" onClick={cancelCamera}>
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : photoData ? (
                      <div className="space-y-2">
                        <img
                          src={photoData}
                          alt="Preuve"
                          className="w-full rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPhotoData(null)}
                        >
                          Reprendre
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-24"
                        onClick={startCamera}
                      >
                        <Camera className="mr-2 h-6 w-6" />
                        Prendre une photo
                      </Button>
                    )}
                  </div>

                  {/* Signature */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Signature *
                    </label>
                    {showSignature || signatureData ? (
                      <div className="space-y-2">
                        <canvas
                          ref={signatureCanvasRef}
                          width={300}
                          height={150}
                          className="w-full border rounded-lg bg-white touch-none"
                          onTouchStart={handleSignatureStart}
                          onTouchMove={handleSignatureMove}
                          onTouchEnd={handleSignatureEnd}
                          onMouseDown={handleSignatureStart}
                          onMouseMove={handleSignatureMove}
                          onMouseUp={handleSignatureEnd}
                          onMouseLeave={handleSignatureEnd}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSignature}
                        >
                          Effacer
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-24"
                        onClick={() => {
                          setShowSignature(true);
                          setTimeout(initSignatureCanvas, 100);
                        }}
                      >
                        <PenLine className="mr-2 h-6 w-6" />
                        Signer ici
                      </Button>
                    )}
                  </div>

                  {/* Signed by */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Nom du signataire *
                    </label>
                    <Input
                      placeholder="Nom de la personne qui signe"
                      value={signedBy}
                      onChange={(e) => setSignedBy(e.target.value)}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Notes (optionnel)
                    </label>
                    <Textarea
                      placeholder="Notes de livraison..."
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      rows={2}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Failure reason */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Raison de l echec *
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={failureReason}
                      onChange={(e) => setFailureReason(e.target.value)}
                    >
                      <option value="">Selectionner une raison</option>
                      <option value="Absent">Client absent</option>
                      <option value="Adresse incorrecte">Adresse incorrecte</option>
                      <option value="Acces impossible">Acces impossible</option>
                      <option value="Refuse par le client">Refuse par le client</option>
                      <option value="Colis endommage">Colis endommage</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  {/* Photo (optional for failure) */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Photo (optionnel)
                    </label>
                    {showCamera ? (
                      <div className="space-y-2">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full rounded-lg"
                        />
                        <div className="flex gap-2">
                          <Button onClick={capturePhoto} className="flex-1">
                            Capturer
                          </Button>
                          <Button variant="outline" onClick={cancelCamera}>
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : photoData ? (
                      <div className="space-y-2">
                        <img
                          src={photoData}
                          alt="Photo"
                          className="w-full rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPhotoData(null)}
                        >
                          Reprendre
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={startCamera}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Prendre une photo
                      </Button>
                    )}
                  </div>

                  {/* Additional notes */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Details supplementaires
                    </label>
                    <Textarea
                      placeholder="Plus de details sur l'echec..."
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      rows={2}
                    />
                  </div>
                </>
              )}

              {/* Submit buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeliveryDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  className={`flex-1 ${
                    deliveryMode === "success"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  onClick={handleSubmitDelivery}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {deliveryMode === "success" ? "Confirmer" : "Enregistrer echec"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
