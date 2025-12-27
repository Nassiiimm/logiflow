"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Package,
  Search,
  Upload,
  Route,
  Loader2,
  FileSpreadsheet,
  CheckCircle,
  MapPin,
  Truck,
  User,
  Calendar,
  Plus,
  Trash2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

interface PackageData {
  id?: string;
  barcode?: string;
  externalBarcode: string;
  recipientName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  instructions: string;
  accessCode: string;
  weight: string;
  description: string;
  selected?: boolean;
}

interface Contract {
  id: string;
  name: string;
  code: string;
}

interface Driver {
  id: string;
  name: string;
}

interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  IN_TRANSIT: { label: "En transit", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  OUT_FOR_DELIVERY: { label: "En livraison", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  DELIVERED: { label: "Livre", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  FAILED: { label: "Echec", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  RETURNED: { label: "Retourne", color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" },
};

export default function PackagesPage() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [packages, setPackages] = useState<PackageData[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isCreateRouteDialogOpen, setIsCreateRouteDialogOpen] = useState(false);

  const [importData, setImportData] = useState({
    contractId: "",
    fileName: "",
    csvData: [] as PackageData[],
  });

  const [routeData, setRouteData] = useState({
    scheduledDate: new Date().toISOString().split("T")[0],
    contractId: "",
    driverId: "",
    vehicleId: "",
    routeName: "",
  });

  useEffect(() => {
    fetchContracts();
    fetchDrivers();
    fetchVehicles();
  }, []);

  async function fetchContracts() {
    try {
      const res = await fetch("/api/contracts");
      if (res.ok) {
        const data = await res.json();
        setContracts(data);
      }
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
    }
  }

  async function fetchDrivers() {
    try {
      const res = await fetch("/api/drivers");
      if (res.ok) {
        const data = await res.json();
        setDrivers(data);
      }
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    }
  }

  async function fetchVehicles() {
    try {
      const res = await fetch("/api/vehicles");
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = parseCSV(text);
        setImportData({ ...importData, csvData: rows, fileName: file.name });
        toast.success(`${rows.length} colis detectes`);
      } catch (error) {
        toast.error("Erreur lors de la lecture du fichier CSV");
      }
    };
    reader.readAsText(file);
  }

  function parseCSV(text: string): PackageData[] {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows: PackageData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: PackageData = {
        externalBarcode: "",
        recipientName: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
        instructions: "",
        accessCode: "",
        weight: "",
        description: "",
        selected: true,
      };

      headers.forEach((header, index) => {
        const value = values[index] || "";
        if (header.includes("address") || header.includes("adresse")) {
          row.address = value;
        } else if (header.includes("city") || header.includes("ville")) {
          row.city = value;
        } else if (header.includes("postal") || header.includes("code postal") || header.includes("zip")) {
          row.postalCode = value;
        } else if (header.includes("recipient") || header.includes("destinataire") || header.includes("nom") || header.includes("name")) {
          row.recipientName = value;
        } else if (header.includes("phone") || header.includes("tel")) {
          row.phone = value;
        } else if (header.includes("barcode") || header.includes("code-barre") || header.includes("tracking") || header.includes("colis")) {
          row.externalBarcode = value;
        } else if (header.includes("weight") || header.includes("poids")) {
          row.weight = value;
        } else if (header.includes("instruction") || header.includes("note") || header.includes("comment")) {
          row.instructions = value;
        } else if (header.includes("access") || header.includes("acces") || header.includes("digicode")) {
          row.accessCode = value;
        } else if (header.includes("description")) {
          row.description = value;
        }
      });

      if (row.address && row.city && row.postalCode) {
        rows.push(row);
      }
    }

    return rows;
  }

  function handleImportConfirm() {
    if (importData.csvData.length === 0) {
      toast.error("Aucune donnee a importer");
      return;
    }

    setPackages(importData.csvData.map((pkg, index) => ({
      ...pkg,
      id: `temp-${index}`,
      selected: true,
    })));

    setIsImportDialogOpen(false);
    toast.success(`${importData.csvData.length} colis importes`);
  }

  function togglePackageSelection(index: number) {
    setPackages((prev) =>
      prev.map((pkg, i) =>
        i === index ? { ...pkg, selected: !pkg.selected } : pkg
      )
    );
  }

  function toggleAllPackages(selected: boolean) {
    setPackages((prev) => prev.map((pkg) => ({ ...pkg, selected })));
  }

  function removePackage(index: number) {
    setPackages((prev) => prev.filter((_, i) => i !== index));
  }

  const selectedPackages = packages.filter((pkg) => pkg.selected);

  async function handleCreateRoute() {
    if (selectedPackages.length === 0) {
      toast.error("Selectionnez au moins un colis");
      return;
    }

    if (!routeData.scheduledDate) {
      toast.error("La date est requise");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/packages/create-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packages: selectedPackages,
          ...routeData,
          createdById: (session?.user as any)?.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Route ${data.summary.routeNumber} creee avec ${data.summary.stops} stops et ${data.summary.packages} colis`);
        setIsCreateRouteDialogOpen(false);
        setPackages((prev) => prev.filter((pkg) => !pkg.selected));
        setRouteData({
          scheduledDate: new Date().toISOString().split("T")[0],
          contractId: "",
          driverId: "",
          vehicleId: "",
          routeName: "",
        });
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation de la route");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredPackages = packages.filter((pkg) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      pkg.address?.toLowerCase().includes(query) ||
      pkg.city?.toLowerCase().includes(query) ||
      pkg.postalCode?.toLowerCase().includes(query) ||
      pkg.recipientName?.toLowerCase().includes(query) ||
      pkg.externalBarcode?.toLowerCase().includes(query)
    );
  });

  // Group packages by postal code for stats
  const postalCodeGroups = packages.reduce((acc, pkg) => {
    const code = pkg.postalCode?.substring(0, 3) || "Autre";
    acc[code] = (acc[code] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col h-full">
      <Header title="Gestion des Colis" />

      <div className="flex-1 overflow-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[#12121a] border border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Package className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{packages.length}</p>
                <p className="text-sm text-zinc-500">Colis importes</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#12121a] border border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{selectedPackages.length}</p>
                <p className="text-sm text-zinc-500">Selectionnes</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#12121a] border border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <MapPin className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{Object.keys(postalCodeGroups).length}</p>
                <p className="text-sm text-zinc-500">Zones</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#12121a] border border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Route className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {new Set(selectedPackages.map((p) => `${p.address}|${p.postalCode}`)).size}
                </p>
                <p className="text-sm text-zinc-500">Stops estimes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[300px] bg-[#12121a] border-zinc-800"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importer CSV
            </Button>
            <Button
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={() => setIsCreateRouteDialogOpen(true)}
              disabled={selectedPackages.length === 0}
            >
              <Route className="h-4 w-4 mr-2" />
              Creer Route ({selectedPackages.length})
            </Button>
          </div>
        </div>

        {/* Postal Code Groups */}
        {Object.keys(postalCodeGroups).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(postalCodeGroups)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([code, count]) => (
                <Badge
                  key={code}
                  variant="outline"
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-300 cursor-pointer hover:bg-zinc-700/50"
                  onClick={() => setSearchQuery(code)}
                >
                  {code}xxx: {count} colis
                </Badge>
              ))}
          </div>
        )}

        {/* Table */}
        {packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Package className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg mb-2">Aucun colis</p>
            <p className="text-sm mb-4">Importez un fichier CSV pour commencer</p>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importer CSV
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={packages.length > 0 && selectedPackages.length === packages.length}
                      onCheckedChange={(checked) => toggleAllPackages(!!checked)}
                    />
                  </TableHead>
                  <TableHead className="text-zinc-400">Code-barre</TableHead>
                  <TableHead className="text-zinc-400">Destinataire</TableHead>
                  <TableHead className="text-zinc-400">Adresse</TableHead>
                  <TableHead className="text-zinc-400">Ville</TableHead>
                  <TableHead className="text-zinc-400">Code Postal</TableHead>
                  <TableHead className="text-zinc-400">Telephone</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg, index) => (
                  <TableRow
                    key={pkg.id || index}
                    className={`border-zinc-800/50 hover:bg-zinc-800/30 ${
                      pkg.selected ? "bg-cyan-500/5" : ""
                    }`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={pkg.selected}
                        onCheckedChange={() => togglePackageSelection(packages.indexOf(pkg))}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm text-zinc-300">
                      {pkg.externalBarcode || "-"}
                    </TableCell>
                    <TableCell className="text-zinc-100">{pkg.recipientName || "-"}</TableCell>
                    <TableCell className="text-zinc-300 max-w-[200px] truncate">
                      {pkg.address}
                    </TableCell>
                    <TableCell className="text-zinc-300">{pkg.city}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300">
                        {pkg.postalCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400">{pkg.phone || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-red-400"
                        onClick={() => removePackage(packages.indexOf(pkg))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Importer des Colis</DialogTitle>
            <DialogDescription>
              Importez un fichier CSV avec les colonnes: adresse, ville, code postal, destinataire, telephone, code-barre
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Contrat (optionnel)</Label>
              <Select
                value={importData.contractId}
                onValueChange={(v) => setImportData({ ...importData, contractId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectionner un contrat" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {importData.fileName ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <FileSpreadsheet className="h-6 w-6" />
                  <span>{importData.fileName}</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    {importData.csvData.length} colis
                  </Badge>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 mx-auto mb-3 text-zinc-500" />
                  <p className="text-zinc-400">Cliquez ou glissez un fichier CSV</p>
                  <p className="text-xs text-zinc-600 mt-1">Format: CSV avec en-tetes</p>
                </>
              )}
            </div>

            {importData.csvData.length > 0 && (
              <div className="text-sm text-zinc-400">
                <p>Apercu: {importData.csvData.slice(0, 3).map((p) => p.address).join(", ")}...</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                className="border-zinc-700"
                onClick={() => {
                  setIsImportDialogOpen(false);
                  setImportData({ contractId: "", fileName: "", csvData: [] });
                }}
              >
                Annuler
              </Button>
              <Button
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={handleImportConfirm}
                disabled={importData.csvData.length === 0}
              >
                Importer {importData.csvData.length} colis
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Route Dialog */}
      <Dialog open={isCreateRouteDialogOpen} onOpenChange={setIsCreateRouteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Creer une Route</DialogTitle>
            <DialogDescription>
              Creer une route avec {selectedPackages.length} colis selectionnes
              ({new Set(selectedPackages.map((p) => `${p.address}|${p.postalCode}`)).size} stops)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={routeData.scheduledDate}
                  onChange={(e) => setRouteData({ ...routeData, scheduledDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Contrat</Label>
                <Select
                  value={routeData.contractId}
                  onValueChange={(v) => setRouteData({ ...routeData, contractId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Optionnel" />
                  </SelectTrigger>
                  <SelectContent>
                    {contracts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Chauffeur</Label>
                <Select
                  value={routeData.driverId}
                  onValueChange={(v) => setRouteData({ ...routeData, driverId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Optionnel" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vehicule</Label>
                <Select
                  value={routeData.vehicleId}
                  onValueChange={(v) => setRouteData({ ...routeData, vehicleId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Optionnel" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.plateNumber} - {v.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nom de la route (optionnel)</Label>
              <Input
                placeholder="Ex: Route Montreal Nord - 28 Dec"
                value={routeData.routeName}
                onChange={(e) => setRouteData({ ...routeData, routeName: e.target.value })}
              />
            </div>

            <div className="bg-zinc-800/30 rounded-lg p-4">
              <h4 className="font-medium text-zinc-200 mb-2">Resume</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-zinc-400">Colis:</div>
                <div className="text-zinc-100">{selectedPackages.length}</div>
                <div className="text-zinc-400">Stops estimes:</div>
                <div className="text-zinc-100">
                  {new Set(selectedPackages.map((p) => `${p.address}|${p.postalCode}`)).size}
                </div>
                <div className="text-zinc-400">Zones:</div>
                <div className="text-zinc-100">
                  {new Set(selectedPackages.map((p) => p.postalCode?.substring(0, 3))).size}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                className="border-zinc-700"
                onClick={() => setIsCreateRouteDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={handleCreateRoute}
                disabled={isSubmitting || selectedPackages.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creation...
                  </>
                ) : (
                  <>
                    <Route className="h-4 w-4 mr-2" />
                    Creer la Route
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
