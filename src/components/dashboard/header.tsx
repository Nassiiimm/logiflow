"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-zinc-800/50 bg-[#0a0a0f]/80 backdrop-blur-xl px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden text-zinc-400 hover:text-zinc-200">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-zinc-800 bg-[#0d0d12]">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Title */}
      <h1 className="text-xl font-semibold text-zinc-100">{title}</h1>

      {/* Search */}
      <div className="flex-1 max-w-md ml-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Rechercher..."
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-[#16161f] border-zinc-800">
          <DropdownMenuLabel className="text-zinc-200">Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem className="focus:bg-zinc-800/50">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-zinc-200">Nouvelle commande</p>
              <p className="text-xs text-zinc-500">Commande #LF123 creee il y a 5 min</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-zinc-800/50">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-zinc-200">Livraison effectuee</p>
              <p className="text-xs text-zinc-500">Commande #LF120 livree</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-zinc-800/50">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-zinc-200">Vehicule en maintenance</p>
              <p className="text-xs text-zinc-500">AB-123-CD en maintenance</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
