import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function generateTrackingNumber(): string {
  const prefix = "LF";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INV-${year}${month}-${random}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    CONFIRMED: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
    PICKED_UP: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
    IN_TRANSIT: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    OUT_FOR_DELIVERY: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
    DELIVERED: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    CANCELLED: "bg-red-500/15 text-red-400 border border-red-500/20",
    RETURNED: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20",
    AVAILABLE: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    IN_USE: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
    MAINTENANCE: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
    OUT_OF_SERVICE: "bg-red-500/15 text-red-400 border border-red-500/20",
    DRAFT: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20",
    SENT: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
    PAID: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    OVERDUE: "bg-red-500/15 text-red-400 border border-red-500/20",
    LOW: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20",
    NORMAL: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
    HIGH: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
    URGENT: "bg-red-500/15 text-red-400 border border-red-500/20",
  };
  return colors[status] || "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    PICKED_UP: "Récupérée",
    IN_TRANSIT: "En transit",
    OUT_FOR_DELIVERY: "En livraison",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
    RETURNED: "Retournée",
    AVAILABLE: "Disponible",
    IN_USE: "En service",
    MAINTENANCE: "En maintenance",
    OUT_OF_SERVICE: "Hors service",
    DRAFT: "Brouillon",
    SENT: "Envoyée",
    PAID: "Payée",
    OVERDUE: "En retard",
    LOW: "Basse",
    NORMAL: "Normale",
    HIGH: "Haute",
    URGENT: "Urgente",
  };
  return labels[status] || status;
}

interface RouteStopForMaps {
  address: string;
  city: string;
  postalCode: string;
}

interface GoogleMapsRouteResult {
  url: string;
  truncated: boolean;
  totalStops: number;
  includedStops: number;
}

const MAX_WAYPOINTS = 8;

export function generateGoogleMapsRouteUrl(
  stops: RouteStopForMaps[],
  currentLocation?: { lat: number; lng: number } | null
): GoogleMapsRouteResult | null {
  if (!stops || stops.length === 0) {
    return null;
  }

  const formatAddress = (stop: RouteStopForMaps): string => {
    return encodeURIComponent(`${stop.address}, ${stop.postalCode} ${stop.city}`);
  };

  // Single stop - simple navigation
  if (stops.length === 1) {
    const destination = formatAddress(stops[0]);
    const origin = currentLocation
      ? `${currentLocation.lat},${currentLocation.lng}`
      : "";

    const url = origin
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

    return { url, truncated: false, totalStops: 1, includedStops: 1 };
  }

  // Multiple stops
  const origin = currentLocation
    ? `${currentLocation.lat},${currentLocation.lng}`
    : formatAddress(stops[0]);

  const destination = formatAddress(stops[stops.length - 1]);

  // Waypoints are stops between origin and destination
  const waypointStops = currentLocation
    ? stops.slice(0, -1) // All except last if we use current location as origin
    : stops.slice(1, -1); // All except first and last

  const truncated = waypointStops.length > MAX_WAYPOINTS;
  const includedWaypoints = waypointStops.slice(0, MAX_WAYPOINTS);

  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

  if (includedWaypoints.length > 0) {
    const waypointsStr = includedWaypoints
      .map((stop) => formatAddress(stop))
      .join("|");
    url += `&waypoints=${waypointsStr}`;
  }

  return {
    url,
    truncated,
    totalStops: stops.length,
    includedStops: currentLocation
      ? Math.min(stops.length, MAX_WAYPOINTS + 1)
      : Math.min(stops.length, MAX_WAYPOINTS + 2),
  };
}
