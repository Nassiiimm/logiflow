"use client";

import { useState, useEffect } from "react";
import { Truck, Package, MapPin, CheckCircle, Clock, Search, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import { useTracking } from "@/hooks/use-queries";

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
  const [searchInput, setSearchInput] = useState("");
  const [activeTrackingNumber, setActiveTrackingNumber] = useState("");

  const { data: trackingResult, isLoading, error, dataUpdatedAt } = useTracking(activeTrackingNumber);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveTrackingNumber(searchInput.trim());
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
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="bg-[#12121a] border-b border-zinc-800/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Truck className="h-10 w-10 text-cyan-500" />
            <span className="text-3xl font-bold text-white">LogiFlow</span>
          </div>
          <h1 className="text-2xl font-bold text-center text-white mb-2">Suivi de commande</h1>
          <p className="text-zinc-400 text-center">
            Entrez votre numero de suivi pour localiser votre colis
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="container mx-auto px-4 -mt-6">
        <Card className="max-w-2xl mx-auto bg-[#12121a] border-zinc-800/50">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Ex: LF2024001"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button type="submit" size="lg" className="bg-cyan-600 hover:bg-cyan-700" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Suivre"
                )}
              </Button>
            </form>
            {error && (
              <p className="mt-4 text-red-400 text-center">Commande non trouvee</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {trackingResult && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Auto-refresh indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
              <RefreshCw className="h-3 w-3" />
              <span>
                Actualise automatiquement toutes les 15s
                {dataUpdatedAt && ` • ${new Date(dataUpdatedAt).toLocaleTimeString()}`}
              </span>
            </div>

            {/* Status Card */}
            <Card className="bg-[#12121a] border-zinc-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Numero de suivi</p>
                    <CardTitle className="text-2xl text-white">{trackingResult.trackingNumber}</CardTitle>
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
                      <p className="text-sm text-zinc-500">Adresse de ramassage</p>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="h-5 w-5 text-cyan-500 mt-0.5" />
                        <p className="font-medium text-zinc-200">{trackingResult.pickupAddress}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">Adresse de livraison</p>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="h-5 w-5 text-emerald-500 mt-0.5" />
                        <p className="font-medium text-zinc-200">{trackingResult.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {trackingResult.estimatedDelivery && (
                      <div>
                        <p className="text-sm text-zinc-500">Livraison estimee</p>
                        <p className="text-lg font-semibold text-cyan-400">
                          {formatDate(trackingResult.estimatedDelivery)}
                        </p>
                      </div>
                    )}
                    {trackingResult.driver && (
                      <div>
                        <p className="text-sm text-zinc-500">Chauffeur</p>
                        <p className="font-medium text-zinc-200">{trackingResult.driver}</p>
                        {trackingResult.vehicle && (
                          <p className="text-sm text-zinc-500">Vehicule: {trackingResult.vehicle}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-[#12121a] border-zinc-800/50">
              <CardHeader>
                <CardTitle className="text-white">Historique de suivi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {trackingResult.events.length === 0 ? (
                    <p className="text-center text-zinc-500 py-4">Aucun evenement de suivi</p>
                  ) : (
                    trackingResult.events.map((event: TrackingEvent, index: number) => (
                      <div key={event.id} className="flex gap-4 pb-8 last:pb-0">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`rounded-full p-2 ${
                              index === 0
                                ? "bg-cyan-500 text-white"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {getEventIcon(event.type)}
                          </div>
                          {index < trackingResult.events.length - 1 && (
                            <div className="w-0.5 h-full bg-zinc-800 mt-2" />
                          )}
                        </div>
                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <p className="font-medium text-zinc-200">{event.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
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
      <footer className="bg-[#12121a] border-t border-zinc-800/50 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-zinc-500">
            2024 LogiFlow - Plateforme de gestion logistique
          </p>
        </div>
      </footer>
    </div>
  );
}
