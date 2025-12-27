"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Users,
  Truck,
  Warehouse,
  FileText,
  Settings,
  MapPin,
  LogOut,
  ScrollText,
  Navigation,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Colis", href: "/packages", icon: Boxes },
  { name: "Routes", href: "/routes", icon: Navigation },
  { name: "Commandes", href: "/orders", icon: Package },
  { name: "Contrats", href: "/contracts", icon: ScrollText },
  { name: "Clients", href: "/customers", icon: Users },
  { name: "Flotte", href: "/fleet", icon: Truck },
  { name: "Entrepots", href: "/warehouses", icon: Warehouse },
  { name: "Facturation", href: "/invoices", icon: FileText },
  { name: "Tracking", href: "/tracking", icon: MapPin },
  { name: "Parametres", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || "U";
  const userName = session?.user?.name || "Utilisateur";
  const userEmail = session?.user?.email || "";

  return (
    <div className="flex h-full w-64 flex-col bg-[#0d0d12] border-r border-[#1f1f28]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-[#1f1f28]">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
          <Truck className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">LogiFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-400"
              )} />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-cyan-400/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-[#1f1f28] p-4">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-zinc-900/50">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-semibold">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">{userName}</p>
            <p className="text-xs text-zinc-500 truncate">{userEmail}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Deconnexion
        </Button>
      </div>
    </div>
  );
}
