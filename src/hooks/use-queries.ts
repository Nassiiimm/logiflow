"use client";

import { useQuery } from "@tanstack/react-query";

const POLLING_INTERVAL = 15000; // 15 seconds

// Dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    },
    refetchInterval: POLLING_INTERVAL,
  });
}

// Routes list
export function useRoutes(filters?: {
  search?: string;
  status?: string;
  contractId?: string;
  date?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.contractId) params.set("contractId", filters.contractId);
  if (filters?.date) params.set("date", filters.date);

  return useQuery({
    queryKey: ["routes", filters],
    queryFn: async () => {
      const res = await fetch(`/api/routes?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch routes");
      return res.json();
    },
    refetchInterval: POLLING_INTERVAL,
  });
}

// Single route detail
export function useRoute(id: string) {
  return useQuery({
    queryKey: ["route", id],
    queryFn: async () => {
      const res = await fetch(`/api/routes/${id}`);
      if (!res.ok) throw new Error("Failed to fetch route");
      return res.json();
    },
    refetchInterval: POLLING_INTERVAL,
    enabled: !!id,
  });
}

// Orders list
export function useOrders(filters?: {
  search?: string;
  status?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.status) params.set("status", filters.status);

  return useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const res = await fetch(`/api/orders?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    refetchInterval: POLLING_INTERVAL,
  });
}

// Tracking (public)
export function useTracking(trackingNumber: string) {
  return useQuery({
    queryKey: ["tracking", trackingNumber],
    queryFn: async () => {
      const res = await fetch(`/api/tracking?number=${trackingNumber}`);
      if (!res.ok) throw new Error("Failed to fetch tracking");
      return res.json();
    },
    refetchInterval: POLLING_INTERVAL,
    enabled: !!trackingNumber,
  });
}

// Contracts
export function useContracts() {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const res = await fetch("/api/contracts");
      if (!res.ok) throw new Error("Failed to fetch contracts");
      return res.json();
    },
  });
}

// Drivers
export function useDrivers() {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const res = await fetch("/api/drivers");
      if (!res.ok) throw new Error("Failed to fetch drivers");
      return res.json();
    },
  });
}

// Vehicles
export function useVehicles() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const res = await fetch("/api/vehicles");
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      return res.json();
    },
  });
}

// Driver's assigned routes
export function useDriverRoutes(driverId: string) {
  return useQuery({
    queryKey: ["driver-routes", driverId],
    queryFn: async () => {
      const res = await fetch(`/api/routes?driverId=${driverId}`);
      if (!res.ok) throw new Error("Failed to fetch driver routes");
      return res.json();
    },
    refetchInterval: POLLING_INTERVAL,
    enabled: !!driverId,
  });
}
