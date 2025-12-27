"use client";

import { useState } from "react";
import { Truck, Package, MapPin, CheckCircle, Clock, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";

interface TrackingEvent {
  id: string;
  type: string;
  description: string;
  location: string | null;
  timestamp: string;
}

interface TrackingResult {
  trackingNumber: string;
  status: string;
  customer: string;
  pickupAddress: string;
  deliveryAddress: string;
  estimatedDelivery: string | null;
  driver: string | null;
  vehicle: string | null;
  events: TrackingEvent[];
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsSearching(true);
    setError("");
    setTrackingResult(null);

    try {
      const res = await fetch(`/api/tracking?number=${encodeURIComponent(trackingNumber)}`);
      const data = await res.json();

      if (res.ok) {
        setTrackingResult(data);
      } else {
        setError(data.error || "Commande non trouvée");
      }
    } catch (err) {
      setError("Erreur lors de la recherche");
    } finally {
      setIsSearching(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "ORDER_CREATED":
      case "ORDER_CONFIRMED":
        return <Package className="h-5 w-5" />;
      case "PICKED_UP":
        return <Truck className="h-5 w-5" />;
      case "IN_TRANSIT":
      case "IN_WAREHOUSE":
        return <Truck className="h-5 w-5" />;
      case "OUT_FOR_DELIVERY":
        return <Truck className="h-5 w-5" />;
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Truck className="h-10 w-10 text-blue-500" />
            <span className="text-3xl font-bold">LogiFlow</span>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Suivi de commande</h1>
          <p className="text-slate-400 text-center">
            Entrez votre numero de suivi pour localiser votre colis
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="container mx-auto px-4 -mt-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Ex: LF2024001"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button type="submit" size="lg" disabled={isSearching}>
                {isSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Suivre"
                )}
              </Button>
            </form>
            {error && (
              <p className="mt-4 text-red-500 text-center">{error}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {trackingResult && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Numero de suivi</p>
                    <CardTitle className="text-2xl">{trackingResult.trackingNumber}</CardTitle>
                  </div>
                  <Badge className={`${getStatusColor(trackingResult.status)} text-lg px-4 py-2`}>
                    {getStatusLabel(trackingResult.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Adresse de ramassage</p>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                        <p className="font-medium">{trackingResult.pickupAddress}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Adresse de livraison</p>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                        <p className="font-medium">{trackingResult.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {trackingResult.estimatedDelivery && (
                      <div>
                        <p className="text-sm text-slate-500">Livraison estimee</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {formatDate(trackingResult.estimatedDelivery)}
                        </p>
                      </div>
                    )}
                    {trackingResult.driver && (
                      <div>
                        <p className="text-sm text-slate-500">Chauffeur</p>
                        <p className="font-medium">{trackingResult.driver}</p>
                        {trackingResult.vehicle && (
                          <p className="text-sm text-slate-500">Vehicule: {trackingResult.vehicle}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Historique de suivi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {trackingResult.events.length === 0 ? (
                    <p className="text-center text-slate-500 py-4">Aucun evenement de suivi</p>
                  ) : (
                    trackingResult.events.map((event, index) => (
                      <div key={event.id} className="flex gap-4 pb-8 last:pb-0">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`rounded-full p-2 ${
                              index === trackingResult.events.length - 1
                                ? "bg-blue-500 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {getEventIcon(event.type)}
                          </div>
                          {index < trackingResult.events.length - 1 && (
                            <div className="w-0.5 h-full bg-slate-200 mt-2" />
                          )}
                        </div>
                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <p className="font-medium">{event.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                            <span>{formatDate(event.timestamp)}</span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            2024 LogiFlow - Plateforme de gestion logistique
          </p>
        </div>
      </footer>
    </div>
  );
}
