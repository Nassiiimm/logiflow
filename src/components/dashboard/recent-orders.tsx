"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";

// Données de démonstration
const recentOrders = [
  {
    id: "1",
    trackingNumber: "LF2024001",
    customer: "Jean Dupont",
    destination: "Paris, 75001",
    status: "IN_TRANSIT",
    date: new Date(),
  },
  {
    id: "2",
    trackingNumber: "LF2024002",
    customer: "Marie Martin",
    destination: "Lyon, 69001",
    status: "DELIVERED",
    date: new Date(Date.now() - 86400000),
  },
  {
    id: "3",
    trackingNumber: "LF2024003",
    customer: "Pierre Bernard",
    destination: "Marseille, 13001",
    status: "PENDING",
    date: new Date(Date.now() - 172800000),
  },
  {
    id: "4",
    trackingNumber: "LF2024004",
    customer: "Sophie Petit",
    destination: "Toulouse, 31000",
    status: "OUT_FOR_DELIVERY",
    date: new Date(Date.now() - 259200000),
  },
  {
    id: "5",
    trackingNumber: "LF2024005",
    customer: "Lucas Moreau",
    destination: "Nice, 06000",
    status: "CONFIRMED",
    date: new Date(Date.now() - 345600000),
  },
];

export function RecentOrders() {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-slate-900">Commandes recentes</h2>
        <p className="text-sm text-slate-500">Les 5 dernieres commandes</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N Tracking</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.trackingNumber}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.destination}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-500">
                {formatDate(order.date)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
