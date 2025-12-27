"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Package, Truck, CheckCircle, Clock, Users, User } from "lucide-react";
import { getStatusColor, getStatusLabel } from "@/lib/utils";

interface DashboardData {
  stats: {
    ordersToday: number;
    ordersInTransit: number;
    ordersDeliveredToday: number;
    ordersPending: number;
    totalVehicles: number;
    vehiclesAvailable: number;
    vehiclesMaintenance: number;
    totalCustomers: number;
    totalDrivers: number;
  };
  recentOrders: Array<{
    id: string;
    trackingNumber: string;
    customer: string;
    destination: string;
    status: string;
    date: string;
  }>;
  chartData: Array<{
    name: string;
    commandes: number;
    livraisons: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    ordersToday: 0,
    ordersInTransit: 0,
    ordersDeliveredToday: 0,
    ordersPending: 0,
    totalVehicles: 0,
    vehiclesAvailable: 0,
    vehiclesMaintenance: 0,
    totalCustomers: 0,
    totalDrivers: 0,
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Commandes du jour"
            value={stats.ordersToday}
            icon={Package}
            iconColor="bg-cyan-500/20 text-cyan-400"
          />
          <StatsCard
            title="En transit"
            value={stats.ordersInTransit}
            change={`${stats.ordersInTransit} en cours`}
            changeType="neutral"
            icon={Truck}
            iconColor="bg-violet-500/20 text-violet-400"
          />
          <StatsCard
            title="Livrees aujourd'hui"
            value={stats.ordersDeliveredToday}
            icon={CheckCircle}
            iconColor="bg-emerald-500/20 text-emerald-400"
          />
          <StatsCard
            title="En attente"
            value={stats.ordersPending}
            change={stats.ordersPending > 0 ? "A traiter" : ""}
            changeType={stats.ordersPending > 0 ? "negative" : "neutral"}
            icon={Clock}
            iconColor="bg-amber-500/20 text-amber-400"
          />
        </div>

        {/* Second row stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Vehicules actifs"
            value={`${stats.vehiclesAvailable}/${stats.totalVehicles}`}
            change={`${stats.vehiclesMaintenance} en maintenance`}
            changeType="neutral"
            icon={Truck}
            iconColor="bg-purple-500/20 text-purple-400"
          />
          <StatsCard
            title="Clients actifs"
            value={stats.totalCustomers}
            icon={Users}
            iconColor="bg-sky-500/20 text-sky-400"
          />
          <StatsCard
            title="Chauffeurs"
            value={stats.totalDrivers}
            icon={User}
            iconColor="bg-rose-500/20 text-rose-400"
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chart */}
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-zinc-100">Activite de la semaine</h2>
              <p className="text-sm text-zinc-500">Commandes et livraisons</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.chartData || []}>
                  <defs>
                    <linearGradient id="colorCommandes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLivraisons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#16161f",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      color: "#e4e4e7",
                    }}
                    labelStyle={{ color: "#a1a1aa" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="commandes"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCommandes)"
                    name="Commandes"
                  />
                  <Area
                    type="monotone"
                    dataKey="livraisons"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorLivraisons)"
                    name="Livraisons"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-cyan-500" />
                <span className="text-sm text-zinc-400">Commandes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-zinc-400">Livraisons</span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
            <div className="p-6 border-b border-zinc-800/50">
              <h2 className="text-lg font-semibold text-zinc-100">Commandes recentes</h2>
              <p className="text-sm text-zinc-500">Les 5 dernieres commandes</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="text-zinc-400">N Tracking</TableHead>
                  <TableHead className="text-zinc-400">Client</TableHead>
                  <TableHead className="text-zinc-400">Destination</TableHead>
                  <TableHead className="text-zinc-400">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.recentOrders || []).map((order) => (
                  <TableRow key={order.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                    <TableCell className="font-medium text-zinc-200">{order.trackingNumber}</TableCell>
                    <TableCell className="text-zinc-300">{order.customer}</TableCell>
                    <TableCell className="max-w-[150px] truncate text-zinc-400">{order.destination}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {(!data?.recentOrders || data.recentOrders.length === 0) && (
                  <TableRow className="border-zinc-800/50">
                    <TableCell colSpan={4} className="text-center text-zinc-500">
                      Aucune commande recente
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
