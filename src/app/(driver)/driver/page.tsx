"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Package,
  Calendar,
  ChevronRight,
  Truck,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface DriverRoute {
  id: string;
  routeNumber: string;
  name: string | null;
  status: string;
  scheduledDate: string;
  totalStops: number;
  completedStops: number;
  totalPackages: number;
  deliveredPackages: number;
  contract: { name: string; code: string } | null;
  vehicle: { plateNumber: string } | null;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-800" },
  PLANNED: { label: "Planifiee", color: "bg-blue-100 text-blue-800" },
  IN_PROGRESS: { label: "En cours", color: "bg-yellow-100 text-yellow-800" },
  COMPLETED: { label: "Terminee", color: "bg-green-100 text-green-800" },
};

export default function DriverHomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [routes, setRoutes] = useState<DriverRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session) {
      fetchMyRoutes();
    }
  }, [session, status]);

  async function fetchMyRoutes() {
    try {
      // Get driver's routes for today and upcoming
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`/api/routes?date=${today}`);
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

  const todayRoutes = routes.filter((r) =>
    r.status === "IN_PROGRESS" || r.status === "PLANNED"
  );
  const completedRoutes = routes.filter((r) => r.status === "COMPLETED");

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-blue-100">Bonjour,</p>
              <p className="font-bold text-lg">{session?.user?.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-blue-100">{formatDate(new Date().toISOString())}</p>
      </div>

      {/* Stats cards */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-500">Routes du jour</p>
            <p className="text-2xl font-bold">{todayRoutes.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-500">Terminees</p>
            <p className="text-2xl font-bold text-green-600">{completedRoutes.length}</p>
          </div>
        </div>
      </div>

      {/* Active routes */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Mes routes</h2>
          <Button variant="ghost" size="sm" onClick={fetchMyRoutes}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {todayRoutes.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <MapPin className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Aucune route active pour aujourd hui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayRoutes.map((route) => (
              <Link key={route.id} href={`/driver/route/${route.id}`}>
                <div className="bg-white rounded-xl p-4 shadow-sm active:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold">{route.routeNumber}</p>
                        <Badge className={statusConfig[route.status]?.color}>
                          {statusConfig[route.status]?.label}
                        </Badge>
                      </div>
                      {route.name && (
                        <p className="text-sm text-slate-500">{route.name}</p>
                      )}
                      {route.contract && (
                        <Badge variant="outline" className="mt-1">{route.contract.code}</Badge>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {route.completedStops}/{route.totalStops}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {route.deliveredPackages}/{route.totalPackages}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${route.totalStops > 0
                              ? (route.completedStops / route.totalStops) * 100
                              : 0}%`
                          }}
                        />
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Completed routes */}
      {completedRoutes.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="font-semibold text-lg mb-3">Routes terminees</h2>
          <div className="space-y-3">
            {completedRoutes.map((route) => (
              <div key={route.id} className="bg-white rounded-xl p-4 shadow-sm opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{route.routeNumber}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                      <span>{route.totalStops} stops</span>
                      <span>{route.totalPackages} colis</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Terminee</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
