# LogiFlow - Code Source Complet

## Table des matieres

- prisma/seed.ts
- src/app/(auth)/layout.tsx
- src/app/(auth)/login/page.tsx
- src/app/(auth)/register/page.tsx
- src/app/(dashboard)/contracts/page.tsx
- src/app/(dashboard)/customers/page.tsx
- src/app/(dashboard)/dashboard/page.tsx
- src/app/(dashboard)/fleet/page.tsx
- src/app/(dashboard)/invoices/page.tsx
- src/app/(dashboard)/layout.tsx
- src/app/(dashboard)/orders/page.tsx
- src/app/(dashboard)/packages/page.tsx
- src/app/(dashboard)/routes/[id]/page.tsx
- src/app/(dashboard)/routes/page.tsx
- src/app/(dashboard)/settings/page.tsx
- src/app/(dashboard)/warehouses/page.tsx
- src/app/(driver)/driver/page.tsx
- src/app/(driver)/driver/route/[id]/page.tsx
- src/app/(driver)/layout.tsx
- src/app/api/auth/[...nextauth]/route.ts
- src/app/api/auth/register/route.ts
- src/app/api/contracts/[id]/route.ts
- src/app/api/contracts/route.ts
- src/app/api/customers/[id]/route.ts
- src/app/api/customers/route.ts
- src/app/api/dashboard/route.ts
- src/app/api/drivers/[id]/route.ts
- src/app/api/drivers/route.ts
- src/app/api/invoices/route.ts
- src/app/api/orders/[id]/route.ts
- src/app/api/orders/route.ts
- src/app/api/packages/create-route/route.ts
- src/app/api/packages/route.ts
- src/app/api/routes/[id]/route.ts
- src/app/api/routes/[id]/stops/[stopId]/route.ts
- src/app/api/routes/[id]/stops/route.ts
- src/app/api/routes/import/route.ts
- src/app/api/routes/route.ts
- src/app/api/tracking/route.ts
- src/app/api/vehicles/[id]/route.ts
- src/app/api/vehicles/route.ts
- src/app/api/warehouses/[id]/route.ts
- src/app/api/warehouses/route.ts
- src/app/layout.tsx
- src/app/page.tsx
- src/app/tracking/page.tsx
- src/components/dashboard/delivery-chart.tsx
- src/components/dashboard/header.tsx
- src/components/dashboard/recent-orders.tsx
- src/components/dashboard/sidebar.tsx
- src/components/dashboard/stats-card.tsx
- src/components/providers.tsx
- src/components/ui/alert-dialog.tsx
- src/components/ui/avatar.tsx
- src/components/ui/badge.tsx
- src/components/ui/button.tsx
- src/components/ui/card.tsx
- src/components/ui/checkbox.tsx
- src/components/ui/dialog.tsx
- src/components/ui/dropdown-menu.tsx
- src/components/ui/form.tsx
- src/components/ui/input.tsx
- src/components/ui/label.tsx
- src/components/ui/select.tsx
- src/components/ui/separator.tsx
- src/components/ui/sheet.tsx
- src/components/ui/sonner.tsx
- src/components/ui/table.tsx
- src/components/ui/tabs.tsx
- src/components/ui/textarea.tsx
- src/lib/auth.ts
- src/lib/prisma.ts
- src/lib/rate-limit.ts
- src/lib/utils.ts
- src/lib/validations.ts
- src/middleware.ts
- src/types/next-auth.d.ts

---

## prisma/seed.ts
```tsx
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@logiflow.com" },
    update: {},
    create: {
      email: "admin@logiflow.com",
      name: "Admin LogiFlow",
      password: hashedPassword,
      role: "ADMIN",
      phone: "01 23 45 67 89",
    },
  });

  console.log("Created admin user:", admin.email);

  // Create dispatcher user
  const dispatcher = await prisma.user.upsert({
    where: { email: "dispatcher@logiflow.com" },
    update: {},
    create: {
      email: "dispatcher@logiflow.com",
      name: "Marie Dispatcher",
      password: hashedPassword,
      role: "DISPATCHER",
      phone: "01 23 45 67 90",
    },
  });

  console.log("Created dispatcher user:", dispatcher.email);

  // Create customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: "jean.dupont@email.com" },
      update: {},
      create: {
        name: "Jean Dupont",
        email: "jean.dupont@email.com",
        phone: "06 12 34 56 78",
        company: "Entreprise ABC",
        address: "12 Rue de la Paix",
        city: "Paris",
        postalCode: "75001",
      },
    }),
    prisma.customer.upsert({
      where: { email: "marie.martin@email.com" },
      update: {},
      create: {
        name: "Marie Martin",
        email: "marie.martin@email.com",
        phone: "06 98 76 54 32",
        company: "Societe XYZ",
        address: "45 Avenue des Champs",
        city: "Lyon",
        postalCode: "69001",
      },
    }),
    prisma.customer.upsert({
      where: { email: "pierre.bernard@email.com" },
      update: {},
      create: {
        name: "Pierre Bernard",
        email: "pierre.bernard@email.com",
        phone: "07 11 22 33 44",
        address: "78 Boulevard Gambetta",
        city: "Marseille",
        postalCode: "13001",
      },
    }),
  ]);

  console.log("Created", customers.length, "customers");

  // Create warehouses
  const warehouses = await Promise.all([
    prisma.warehouse.create({
      data: {
        name: "Entrepot Paris Nord",
        address: "Zone Industrielle Nord",
        city: "Paris",
        postalCode: "93200",
        capacity: 5000,
        currentStock: 3200,
        phone: "01 23 45 67 89",
        email: "paris-nord@logiflow.com",
      },
    }),
    prisma.warehouse.create({
      data: {
        name: "Entrepot Lyon Central",
        address: "Parc Logistique Est",
        city: "Lyon",
        postalCode: "69003",
        capacity: 8000,
        currentStock: 5600,
        phone: "04 56 78 90 12",
        email: "lyon@logiflow.com",
      },
    }),
  ]);

  console.log("Created", warehouses.length, "warehouses");

  // Create driver user and driver profile
  const driverUser = await prisma.user.upsert({
    where: { email: "driver@logiflow.com" },
    update: {},
    create: {
      email: "driver@logiflow.com",
      name: "Pierre Chauffeur",
      password: hashedPassword,
      role: "DRIVER",
      phone: "06 11 22 33 44",
    },
  });

  const driver = await prisma.driver.create({
    data: {
      userId: driverUser.id,
      licenseNumber: "123456789012",
      licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      phone: "06 11 22 33 44",
      isAvailable: true,
    },
  });

  console.log("Created driver:", driver.id);

  // Create vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        plateNumber: "AB-123-CD",
        type: "VAN",
        brand: "Renault",
        model: "Master",
        year: 2022,
        capacity: 1500,
        status: "AVAILABLE",
        driverId: driver.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNumber: "EF-456-GH",
        type: "TRUCK",
        brand: "Mercedes",
        model: "Sprinter",
        year: 2021,
        capacity: 3500,
        status: "IN_USE",
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNumber: "IJ-789-KL",
        type: "VAN",
        brand: "Peugeot",
        model: "Boxer",
        year: 2023,
        capacity: 1200,
        status: "MAINTENANCE",
      },
    }),
  ]);

  console.log("Created", vehicles.length, "vehicles");

  // Create orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        trackingNumber: "LF2024001",
        status: "IN_TRANSIT",
        priority: "HIGH",
        pickupAddress: "12 Rue de la Paix",
        pickupCity: "Paris",
        pickupPostalCode: "75001",
        deliveryAddress: "45 Avenue des Champs",
        deliveryCity: "Lyon",
        deliveryPostalCode: "69001",
        price: 45.50,
        customerId: customers[0].id,
        createdById: admin.id,
        driverId: driver.id,
        vehicleId: vehicles[0].id,
        warehouseId: warehouses[0].id,
        trackingEvents: {
          create: [
            {
              type: "ORDER_CREATED",
              description: "Commande creee",
              location: "Paris",
            },
            {
              type: "PICKED_UP",
              description: "Colis recupere",
              location: "Paris - Entrepot Nord",
            },
            {
              type: "IN_TRANSIT",
              description: "En transit vers la destination",
              location: "Autoroute A6",
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        trackingNumber: "LF2024002",
        status: "DELIVERED",
        priority: "NORMAL",
        pickupAddress: "8 Boulevard Haussmann",
        pickupCity: "Paris",
        pickupPostalCode: "75009",
        deliveryAddress: "23 Rue Nationale",
        deliveryCity: "Marseille",
        deliveryPostalCode: "13001",
        price: 32.00,
        customerId: customers[1].id,
        createdById: admin.id,
        warehouseId: warehouses[0].id,
      },
    }),
    prisma.order.create({
      data: {
        trackingNumber: "LF2024003",
        status: "PENDING",
        priority: "URGENT",
        pickupAddress: "56 Rue du Commerce",
        pickupCity: "Bordeaux",
        pickupPostalCode: "33000",
        deliveryAddress: "78 Avenue Jean Jaures",
        deliveryCity: "Toulouse",
        deliveryPostalCode: "31000",
        price: 89.00,
        customerId: customers[2].id,
        createdById: dispatcher.id,
      },
    }),
  ]);

  console.log("Created", orders.length, "orders");

  // Create settings
  await prisma.settings.create({
    data: {
      companyName: "LogiFlow",
      companyAddress: "123 Avenue de la Logistique, 75001 Paris",
      companyPhone: "01 23 45 67 89",
      companyEmail: "contact@logiflow.com",
      currency: "EUR",
      timezone: "Europe/Paris",
      defaultTaxRate: 20,
    },
  });

  console.log("Created settings");

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```

## src/app/(auth)/layout.tsx
```tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      {children}
    </div>
  );
}

```

## src/app/(auth)/login/page.tsx
```tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema } from "@/lib/validations";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error("Email ou mot de passe incorrect");
      } else {
        toast.success("Connexion reussie");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-[#12121a] border-zinc-800/50">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            <Truck className="h-10 w-10 text-cyan-400" />
            <span className="text-2xl font-bold text-zinc-100">LogiFlow</span>
          </div>
        </div>
        <CardTitle className="text-2xl text-zinc-100">Connexion</CardTitle>
        <CardDescription className="text-zinc-500">
          Entrez vos identifiants pour acceder a votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@logiflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-zinc-500">Pas encore de compte ? </span>
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 hover:underline">
            Creer un compte
          </Link>
        </div>
        <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <p className="text-xs text-zinc-500 text-center">
            Demo: admin@logiflow.com / password123
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

```

## src/app/(auth)/register/page.tsx
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { registerSchema } from "@/lib/validations";
import { toast } from "sonner";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = registerSchema.safeParse({ name, email, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      toast.success("Compte cree avec succes !");
      router.push("/login?registered=true");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-[#12121a] border-zinc-800/50">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            <Truck className="h-10 w-10 text-cyan-400" />
            <span className="text-2xl font-bold text-zinc-100">LogiFlow</span>
          </div>
        </div>
        <CardTitle className="text-2xl text-zinc-100">Creer un compte</CardTitle>
        <CardDescription className="text-zinc-500">
          Remplissez le formulaire pour vous inscrire
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              type="text"
              placeholder="Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jean@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400">{errors.confirmPassword}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inscription...
              </>
            ) : (
              "S'inscrire"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-zinc-500">Deja un compte ? </span>
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 hover:underline">
            Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

```

## src/app/(dashboard)/contracts/page.tsx
```tsx
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Loader2, Building2, Package, Route } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface Contract {
  id: string;
  name: string;
  code: string;
  type: "SUBCONTRACTOR" | "DIRECT";
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  city: string | null;
  ratePerStop: number | null;
  ratePerPackage: number | null;
  ratePerKm: number | null;
  isActive: boolean;
  _count: {
    routes: number;
    packages: number;
  };
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: "",
    name: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "SUBCONTRACTOR",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    ratePerStop: "",
    ratePerPackage: "",
    ratePerKm: "",
  });

  useEffect(() => {
    fetchContracts();
  }, [searchTerm, typeFilter]);

  async function fetchContracts() {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (typeFilter !== "all") params.set("type", typeFilter);

      const res = await fetch(`/api/contracts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setContracts(data);
      }
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      code: "",
      type: "SUBCONTRACTOR",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      city: "",
      postalCode: "",
      notes: "",
      ratePerStop: "",
      ratePerPackage: "",
      ratePerKm: "",
    });
    setEditingContract(null);
  }

  function openEditDialog(contract: Contract) {
    setEditingContract(contract);
    setFormData({
      name: contract.name,
      code: contract.code,
      type: contract.type,
      contactName: contract.contactName || "",
      contactEmail: contract.contactEmail || "",
      contactPhone: contract.contactPhone || "",
      address: contract.address || "",
      city: contract.city || "",
      postalCode: "",
      notes: "",
      ratePerStop: contract.ratePerStop?.toString() || "",
      ratePerPackage: contract.ratePerPackage?.toString() || "",
      ratePerKm: contract.ratePerKm?.toString() || "",
    });
    setIsCreateDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingContract
        ? `/api/contracts/${editingContract.id}`
        : "/api/contracts";
      const method = editingContract ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingContract ? "Contrat mis a jour" : "Contrat cree avec succes");
        setIsCreateDialogOpen(false);
        resetForm();
        fetchContracts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde du contrat");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/contracts/${deleteDialog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.softDeleted) {
          toast.success("Contrat desactive (routes existantes)");
        } else {
          toast.success("Contrat supprime");
        }
        fetchContracts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteDialog({ open: false, id: "", name: "" });
    }
  }

  const stats = {
    total: contracts.length,
    subcontractors: contracts.filter((c) => c.type === "SUBCONTRACTOR").length,
    direct: contracts.filter((c) => c.type === "DIRECT").length,
    totalRoutes: contracts.reduce((acc, c) => acc + c._count.routes, 0),
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Contrats" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Total contrats</p>
            <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Sous-traitance</p>
            <p className="text-2xl font-bold text-orange-400">{stats.subcontractors}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Clients directs</p>
            <p className="text-2xl font-bold text-cyan-400">{stats.direct}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Total routes</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.totalRoutes}</p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Rechercher par nom ou code..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="SUBCONTRACTOR">Sous-traitance</SelectItem>
                <SelectItem value="DIRECT">Client direct</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau contrat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingContract ? "Modifier le contrat" : "Creer un contrat"}
                </DialogTitle>
                <DialogDescription>
                  {editingContract
                    ? "Modifiez les informations du contrat"
                    : "Ajoutez un nouveau contrat de sous-traitance ou client direct"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Nom du contrat</Label>
                    <Input
                      placeholder="Ex: Amazon Logistics"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input
                      placeholder="Ex: AMZN"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Type de contrat</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUBCONTRACTOR">Sous-traitance</SelectItem>
                      <SelectItem value="DIRECT">Client direct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Contact</Label>
                    <Input
                      placeholder="Nom du contact"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="email@exemple.com"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telephone</Label>
                    <Input
                      placeholder="06 12 34 56 78"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input
                      placeholder="Adresse"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input
                      placeholder="Ville"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <Label className="text-base font-semibold">Tarification</Label>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-500">Par stop (EUR)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.ratePerStop}
                        onChange={(e) => setFormData({ ...formData, ratePerStop: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-500">Par colis (EUR)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.ratePerPackage}
                        onChange={(e) => setFormData({ ...formData, ratePerPackage: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-500">Par km (EUR)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.ratePerKm}
                        onChange={(e) => setFormData({ ...formData, ratePerKm: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingContract ? "Mettre a jour" : "Creer le contrat"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contracts table */}
        <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Contrat</TableHead>
                  <TableHead className="text-zinc-400">Type</TableHead>
                  <TableHead className="text-zinc-400">Contact</TableHead>
                  <TableHead className="text-zinc-400">Tarification</TableHead>
                  <TableHead className="text-zinc-400">Routes</TableHead>
                  <TableHead className="text-zinc-400">Colis</TableHead>
                  <TableHead className="text-right text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-200">{contract.name}</p>
                          <p className="text-sm text-zinc-500">{contract.code}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          contract.type === "SUBCONTRACTOR"
                            ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                            : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                        }
                      >
                        {contract.type === "SUBCONTRACTOR" ? "Sous-traitance" : "Client direct"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {contract.contactName && <p className="text-zinc-300">{contract.contactName}</p>}
                        {contract.contactEmail && (
                          <p className="text-zinc-500">{contract.contactEmail}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1 text-zinc-300">
                        {contract.ratePerStop && (
                          <p>{formatCurrency(contract.ratePerStop)}/stop</p>
                        )}
                        {contract.ratePerPackage && (
                          <p>{formatCurrency(contract.ratePerPackage)}/colis</p>
                        )}
                        {contract.ratePerKm && (
                          <p>{formatCurrency(contract.ratePerKm)}/km</p>
                        )}
                        {!contract.ratePerStop && !contract.ratePerPackage && !contract.ratePerKm && (
                          <p className="text-zinc-500">Non defini</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-zinc-300">
                        <Route className="h-4 w-4 text-zinc-500" />
                        <span>{contract._count.routes}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-zinc-300">
                        <Package className="h-4 w-4 text-zinc-500" />
                        <span>{contract._count.packages}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                          onClick={() => openEditDialog(contract)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => setDeleteDialog({
                            open: true,
                            id: contract.id,
                            name: contract.name,
                          })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {contracts.length === 0 && (
                  <TableRow className="border-zinc-800/50">
                    <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                      Aucun contrat trouve
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer le contrat <strong>{deleteDialog.name}</strong> ?
              Si le contrat a des routes, il sera desactive au lieu d etre supprime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

```

## src/app/(dashboard)/customers/page.tsx
```tsx
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Mail, Phone, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string;
  city: string;
  postalCode: string;
  ordersCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: "",
    name: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  async function fetchCustomers() {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);

      const res = await fetch(`/api/customers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Client cree avec succes");
        setIsCreateDialogOpen(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          address: "",
          city: "",
          postalCode: "",
          notes: "",
        });
        fetchCustomers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation du client");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/customers/${deleteDialog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.softDeleted) {
          toast.success("Client desactive (commandes existantes)");
        } else {
          toast.success("Client supprime");
        }
        fetchCustomers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteDialog({ open: false, id: "", name: "" });
    }
  }

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.isActive).length,
    companies: customers.filter((c) => c.company).length,
    totalOrders: customers.reduce((acc, c) => acc + c.ordersCount, 0),
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Clients" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Total clients</p>
            <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Clients actifs</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Entreprises</p>
            <p className="text-2xl font-bold text-cyan-400">{stats.companies}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Total commandes</p>
            <p className="text-2xl font-bold text-violet-400">{stats.totalOrders}</p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Rechercher par nom, email ou entreprise..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Ajouter un client</DialogTitle>
                <DialogDescription>
                  Remplissez les informations du nouveau client
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom complet</Label>
                    <Input
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Entreprise</Label>
                    <Input
                      placeholder="Optionnel"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="email@exemple.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telephone</Label>
                    <Input
                      placeholder="06 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input
                    placeholder="Adresse complete"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input
                      placeholder="Paris"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Code postal</Label>
                    <Input
                      placeholder="75001"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Notes sur le client..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Ajouter le client
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Customers table */}
        <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Client</TableHead>
                  <TableHead className="text-zinc-400">Contact</TableHead>
                  <TableHead className="text-zinc-400">Adresse</TableHead>
                  <TableHead className="text-zinc-400">Commandes</TableHead>
                  <TableHead className="text-zinc-400">Statut</TableHead>
                  <TableHead className="text-zinc-400">Inscription</TableHead>
                  <TableHead className="text-right text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-zinc-200">{customer.name}</p>
                        {customer.company && (
                          <p className="text-sm text-zinc-500">{customer.company}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-zinc-300">
                          <Mail className="h-3 w-3 text-zinc-500" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1 text-sm text-zinc-500">
                            <Phone className="h-3 w-3 text-zinc-500" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-zinc-300">{customer.address}</p>
                        <p className="text-zinc-500">
                          {customer.postalCode} {customer.city}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-zinc-200">{customer.ordersCount}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          customer.isActive
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                            : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20"
                        }
                      >
                        {customer.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {formatDate(customer.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => setDeleteDialog({
                            open: true,
                            id: customer.id,
                            name: customer.name,
                          })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {customers.length === 0 && (
                  <TableRow className="border-zinc-800/50">
                    <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                      Aucun client trouve
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer le client <strong>{deleteDialog.name}</strong> ?
              Si le client a des commandes, il sera desactive au lieu d etre supprime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

```

## src/app/(dashboard)/dashboard/page.tsx
```tsx
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

```

## src/app/(dashboard)/fleet/page.tsx
```tsx
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Truck, User, Wrench, Loader2 } from "lucide-react";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  capacity: number | null;
  status: string;
  driverName: string | null;
  lastMaintenanceDate: string | null;
}

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  licenseNumber: string;
  licenseExpiry: string;
  isAvailable: boolean;
  vehicle: string | null;
  deliveriesCount: number;
}

const vehicleTypeLabels: Record<string, string> = {
  VAN: "Fourgon",
  TRUCK: "Camion",
  MOTORCYCLE: "Moto",
  BICYCLE: "Velo",
  CAR: "Voiture",
};

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: "vehicle" | "driver"; id: string; name: string }>({
    open: false,
    type: "vehicle",
    id: "",
    name: "",
  });

  const [vehicleForm, setVehicleForm] = useState({
    plateNumber: "",
    type: "",
    brand: "",
    model: "",
    year: "",
    capacity: "",
  });

  const [driverForm, setDriverForm] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [vehiclesRes, driversRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/drivers"),
      ]);

      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json();
        setVehicles(vehiclesData);
      }
      if (driversRes.ok) {
        const driversData = await driversRes.json();
        setDrivers(driversData);
      }
    } catch (error) {
      console.error("Failed to fetch fleet data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleVehicleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleForm),
      });

      if (res.ok) {
        toast.success("Vehicule ajoute avec succes");
        setIsVehicleDialogOpen(false);
        setVehicleForm({
          plateNumber: "",
          type: "",
          brand: "",
          model: "",
          year: "",
          capacity: "",
        });
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation du vehicule");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDriverSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driverForm),
      });

      if (res.ok) {
        toast.success("Chauffeur ajoute avec succes");
        setIsDriverDialogOpen(false);
        setDriverForm({
          name: "",
          email: "",
          phone: "",
          licenseNumber: "",
          licenseExpiry: "",
        });
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation du chauffeur");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    const { type, id } = deleteDialog;
    const endpoint = type === "vehicle" ? "/api/vehicles" : "/api/drivers";

    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(type === "vehicle" ? "Vehicule supprime" : "Chauffeur supprime");
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteDialog({ open: false, type: "vehicle", id: "", name: "" });
    }
  }

  const filteredVehicles = vehicles.filter((v) =>
    v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter((v) => v.status === "AVAILABLE").length,
    totalDrivers: drivers.length,
    inMaintenance: vehicles.filter((v) => v.status === "MAINTENANCE").length,
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Flotte" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cyan-500/20 p-2">
                <Truck className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Vehicules</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.totalVehicles}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/20 p-2">
                <Truck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Disponibles</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {stats.availableVehicles}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-violet-500/20 p-2">
                <User className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Chauffeurs</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.totalDrivers}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-500/20 p-2">
                <Wrench className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">En maintenance</p>
                <p className="text-2xl font-bold text-orange-400">
                  {stats.inMaintenance}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="vehicles" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-zinc-800">Vehicules</TabsTrigger>
            <TabsTrigger value="drivers" className="data-[state=active]:bg-zinc-800">Chauffeurs</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="space-y-4">
            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Rechercher par immatriculation..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un vehicule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un vehicule</DialogTitle>
                    <DialogDescription>
                      Enregistrez un nouveau vehicule dans la flotte
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleVehicleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Immatriculation</Label>
                        <Input
                          placeholder="AB-123-CD"
                          value={vehicleForm.plateNumber}
                          onChange={(e) =>
                            setVehicleForm({ ...vehicleForm, plateNumber: e.target.value.toUpperCase() })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={vehicleForm.type}
                          onValueChange={(v) => setVehicleForm({ ...vehicleForm, type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type de vehicule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VAN">Fourgon</SelectItem>
                            <SelectItem value="TRUCK">Camion</SelectItem>
                            <SelectItem value="MOTORCYCLE">Moto</SelectItem>
                            <SelectItem value="CAR">Voiture</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Marque</Label>
                        <Input
                          placeholder="Renault"
                          value={vehicleForm.brand}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Modele</Label>
                        <Input
                          placeholder="Master"
                          value={vehicleForm.model}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Annee</Label>
                        <Input
                          type="number"
                          placeholder="2023"
                          value={vehicleForm.year}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Capacite (kg)</Label>
                        <Input
                          type="number"
                          placeholder="1500"
                          value={vehicleForm.capacity}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setIsVehicleDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={isSubmitting || !vehicleForm.plateNumber || !vehicleForm.type}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Ajouter
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Vehicles table */}
            <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800/50 hover:bg-transparent">
                      <TableHead className="text-zinc-400">Immatriculation</TableHead>
                      <TableHead className="text-zinc-400">Type</TableHead>
                      <TableHead className="text-zinc-400">Vehicule</TableHead>
                      <TableHead className="text-zinc-400">Capacite</TableHead>
                      <TableHead className="text-zinc-400">Chauffeur</TableHead>
                      <TableHead className="text-zinc-400">Statut</TableHead>
                      <TableHead className="text-zinc-400">Derniere maintenance</TableHead>
                      <TableHead className="text-right text-zinc-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                        <TableCell className="font-medium text-zinc-200">{vehicle.plateNumber}</TableCell>
                        <TableCell className="text-zinc-300">{vehicleTypeLabels[vehicle.type] || vehicle.type}</TableCell>
                        <TableCell className="text-zinc-300">
                          {vehicle.brand} {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ""}
                        </TableCell>
                        <TableCell className="text-zinc-300">{vehicle.capacity ? `${vehicle.capacity} kg` : "-"}</TableCell>
                        <TableCell className="text-zinc-300">{vehicle.driverName || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(vehicle.status)}>
                            {getStatusLabel(vehicle.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-zinc-500">
                          {vehicle.lastMaintenanceDate ? formatDate(vehicle.lastMaintenanceDate) : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => setDeleteDialog({
                                open: true,
                                type: "vehicle",
                                id: vehicle.id,
                                name: vehicle.plateNumber,
                              })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredVehicles.length === 0 && (
                      <TableRow className="border-zinc-800/50">
                        <TableCell colSpan={8} className="text-center py-8 text-zinc-500">
                          Aucun vehicule trouve
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-4">
            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Rechercher un chauffeur..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un chauffeur
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un chauffeur</DialogTitle>
                    <DialogDescription>
                      Enregistrez un nouveau chauffeur
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleDriverSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nom complet</Label>
                      <Input
                        placeholder="Jean Dupont"
                        value={driverForm.name}
                        onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="jean.dupont@email.com"
                        value={driverForm.email}
                        onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Telephone</Label>
                        <Input
                          placeholder="06 12 34 56 78"
                          value={driverForm.phone}
                          onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>N Permis</Label>
                        <Input
                          placeholder="123456789012"
                          value={driverForm.licenseNumber}
                          onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Expiration du permis</Label>
                      <Input
                        type="date"
                        value={driverForm.licenseExpiry}
                        onChange={(e) => setDriverForm({ ...driverForm, licenseExpiry: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setIsDriverDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={isSubmitting || !driverForm.name || !driverForm.email || !driverForm.licenseNumber}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Ajouter
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Drivers table */}
            <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800/50 hover:bg-transparent">
                      <TableHead className="text-zinc-400">Chauffeur</TableHead>
                      <TableHead className="text-zinc-400">Telephone</TableHead>
                      <TableHead className="text-zinc-400">N Permis</TableHead>
                      <TableHead className="text-zinc-400">Expiration</TableHead>
                      <TableHead className="text-zinc-400">Vehicule</TableHead>
                      <TableHead className="text-zinc-400">Livraisons</TableHead>
                      <TableHead className="text-zinc-400">Statut</TableHead>
                      <TableHead className="text-right text-zinc-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                        <TableCell>
                          <div>
                            <p className="font-medium text-zinc-200">{driver.name}</p>
                            <p className="text-sm text-zinc-500">{driver.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-300">{driver.phone || "-"}</TableCell>
                        <TableCell className="text-zinc-300">{driver.licenseNumber}</TableCell>
                        <TableCell className="text-zinc-500">
                          {formatDate(driver.licenseExpiry)}
                        </TableCell>
                        <TableCell className="text-zinc-300">{driver.vehicle || "-"}</TableCell>
                        <TableCell className="text-zinc-300">{driver.deliveriesCount}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              driver.isAvailable
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                            }
                          >
                            {driver.isAvailable ? "Disponible" : "En course"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => setDeleteDialog({
                                open: true,
                                type: "driver",
                                id: driver.id,
                                name: driver.name,
                              })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredDrivers.length === 0 && (
                      <TableRow className="border-zinc-800/50">
                        <TableCell colSpan={8} className="text-center py-8 text-zinc-500">
                          Aucun chauffeur trouve
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer {deleteDialog.type === "vehicle" ? "le vehicule" : "le chauffeur"}{" "}
              <strong>{deleteDialog.name}</strong> ? Cette action est irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

```

## src/app/(dashboard)/invoices/page.tsx
```tsx
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Eye, Download, Send, FileText, Euro, Loader2 } from "lucide-react";
import { getStatusColor, getStatusLabel, formatDate, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  company: string | null;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: string;
  ordersCount: number;
}

interface Customer {
  id: string;
  name: string;
  company: string | null;
}

interface Order {
  id: string;
  trackingNumber: string;
  price: number;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    customerId: "",
    dueDate: "",
    taxRate: "20",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, [statusFilter, searchTerm]);

  async function fetchData() {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchTerm) params.set("search", searchTerm);

      const [invoicesRes, customersRes] = await Promise.all([
        fetch(`/api/invoices?${params}`),
        fetch("/api/customers"),
      ]);

      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json();
        setInvoices(invoicesData);
      }
      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomerOrders(customerId: string) {
    try {
      const res = await fetch(`/api/orders?customerId=${customerId}&status=DELIVERED`);
      if (res.ok) {
        const data = await res.json();
        setCustomerOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch customer orders:", error);
    }
  }

  function handleCustomerChange(customerId: string) {
    setFormData({ ...formData, customerId });
    setSelectedOrders([]);
    if (customerId) {
      fetchCustomerOrders(customerId);
    } else {
      setCustomerOrders([]);
    }
  }

  function toggleOrderSelection(orderId: string) {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          orderIds: selectedOrders,
        }),
      });

      if (res.ok) {
        toast.success("Facture creee avec succes");
        setIsDialogOpen(false);
        setFormData({
          customerId: "",
          dueDate: "",
          taxRate: "20",
          notes: "",
        });
        setSelectedOrders([]);
        setCustomerOrders([]);
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation de la facture");
    } finally {
      setIsSubmitting(false);
    }
  }

  const stats = {
    total: invoices.length,
    totalPaid: invoices
      .filter((i) => i.status === "PAID")
      .reduce((acc, i) => acc + i.total, 0),
    totalPending: invoices
      .filter((i) => i.status === "SENT")
      .reduce((acc, i) => acc + i.total, 0),
    totalOverdue: invoices
      .filter((i) => i.status === "OVERDUE")
      .reduce((acc, i) => acc + i.total, 0),
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Facturation" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cyan-500/20 p-2">
                <FileText className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total factures</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/20 p-2">
                <Euro className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Encaisse</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(stats.totalPaid)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cyan-500/20 p-2">
                <Euro className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">En attente</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {formatCurrency(stats.totalPending)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-500/20 p-2">
                <Euro className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">En retard</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(stats.totalOverdue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Rechercher par numero ou client..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="DRAFT">Brouillon</SelectItem>
                <SelectItem value="SENT">Envoyee</SelectItem>
                <SelectItem value="PAID">Payee</SelectItem>
                <SelectItem value="OVERDUE">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle facture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Creer une facture</DialogTitle>
                <DialogDescription>
                  Selectionnez un client et les commandes a facturer
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={handleCustomerChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} {c.company && `(${c.company})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date d emission</Label>
                    <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Date d echeance</Label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Commandes a inclure</Label>
                  <div className="border border-zinc-700 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto bg-zinc-900/50">
                    {customerOrders.length === 0 ? (
                      <p className="text-sm text-zinc-500">
                        {formData.customerId
                          ? "Aucune commande livree pour ce client"
                          : "Selectionnez d'abord un client"}
                      </p>
                    ) : (
                      customerOrders.map((order) => (
                        <label key={order.id} className="flex items-center gap-2 text-zinc-300">
                          <input
                            type="checkbox"
                            className="rounded bg-zinc-800 border-zinc-600"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => toggleOrderSelection(order.id)}
                          />
                          <span>
                            {order.trackingNumber} - {formatCurrency(order.price)}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Taux TVA (%)</Label>
                    <Input
                      type="number"
                      value={formData.taxRate}
                      onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      placeholder="Optionnel"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !formData.customerId || selectedOrders.length === 0}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Creer la facture
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Invoices table */}
        <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="text-zinc-400">N Facture</TableHead>
                  <TableHead className="text-zinc-400">Client</TableHead>
                  <TableHead className="text-zinc-400">Date emission</TableHead>
                  <TableHead className="text-zinc-400">Echeance</TableHead>
                  <TableHead className="text-zinc-400">Commandes</TableHead>
                  <TableHead className="text-zinc-400">Montant HT</TableHead>
                  <TableHead className="text-zinc-400">TVA</TableHead>
                  <TableHead className="text-zinc-400">Total TTC</TableHead>
                  <TableHead className="text-zinc-400">Statut</TableHead>
                  <TableHead className="text-right text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                    <TableCell className="font-medium text-zinc-200">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-zinc-200">{invoice.customer}</p>
                        {invoice.company && (
                          <p className="text-sm text-zinc-500">{invoice.company}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {formatDate(invoice.issueDate)}
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {formatDate(invoice.dueDate)}
                    </TableCell>
                    <TableCell className="text-zinc-300">{invoice.ordersCount}</TableCell>
                    <TableCell className="text-zinc-300">{formatCurrency(invoice.subtotal)}</TableCell>
                    <TableCell className="text-zinc-300">{formatCurrency(invoice.taxAmount)}</TableCell>
                    <TableCell className="font-semibold text-zinc-200">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Voir" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Telecharger PDF" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status === "DRAFT" && (
                          <Button variant="ghost" size="icon" title="Envoyer" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow className="border-zinc-800/50">
                    <TableCell colSpan={10} className="text-center py-8 text-zinc-500">
                      Aucune facture trouvee
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

```

## src/app/(dashboard)/layout.tsx
```tsx
import { Sidebar } from "@/components/dashboard/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0a0a0f]">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>

      <Toaster theme="dark" />
    </div>
  );
}

```

## src/app/(dashboard)/orders/page.tsx
```tsx
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { getStatusColor, getStatusLabel, formatDate, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface Order {
  id: string;
  trackingNumber: string;
  customer: { name: string };
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  status: string;
  priority: string;
  price: number;
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  company?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; trackingNumber: string }>({
    open: false,
    id: "",
    trackingNumber: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    customerId: "",
    priority: "NORMAL",
    pickupAddress: "",
    pickupCity: "",
    pickupPostalCode: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryPostalCode: "",
    weight: "",
    price: "",
    specialInstructions: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, [statusFilter, searchTerm]);

  async function fetchOrders() {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchTerm) params.set("search", searchTerm);

      const res = await fetch(`/api/orders?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomers() {
    try {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Commande creee avec succes");
        setIsCreateDialogOpen(false);
        setFormData({
          customerId: "",
          priority: "NORMAL",
          pickupAddress: "",
          pickupCity: "",
          pickupPostalCode: "",
          deliveryAddress: "",
          deliveryCity: "",
          deliveryPostalCode: "",
          weight: "",
          price: "",
          specialInstructions: "",
        });
        fetchOrders();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation de la commande");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/orders/${deleteDialog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.cancelled) {
          toast.success("Commande annulee");
        } else {
          toast.success("Commande supprimee");
        }
        fetchOrders();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteDialog({ open: false, id: "", trackingNumber: "" });
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Commandes" />

      <div className="flex-1 p-6 space-y-6">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Rechercher par numero ou client..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="CONFIRMED">Confirmee</SelectItem>
                <SelectItem value="IN_TRANSIT">En transit</SelectItem>
                <SelectItem value="OUT_FOR_DELIVERY">En livraison</SelectItem>
                <SelectItem value="DELIVERED">Livree</SelectItem>
                <SelectItem value="CANCELLED">Annulee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle commande
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Creer une nouvelle commande</DialogTitle>
                <DialogDescription>
                  Remplissez les informations de la commande
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(v) => setFormData({ ...formData, customerId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un client" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} {c.company && `(${c.company})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priorite</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(v) => setFormData({ ...formData, priority: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Basse</SelectItem>
                        <SelectItem value="NORMAL">Normale</SelectItem>
                        <SelectItem value="HIGH">Haute</SelectItem>
                        <SelectItem value="URGENT">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Adresse de ramassage</Label>
                  <Input
                    placeholder="Adresse complete"
                    value={formData.pickupAddress}
                    onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Ville"
                      value={formData.pickupCity}
                      onChange={(e) => setFormData({ ...formData, pickupCity: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Code postal"
                      value={formData.pickupPostalCode}
                      onChange={(e) => setFormData({ ...formData, pickupPostalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Adresse de livraison</Label>
                  <Input
                    placeholder="Adresse complete"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Ville"
                      value={formData.deliveryCity}
                      onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Code postal"
                      value={formData.deliveryPostalCode}
                      onChange={(e) => setFormData({ ...formData, deliveryPostalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Poids (kg)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prix (EUR)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Instructions speciales</Label>
                  <Textarea
                    placeholder="Instructions pour le livreur..."
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !formData.customerId}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Creer la commande
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Orders table */}
        <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="text-zinc-400">N Tracking</TableHead>
                  <TableHead className="text-zinc-400">Client</TableHead>
                  <TableHead className="text-zinc-400">Destination</TableHead>
                  <TableHead className="text-zinc-400">Statut</TableHead>
                  <TableHead className="text-zinc-400">Priorite</TableHead>
                  <TableHead className="text-zinc-400">Prix</TableHead>
                  <TableHead className="text-zinc-400">Date</TableHead>
                  <TableHead className="text-right text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                    <TableCell className="font-medium text-zinc-200">{order.trackingNumber}</TableCell>
                    <TableCell className="text-zinc-300">{order.customer.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-zinc-400">
                      {order.deliveryAddress}, {order.deliveryCity}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.priority)}>
                        {getStatusLabel(order.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-300">{formatCurrency(order.price)}</TableCell>
                    <TableCell className="text-zinc-500">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => setDeleteDialog({
                            open: true,
                            id: order.id,
                            trackingNumber: order.trackingNumber,
                          })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow className="border-zinc-800/50">
                    <TableCell colSpan={8} className="text-center py-8 text-zinc-500">
                      Aucune commande trouvee
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer la commande <strong>{deleteDialog.trackingNumber}</strong> ?
              Si la commande n est pas en attente, elle sera annulee au lieu d etre supprimee.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

```

## src/app/(dashboard)/packages/page.tsx
```tsx
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

```

## src/app/(dashboard)/routes/[id]/page.tsx
```tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Plus,
  Loader2,
  MapPin,
  Package,
  Phone,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Play,
  Edit,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface RouteStop {
  id: string;
  stopNumber: number;
  status: "PENDING" | "IN_PROGRESS" | "ARRIVED" | "COMPLETED" | "FAILED" | "SKIPPED";
  recipientName: string | null;
  address: string;
  city: string;
  postalCode: string;
  phone: string | null;
  accessCode: string | null;
  instructions: string | null;
  signature: string | null;
  signedBy: string | null;
  proofPhoto: string | null;
  deliveryNotes: string | null;
  failureReason: string | null;
  actualArrival: string | null;
  packages: {
    id: string;
    barcode: string;
    externalBarcode: string | null;
    status: string;
    weight: number | null;
    description: string | null;
  }[];
}

interface RouteDetails {
  id: string;
  routeNumber: string;
  name: string | null;
  status: "DRAFT" | "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  scheduledDate: string;
  startTime: string | null;
  endTime: string | null;
  totalStops: number;
  completedStops: number;
  totalPackages: number;
  deliveredPackages: number;
  notes: string | null;
  contract: { id: string; name: string; code: string } | null;
  driver: { id: string; user: { name: string; phone: string | null } } | null;
  vehicle: { id: string; plateNumber: string; type: string } | null;
  createdBy: { name: string } | null;
  stops: RouteStop[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: "En attente", color: "bg-gray-100 text-gray-800", icon: Clock },
  IN_PROGRESS: { label: "En route", color: "bg-blue-100 text-blue-800", icon: Play },
  ARRIVED: { label: "Arrive", color: "bg-yellow-100 text-yellow-800", icon: MapPin },
  COMPLETED: { label: "Livre", color: "bg-green-100 text-green-800", icon: CheckCircle },
  FAILED: { label: "Echec", color: "bg-red-100 text-red-800", icon: XCircle },
  SKIPPED: { label: "Saute", color: "bg-orange-100 text-orange-800", icon: XCircle },
};

export default function RouteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string;

  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddStopDialogOpen, setIsAddStopDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteStopDialog, setDeleteStopDialog] = useState<{ open: boolean; id: string; address: string }>({
    open: false,
    id: "",
    address: "",
  });

  const [stopFormData, setStopFormData] = useState({
    recipientName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    accessCode: "",
    instructions: "",
    packages: [{ externalBarcode: "", weight: "", description: "" }],
  });

  useEffect(() => {
    fetchRoute();
  }, [routeId]);

  async function fetchRoute() {
    try {
      const res = await fetch(`/api/routes/${routeId}`);
      if (res.ok) {
        const data = await res.json();
        setRoute(data);
      } else {
        toast.error("Route non trouvee");
        router.push("/routes");
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  function resetStopForm() {
    setStopFormData({
      recipientName: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      accessCode: "",
      instructions: "",
      packages: [{ externalBarcode: "", weight: "", description: "" }],
    });
  }

  function addPackageField() {
    setStopFormData({
      ...stopFormData,
      packages: [...stopFormData.packages, { externalBarcode: "", weight: "", description: "" }],
    });
  }

  function updatePackage(index: number, field: string, value: string) {
    const newPackages = [...stopFormData.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setStopFormData({ ...stopFormData, packages: newPackages });
  }

  function removePackage(index: number) {
    if (stopFormData.packages.length > 1) {
      const newPackages = stopFormData.packages.filter((_, i) => i !== index);
      setStopFormData({ ...stopFormData, packages: newPackages });
    }
  }

  async function handleAddStop(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/routes/${routeId}/stops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...stopFormData,
          packages: stopFormData.packages.filter((p) => p.externalBarcode),
        }),
      });

      if (res.ok) {
        toast.success("Stop ajoute");
        setIsAddStopDialogOpen(false);
        resetStopForm();
        fetchRoute();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de l'ajout");
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout du stop");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteStop() {
    try {
      const res = await fetch(`/api/routes/${routeId}/stops/${deleteStopDialog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Stop supprime");
        fetchRoute();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteStopDialog({ open: false, id: "", address: "" });
    }
  }

  async function handleStartRoute() {
    try {
      const res = await fetch(`/api/routes/${routeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "IN_PROGRESS",
          startTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        toast.success("Route demarree");
        fetchRoute();
      }
    } catch (error) {
      toast.error("Erreur lors du demarrage");
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Chargement..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!route) {
    return null;
  }

  const progress = route.totalStops > 0
    ? Math.round((route.completedStops / route.totalStops) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full">
      <Header title={route.routeNumber} />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Back button and actions */}
        <div className="flex items-center justify-between">
          <Link href="/routes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux routes
            </Button>
          </Link>
          <div className="flex gap-2">
            {route.status === "DRAFT" && route.totalStops > 0 && (
              <Button onClick={handleStartRoute}>
                <Play className="mr-2 h-4 w-4" />
                Demarrer la route
              </Button>
            )}
          </div>
        </div>

        {/* Route info card */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{route.routeNumber}</h2>
              {route.name && <p className="text-slate-500">{route.name}</p>}
              <div className="flex items-center gap-4 mt-3">
                <Badge className={statusConfig[route.status]?.color}>
                  {statusConfig[route.status]?.label}
                </Badge>
                {route.contract && (
                  <Badge variant="outline">{route.contract.code}</Badge>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Date</p>
                <p className="font-medium">{formatDate(route.scheduledDate)}</p>
              </div>
              <div>
                <p className="text-slate-500">Chauffeur</p>
                <p className="font-medium">{route.driver?.user.name || "Non assigne"}</p>
              </div>
              <div>
                <p className="text-slate-500">Vehicule</p>
                <p className="font-medium">{route.vehicle?.plateNumber || "Non assigne"}</p>
              </div>
              <div>
                <p className="text-slate-500">Progres</p>
                <p className="font-medium">{progress}%</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>{route.completedStops} / {route.totalStops} stops</span>
              <span>{route.deliveredPackages} / {route.totalPackages} colis</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stops section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Stops ({route.stops.length})</h3>
            {route.status === "DRAFT" && (
              <Dialog open={isAddStopDialogOpen} onOpenChange={setIsAddStopDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un stop
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter un stop</DialogTitle>
                    <DialogDescription>
                      Ajoutez une adresse de livraison avec ses colis
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddStop} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label>Destinataire</Label>
                        <Input
                          placeholder="Nom du destinataire"
                          value={stopFormData.recipientName}
                          onChange={(e) => setStopFormData({ ...stopFormData, recipientName: e.target.value })}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Adresse</Label>
                        <Input
                          placeholder="Adresse complete"
                          value={stopFormData.address}
                          onChange={(e) => setStopFormData({ ...stopFormData, address: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ville</Label>
                        <Input
                          placeholder="Ville"
                          value={stopFormData.city}
                          onChange={(e) => setStopFormData({ ...stopFormData, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Code postal</Label>
                        <Input
                          placeholder="Code postal"
                          value={stopFormData.postalCode}
                          onChange={(e) => setStopFormData({ ...stopFormData, postalCode: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telephone</Label>
                        <Input
                          placeholder="06 12 34 56 78"
                          value={stopFormData.phone}
                          onChange={(e) => setStopFormData({ ...stopFormData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Code d acces</Label>
                        <Input
                          placeholder="Code immeuble"
                          value={stopFormData.accessCode}
                          onChange={(e) => setStopFormData({ ...stopFormData, accessCode: e.target.value })}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Instructions</Label>
                        <Textarea
                          placeholder="Instructions de livraison..."
                          value={stopFormData.instructions}
                          onChange={(e) => setStopFormData({ ...stopFormData, instructions: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Packages */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-base font-semibold">Colis</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addPackageField}>
                          <Plus className="mr-1 h-3 w-3" />
                          Ajouter colis
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {stopFormData.packages.map((pkg, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <Input
                              placeholder="Code-barre externe"
                              value={pkg.externalBarcode}
                              onChange={(e) => updatePackage(index, "externalBarcode", e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Poids (kg)"
                              type="number"
                              step="0.1"
                              value={pkg.weight}
                              onChange={(e) => updatePackage(index, "weight", e.target.value)}
                              className="w-24"
                            />
                            <Input
                              placeholder="Description"
                              value={pkg.description}
                              onChange={(e) => updatePackage(index, "description", e.target.value)}
                              className="flex-1"
                            />
                            {stopFormData.packages.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removePackage(index)}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => {
                        setIsAddStopDialogOpen(false);
                        resetStopForm();
                      }}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Ajouter le stop
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Stops list */}
          <div className="space-y-3">
            {route.stops.map((stop) => {
              const StatusIcon = statusConfig[stop.status]?.icon || Clock;
              return (
                <div key={stop.id} className="rounded-xl border bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    {/* Stop number */}
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      {stop.stopNumber}
                    </div>

                    {/* Stop info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {stop.recipientName && (
                            <p className="font-medium flex items-center gap-2">
                              <User className="h-4 w-4 text-slate-400" />
                              {stop.recipientName}
                            </p>
                          )}
                          <p className="text-slate-600 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            {stop.address}, {stop.postalCode} {stop.city}
                          </p>
                          {stop.phone && (
                            <p className="text-sm text-slate-500 flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-400" />
                              {stop.phone}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={statusConfig[stop.status]?.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig[stop.status]?.label}
                          </Badge>
                          {route.status === "DRAFT" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => setDeleteStopDialog({
                                open: true,
                                id: stop.id,
                                address: stop.address,
                              })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Packages */}
                      {stop.packages.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {stop.packages.map((pkg) => (
                            <div
                              key={pkg.id}
                              className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded"
                            >
                              <Package className="h-3 w-3" />
                              <span>{pkg.externalBarcode || pkg.barcode.slice(0, 8)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Additional info */}
                      {(stop.accessCode || stop.instructions) && (
                        <div className="mt-2 text-sm text-slate-500">
                          {stop.accessCode && <span>Code: {stop.accessCode}</span>}
                          {stop.accessCode && stop.instructions && <span className="mx-2">|</span>}
                          {stop.instructions && <span>{stop.instructions}</span>}
                        </div>
                      )}

                      {/* Delivery proof */}
                      {stop.status === "COMPLETED" && (
                        <div className="mt-2 flex items-center gap-4 text-sm text-green-600">
                          {stop.signedBy && <span>Signe par: {stop.signedBy}</span>}
                          {stop.actualArrival && <span>a {new Date(stop.actualArrival).toLocaleTimeString()}</span>}
                        </div>
                      )}

                      {/* Failure reason */}
                      {stop.status === "FAILED" && stop.failureReason && (
                        <div className="mt-2 text-sm text-red-600">
                          Raison: {stop.failureReason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {route.stops.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <MapPin className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p>Aucun stop dans cette route</p>
                {route.status === "DRAFT" && (
                  <p className="text-sm">Ajoutez des stops manuellement ou importez un CSV</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Stop Dialog */}
      <AlertDialog open={deleteStopDialog.open} onOpenChange={(open) => setDeleteStopDialog({ ...deleteStopDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer le stop <strong>{deleteStopDialog.address}</strong> ?
              Les colis associes seront aussi supprimes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStop} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

```

## src/app/(dashboard)/routes/page.tsx
```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Upload,
  Calendar,
  MapPin,
  Package,
  User,
  Truck,
  FileSpreadsheet,
  Play,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface Route {
  id: string;
  routeNumber: string;
  name: string | null;
  status: "DRAFT" | "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  scheduledDate: string;
  startTime: string | null;
  endTime: string | null;
  totalStops: number;
  completedStops: number;
  totalPackages: number;
  deliveredPackages: number;
  totalDistance: number | null;
  contract: { name: string; code: string } | null;
  driver: { user: { name: string } } | null;
  vehicle: { plateNumber: string; type: string } | null;
  _count: { stops: number };
}

interface Contract {
  id: string;
  name: string;
  code: string;
}

interface Driver {
  id: string;
  user: { name: string };
}

interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20" },
  PLANNED: { label: "Planifiee", color: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20" },
  IN_PROGRESS: { label: "En cours", color: "bg-amber-500/15 text-amber-400 border border-amber-500/20" },
  COMPLETED: { label: "Terminee", color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
  CANCELLED: { label: "Annulee", color: "bg-red-500/15 text-red-400 border border-red-500/20" },
};

export default function RoutesPage() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; routeNumber: string }>({
    open: false,
    id: "",
    routeNumber: "",
  });

  // Form state for new route
  const [formData, setFormData] = useState({
    name: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    contractId: "",
    driverId: "",
    vehicleId: "",
    notes: "",
  });

  // Import state
  const [importData, setImportData] = useState({
    contractId: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    driverId: "",
    vehicleId: "",
    routeName: "",
    csvData: [] as any[],
    fileName: "",
  });

  useEffect(() => {
    fetchRoutes();
    fetchContracts();
    fetchDrivers();
    fetchVehicles();
  }, [searchTerm, statusFilter, dateFilter]);

  async function fetchRoutes() {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (dateFilter) params.set("date", dateFilter);

      const res = await fetch(`/api/routes?${params}`);
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

  function resetForm() {
    setFormData({
      name: "",
      scheduledDate: new Date().toISOString().split("T")[0],
      contractId: "",
      driverId: "",
      vehicleId: "",
      notes: "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          createdById: (session?.user as any)?.id,
        }),
      });

      if (res.ok) {
        toast.success("Route creee avec succes");
        setIsCreateDialogOpen(false);
        resetForm();
        fetchRoutes();
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = parseCSV(text);
        setImportData({ ...importData, csvData: rows, fileName: file.name });
        toast.success(`${rows.length} lignes detectees`);
      } catch (error) {
        toast.error("Erreur lors de la lecture du fichier CSV");
      }
    };
    reader.readAsText(file);
  }

  function parseCSV(text: string): any[] {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: any = {};

      headers.forEach((header, index) => {
        // Map common header names
        if (header.includes("address") || header.includes("adresse")) {
          row.address = values[index];
        } else if (header.includes("city") || header.includes("ville")) {
          row.city = values[index];
        } else if (header.includes("postal") || header.includes("code")) {
          row.postalCode = values[index];
        } else if (header.includes("recipient") || header.includes("destinataire") || header.includes("nom")) {
          row.recipientName = values[index];
        } else if (header.includes("phone") || header.includes("tel")) {
          row.phone = values[index];
        } else if (header.includes("barcode") || header.includes("code-barre") || header.includes("tracking")) {
          row.externalBarcode = values[index];
        } else if (header.includes("weight") || header.includes("poids")) {
          row.weight = values[index];
        } else if (header.includes("instruction") || header.includes("note")) {
          row.instructions = values[index];
        } else if (header.includes("access") || header.includes("acces")) {
          row.accessCode = values[index];
        }
      });

      if (row.address && row.city && row.postalCode) {
        rows.push(row);
      }
    }

    return rows;
  }

  async function handleImport() {
    if (importData.csvData.length === 0) {
      toast.error("Aucune donnee a importer");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/routes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...importData,
          createdById: (session?.user as any)?.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Route importee: ${data.imported.stops} stops, ${data.imported.packages} colis`);
        setIsImportDialogOpen(false);
        setImportData({
          contractId: "",
          scheduledDate: new Date().toISOString().split("T")[0],
          driverId: "",
          vehicleId: "",
          routeName: "",
          csvData: [],
          fileName: "",
        });
        fetchRoutes();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de l'import");
      }
    } catch (error) {
      toast.error("Erreur lors de l'import de la route");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/routes/${deleteDialog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Route supprimee");
        fetchRoutes();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteDialog({ open: false, id: "", routeNumber: "" });
    }
  }

  async function handleStartRoute(routeId: string) {
    try {
      const res = await fetch(`/api/routes/${routeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "IN_PROGRESS",
          startTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        toast.success("Route demarree");
        fetchRoutes();
      }
    } catch (error) {
      toast.error("Erreur lors du demarrage");
    }
  }

  const stats = {
    total: routes.length,
    draft: routes.filter((r) => r.status === "DRAFT").length,
    inProgress: routes.filter((r) => r.status === "IN_PROGRESS").length,
    completed: routes.filter((r) => r.status === "COMPLETED").length,
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Routes" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Total routes</p>
            <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Brouillons</p>
            <p className="text-2xl font-bold text-zinc-400">{stats.draft}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">En cours</p>
            <p className="text-2xl font-bold text-amber-400">{stats.inProgress}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <p className="text-sm text-zinc-500">Terminees</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Rechercher..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="DRAFT">Brouillon</SelectItem>
                <SelectItem value="PLANNED">Planifiee</SelectItem>
                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                <SelectItem value="COMPLETED">Terminee</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="w-40"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {/* Import Dialog */}
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Importer CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Importer une route depuis CSV</DialogTitle>
                  <DialogDescription>
                    Importez un fichier CSV avec les colonnes: address, city, postalCode, recipientName, phone, barcode
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contrat</Label>
                      <Select
                        value={importData.contractId}
                        onValueChange={(v) => setImportData({ ...importData, contractId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {contracts.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name} ({c.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={importData.scheduledDate}
                        onChange={(e) => setImportData({ ...importData, scheduledDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Chauffeur</Label>
                      <Select
                        value={importData.driverId}
                        onValueChange={(v) => setImportData({ ...importData, driverId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner" />
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
                        value={importData.vehicleId}
                        onValueChange={(v) => setImportData({ ...importData, vehicleId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner" />
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
                      placeholder="Ex: Route Montreal Nord - 15 Dec"
                      value={importData.routeName}
                      onChange={(e) => setImportData({ ...importData, routeName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fichier CSV</Label>
                    <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center bg-zinc-900/50">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {importData.fileName ? (
                        <div className="space-y-2">
                          <FileSpreadsheet className="mx-auto h-10 w-10 text-emerald-400" />
                          <p className="font-medium text-zinc-200">{importData.fileName}</p>
                          <p className="text-sm text-zinc-500">{importData.csvData.length} lignes</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Changer de fichier
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="mx-auto h-10 w-10 text-zinc-500" />
                          <p className="text-zinc-500">Glissez un fichier ou</p>
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Parcourir
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={isSubmitting || importData.csvData.length === 0}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Importer {importData.csvData.length} stops
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle route
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Creer une nouvelle route</DialogTitle>
                  <DialogDescription>
                    Creez une route vide et ajoutez les stops manuellement
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom de la route</Label>
                    <Input
                      placeholder="Ex: Route Montreal Nord"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contrat</Label>
                      <Select
                        value={formData.contractId}
                        onValueChange={(v) => setFormData({ ...formData, contractId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {contracts.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
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
                        value={formData.driverId}
                        onValueChange={(v) => setFormData({ ...formData, driverId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner" />
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
                        value={formData.vehicleId}
                        onValueChange={(v) => setFormData({ ...formData, vehicleId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.plateNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="Notes sur la route..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Creer la route
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Routes table */}
        <div className="rounded-xl border border-zinc-800/50 bg-[#12121a]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Route</TableHead>
                  <TableHead className="text-zinc-400">Contrat</TableHead>
                  <TableHead className="text-zinc-400">Chauffeur</TableHead>
                  <TableHead className="text-zinc-400">Stops</TableHead>
                  <TableHead className="text-zinc-400">Colis</TableHead>
                  <TableHead className="text-zinc-400">Statut</TableHead>
                  <TableHead className="text-zinc-400">Date</TableHead>
                  <TableHead className="text-right text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-zinc-200">{route.routeNumber}</p>
                        {route.name && (
                          <p className="text-sm text-zinc-500">{route.name}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {route.contract ? (
                        <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700">{route.contract.code}</Badge>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {route.driver ? (
                        <div className="flex items-center gap-2 text-zinc-300">
                          <User className="h-4 w-4 text-zinc-500" />
                          <span>{route.driver.user.name}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-500">Non assigne</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-zinc-300">
                        <MapPin className="h-4 w-4 text-zinc-500" />
                        <span>
                          {route.completedStops}/{route.totalStops}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-zinc-300">
                        <Package className="h-4 w-4 text-zinc-500" />
                        <span>
                          {route.deliveredPackages}/{route.totalPackages}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[route.status]?.color}>
                        {statusConfig[route.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Calendar className="h-4 w-4" />
                        {formatDate(route.scheduledDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {route.status === "DRAFT" && route.totalStops > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                            onClick={() => handleStartRoute(route.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Link href={`/routes/${route.id}`}>
                          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {route.status === "DRAFT" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => setDeleteDialog({
                              open: true,
                              id: route.id,
                              routeNumber: route.routeNumber,
                            })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {routes.length === 0 && (
                  <TableRow className="border-zinc-800/50">
                    <TableCell colSpan={8} className="text-center py-8 text-zinc-500">
                      Aucune route trouvee
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer la route <strong>{deleteDialog.routeNumber}</strong> ?
              Cette action supprimera aussi tous les stops et colis associes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

```

## src/app/(dashboard)/settings/page.tsx
```tsx
"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Building, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulation de sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Parametres sauvegardes avec succes");
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Parametres" />

      <div className="flex-1 p-6">
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="company" className="gap-2 data-[state=active]:bg-zinc-800">
              <Building className="h-4 w-4" />
              Entreprise
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-zinc-800">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-zinc-800">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-zinc-800">
              <Shield className="h-4 w-4" />
              Securite
            </TabsTrigger>
          </TabsList>

          {/* Company Settings */}
          <TabsContent value="company" className="space-y-6">
            <Card className="bg-[#12121a] border-zinc-800/50">
              <CardHeader>
                <CardTitle className="text-zinc-100">Informations de l entreprise</CardTitle>
                <CardDescription className="text-zinc-500">
                  Ces informations apparaitront sur vos factures et documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom de l entreprise</Label>
                    <Input defaultValue="LogiFlow" />
                  </div>
                  <div className="space-y-2">
                    <Label>Numero SIRET</Label>
                    <Input placeholder="123 456 789 00012" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Textarea
                    placeholder="Adresse complete de l'entreprise"
                    defaultValue="123 Avenue de la Logistique, 75001 Paris"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Telephone</Label>
                    <Input defaultValue="01 23 45 67 89" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue="contact@logiflow.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Site web</Label>
                    <Input defaultValue="www.logiflow.com" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#12121a] border-zinc-800/50">
              <CardHeader>
                <CardTitle className="text-zinc-100">Parametres de facturation</CardTitle>
                <CardDescription className="text-zinc-500">
                  Configurez les parametres par defaut pour vos factures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Devise</Label>
                    <Select defaultValue="EUR">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="USD">Dollar (USD)</SelectItem>
                        <SelectItem value="GBP">Livre (GBP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Taux TVA par defaut (%)</Label>
                    <Input type="number" defaultValue="20" />
                  </div>
                  <div className="space-y-2">
                    <Label>Delai de paiement (jours)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Conditions de paiement</Label>
                  <Textarea
                    placeholder="Mentionnez vos conditions de paiement"
                    defaultValue="Paiement a 30 jours. Penalites de retard: 3 fois le taux d'interet legal."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-[#12121a] border-zinc-800/50">
              <CardHeader>
                <CardTitle className="text-zinc-100">Informations personnelles</CardTitle>
                <CardDescription className="text-zinc-500">
                  Mettez a jour vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-2xl font-bold">
                    A
                  </div>
                  <Button variant="outline">Changer la photo</Button>
                </div>
                <Separator className="bg-zinc-800" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom complet</Label>
                    <Input defaultValue="Admin LogiFlow" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue="admin@logiflow.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Telephone</Label>
                    <Input defaultValue="06 12 34 56 78" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input defaultValue="Administrateur" disabled className="bg-zinc-900" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-[#12121a] border-zinc-800/50">
              <CardHeader>
                <CardTitle className="text-zinc-100">Preferences de notifications</CardTitle>
                <CardDescription className="text-zinc-500">
                  Choisissez quand et comment recevoir des notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { label: "Nouvelle commande", description: "Quand une nouvelle commande est creee" },
                    { label: "Livraison effectuee", description: "Quand une livraison est terminee" },
                    { label: "Retard de livraison", description: "Quand une livraison est en retard" },
                    { label: "Maintenance vehicule", description: "Rappels de maintenance" },
                    { label: "Facture payee", description: "Quand un paiement est recu" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                      <div>
                        <p className="font-medium text-zinc-200">{item.label}</p>
                        <p className="text-sm text-zinc-500">{item.description}</p>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-zinc-400">
                          <input type="checkbox" defaultChecked className="rounded bg-zinc-800 border-zinc-600" />
                          <span className="text-sm">Email</span>
                        </label>
                        <label className="flex items-center gap-2 text-zinc-400">
                          <input type="checkbox" defaultChecked className="rounded bg-zinc-800 border-zinc-600" />
                          <span className="text-sm">Push</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-[#12121a] border-zinc-800/50">
              <CardHeader>
                <CardTitle className="text-zinc-100">Changer le mot de passe</CardTitle>
                <CardDescription className="text-zinc-500">
                  Assurez-vous d utiliser un mot de passe fort
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Mot de passe actuel</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirmer le nouveau mot de passe</Label>
                  <Input type="password" />
                </div>
                <Button>Mettre a jour le mot de passe</Button>
              </CardContent>
            </Card>

            <Card className="bg-[#12121a] border-zinc-800/50">
              <CardHeader>
                <CardTitle className="text-zinc-100">Sessions actives</CardTitle>
                <CardDescription className="text-zinc-500">
                  Gerez vos sessions connectees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
                    <div>
                      <p className="font-medium text-zinc-200">MacBook Pro - Chrome</p>
                      <p className="text-sm text-zinc-500">Paris, France - Session actuelle</p>
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Actif</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
                    <div>
                      <p className="font-medium text-zinc-200">iPhone 14 - Safari</p>
                      <p className="text-sm text-zinc-500">Paris, France - Il y a 2 heures</p>
                    </div>
                    <Button variant="outline" size="sm">Deconnecter</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save button */}
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Sauvegarde..." : "Sauvegarder les modifications"}
          </Button>
        </div>
      </div>
    </div>
  );
}

```

## src/app/(dashboard)/warehouses/page.tsx
```tsx
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Warehouse, MapPin, Package, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WarehouseData {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  capacity: number | null;
  currentStock: number | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  ordersCount: number;
  itemsInStock: number;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: "",
    name: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    capacity: "",
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  async function fetchWarehouses() {
    try {
      const res = await fetch("/api/warehouses");
      if (res.ok) {
        const data = await res.json();
        setWarehouses(data);
      }
    } catch (error) {
      console.error("Failed to fetch warehouses:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/warehouses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Entrepot cree avec succes");
        setIsDialogOpen(false);
        setFormData({
          name: "",
          address: "",
          city: "",
          postalCode: "",
          phone: "",
          email: "",
          capacity: "",
        });
        fetchWarehouses();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la creation");
      }
    } catch (error) {
      toast.error("Erreur lors de la creation de l'entrepot");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/warehouses/${deleteDialog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.softDeleted) {
          toast.success("Entrepot desactive (donnees existantes)");
        } else {
          toast.success("Entrepot supprime");
        }
        fetchWarehouses();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteDialog({ open: false, id: "", name: "" });
    }
  }

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOccupancyColor = (current: number | null, capacity: number | null) => {
    if (!current || !capacity) return "bg-zinc-600";
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    return "bg-emerald-500";
  };

  const getOccupancyPercentage = (current: number | null, capacity: number | null) => {
    if (!current || !capacity) return 0;
    return Math.round((current / capacity) * 100);
  };

  const stats = {
    total: warehouses.length,
    active: warehouses.filter((w) => w.isActive).length,
    totalItems: warehouses.reduce((acc, w) => acc + (w.itemsInStock || 0), 0),
    totalCapacity: warehouses.reduce((acc, w) => acc + (w.capacity || 0), 0),
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Entrepots" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cyan-500/20 p-2">
                <Warehouse className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total entrepots</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/20 p-2">
                <Warehouse className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Actifs</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-violet-500/20 p-2">
                <Package className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Articles en stock</p>
                <p className="text-2xl font-bold text-violet-400">
                  {stats.totalItems.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-500/20 p-2">
                <Package className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Capacite totale</p>
                <p className="text-2xl font-bold text-orange-400">
                  {stats.totalCapacity.toLocaleString()} m3
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Rechercher un entrepot..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un entrepot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un entrepot</DialogTitle>
                <DialogDescription>
                  Enregistrez un nouvel entrepot
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom de l entrepot</Label>
                  <Input
                    placeholder="Entrepot Paris Est"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input
                    placeholder="Zone Industrielle"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input
                      placeholder="Paris"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Code postal</Label>
                    <Input
                      placeholder="75000"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Telephone</Label>
                    <Input
                      placeholder="01 23 45 67 89"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacite (m3)</Label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="entrepot@logiflow.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !formData.name || !formData.address || !formData.city || !formData.postalCode}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Ajouter
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Warehouses grid */}
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWarehouses.map((warehouse) => (
              <Card key={warehouse.id} className="relative bg-[#12121a] border-zinc-800/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-zinc-100">{warehouse.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-zinc-500 mt-1">
                        <MapPin className="h-4 w-4" />
                        {warehouse.city}, {warehouse.postalCode}
                      </div>
                    </div>
                    <Badge
                      className={
                        warehouse.isActive
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20"
                      }
                    >
                      {warehouse.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Occupancy bar */}
                  {warehouse.capacity && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-500">Occupation</span>
                        <span className="font-medium text-zinc-300">
                          {getOccupancyPercentage(warehouse.currentStock, warehouse.capacity)}%
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getOccupancyColor(warehouse.currentStock, warehouse.capacity)}`}
                          style={{
                            width: `${getOccupancyPercentage(warehouse.currentStock, warehouse.capacity)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500 mt-1">
                        <span>{(warehouse.currentStock || 0).toLocaleString()} m3</span>
                        <span>{warehouse.capacity.toLocaleString()} m3</span>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
                    <div>
                      <p className="text-xs text-zinc-500">Commandes</p>
                      <p className="text-lg font-semibold text-zinc-200">{warehouse.ordersCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Articles en stock</p>
                      <p className="text-lg font-semibold text-zinc-200">{warehouse.itemsInStock}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 border-zinc-700 hover:bg-zinc-800">
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 hover:text-red-300 border-zinc-700 hover:bg-red-500/10"
                      onClick={() => setDeleteDialog({
                        open: true,
                        id: warehouse.id,
                        name: warehouse.name,
                      })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredWarehouses.length === 0 && (
              <div className="col-span-full text-center py-8 text-zinc-500">
                Aucun entrepot trouve
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer l entrepot <strong>{deleteDialog.name}</strong> ?
              Si l entrepot contient des donnees, il sera desactive au lieu d etre supprime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

```

## src/app/(driver)/driver/page.tsx
```tsx
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

```

## src/app/(driver)/driver/route/[id]/page.tsx
```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  MapPin,
  Package,
  Phone,
  ArrowLeft,
  Camera,
  PenLine,
  CheckCircle,
  XCircle,
  Navigation,
  ScanBarcode,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface StopPackage {
  id: string;
  barcode: string;
  externalBarcode: string | null;
  status: string;
}

interface RouteStop {
  id: string;
  stopNumber: number;
  status: string;
  recipientName: string | null;
  address: string;
  city: string;
  postalCode: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  accessCode: string | null;
  instructions: string | null;
  packages: StopPackage[];
}

interface RouteDetails {
  id: string;
  routeNumber: string;
  name: string | null;
  status: string;
  totalStops: number;
  completedStops: number;
  totalPackages: number;
  deliveredPackages: number;
  contract: { name: string; code: string } | null;
  stops: RouteStop[];
}

const stopStatusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "bg-gray-100 text-gray-800" },
  IN_PROGRESS: { label: "En route", color: "bg-blue-100 text-blue-800" },
  ARRIVED: { label: "Arrive", color: "bg-yellow-100 text-yellow-800" },
  COMPLETED: { label: "Livre", color: "bg-green-100 text-green-800" },
  FAILED: { label: "Echec", color: "bg-red-100 text-red-800" },
  SKIPPED: { label: "Saute", color: "bg-orange-100 text-orange-800" },
};

export default function DriverRoutePage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string;
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStop, setCurrentStop] = useState<RouteStop | null>(null);
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set());

  // Delivery dialog state
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
  const [activeStop, setActiveStop] = useState<RouteStop | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<"success" | "failed">("success");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [signedBy, setSignedBy] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [failureReason, setFailureReason] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState<Set<string>>(new Set());
  const [manualBarcode, setManualBarcode] = useState("");

  // GPS state
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchRoute();
    requestLocation();
  }, [routeId]);

  async function fetchRoute() {
    try {
      const res = await fetch(`/api/routes/${routeId}`);
      if (res.ok) {
        const data = await res.json();
        setRoute(data);
        // Find current stop (first non-completed)
        const current = data.stops.find(
          (s: RouteStop) => s.status === "PENDING" || s.status === "IN_PROGRESS" || s.status === "ARRIVED"
        );
        setCurrentStop(current || null);
      } else {
        router.push("/driver");
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  function requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }

  function toggleStopExpand(stopId: string) {
    const newExpanded = new Set(expandedStops);
    if (newExpanded.has(stopId)) {
      newExpanded.delete(stopId);
    } else {
      newExpanded.add(stopId);
    }
    setExpandedStops(newExpanded);
  }

  function openDeliveryDialog(stop: RouteStop, mode: "success" | "failed") {
    setActiveStop(stop);
    setDeliveryMode(mode);
    setSignatureData(null);
    setPhotoData(null);
    setSignedBy("");
    setDeliveryNotes("");
    setFailureReason("");
    setScannedBarcodes(new Set());
    setDeliveryDialogOpen(true);
  }

  function openNavigation(stop: RouteStop) {
    const address = encodeURIComponent(`${stop.address}, ${stop.postalCode} ${stop.city}`);
    // Try Google Maps first, fallback to Apple Maps on iOS
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(googleMapsUrl, "_blank");
  }

  // Signature canvas handling
  function initSignatureCanvas() {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }

  function handleSignatureStart(e: React.TouchEvent | React.MouseEvent) {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handleSignatureMove(e: React.TouchEvent | React.MouseEvent) {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function handleSignatureEnd() {
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  }

  function clearSignature() {
    setSignatureData(null);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  // Camera handling
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      toast.error("Impossible d'acceder a la camera");
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      setPhotoData(canvas.toDataURL("image/jpeg", 0.8));
    }

    // Stop camera
    const stream = video.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    setShowCamera(false);
  }

  function cancelCamera() {
    const video = videoRef.current;
    if (video) {
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  }

  // Manual barcode entry
  function addManualBarcode() {
    if (manualBarcode.trim()) {
      const newScanned = new Set(scannedBarcodes);
      newScanned.add(manualBarcode.trim());
      setScannedBarcodes(newScanned);
      setManualBarcode("");
      toast.success("Code-barre ajoute");
    }
  }

  // Submit delivery
  async function handleSubmitDelivery() {
    if (!activeStop) return;

    if (deliveryMode === "success") {
      if (!signatureData) {
        toast.error("Signature requise");
        return;
      }
      if (!signedBy.trim()) {
        toast.error("Nom du signataire requis");
        return;
      }
    } else {
      if (!failureReason.trim()) {
        toast.error("Raison de l'echec requise");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/routes/${routeId}/stops/${activeStop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: deliveryMode === "success" ? "COMPLETED" : "FAILED",
          actualArrival: new Date().toISOString(),
          signature: signatureData,
          signedBy: signedBy,
          proofPhoto: photoData,
          deliveryNotes: deliveryNotes,
          failureReason: deliveryMode === "failed" ? failureReason : null,
          latitude: currentLocation?.lat,
          longitude: currentLocation?.lng,
        }),
      });

      if (res.ok) {
        toast.success(
          deliveryMode === "success"
            ? "Livraison confirmee!"
            : "Echec enregistre"
        );
        setDeliveryDialogOpen(false);
        fetchRoute();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la mise a jour");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!route) {
    return null;
  }

  const progress = route.totalStops > 0
    ? Math.round((route.completedStops / route.totalStops) * 100)
    : 0;

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/driver">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-bold">{route.routeNumber}</h1>
            {route.contract && (
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                {route.contract.code}
              </Badge>
            )}
          </div>
          <div className="text-right text-sm">
            <p>{route.completedStops}/{route.totalStops} stops</p>
            <p>{progress}%</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current stop highlight */}
      {currentStop && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <p className="text-sm font-medium text-yellow-800 mb-2">Prochain stop</p>
          <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-yellow-400">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-700">
                {currentStop.stopNumber}
              </div>
              <div className="flex-1">
                {currentStop.recipientName && (
                  <p className="font-medium">{currentStop.recipientName}</p>
                )}
                <p className="text-slate-600">{currentStop.address}</p>
                <p className="text-slate-500 text-sm">{currentStop.postalCode} {currentStop.city}</p>
                {currentStop.phone && (
                  <a
                    href={`tel:${currentStop.phone}`}
                    className="inline-flex items-center gap-1 text-blue-600 text-sm mt-1"
                  >
                    <Phone className="h-4 w-4" />
                    {currentStop.phone}
                  </a>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {currentStop.packages.map((pkg) => (
                    <span
                      key={pkg.id}
                      className="text-xs bg-slate-100 px-2 py-0.5 rounded"
                    >
                      {pkg.externalBarcode || pkg.barcode.slice(0, 8)}
                    </span>
                  ))}
                </div>
                {(currentStop.accessCode || currentStop.instructions) && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                    {currentStop.accessCode && (
                      <p><strong>Code:</strong> {currentStop.accessCode}</p>
                    )}
                    {currentStop.instructions && (
                      <p>{currentStop.instructions}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => openNavigation(currentStop)}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Naviguer
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => openDeliveryDialog(currentStop, "success")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Livrer
              </Button>
              <Button
                variant="destructive"
                onClick={() => openDeliveryDialog(currentStop, "failed")}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* All stops list */}
      <div className="p-4">
        <h2 className="font-semibold mb-3">Tous les stops ({route.stops.length})</h2>
        <div className="space-y-2">
          {route.stops.map((stop) => {
            const isExpanded = expandedStops.has(stop.id);
            const isCurrent = currentStop?.id === stop.id;
            const isCompleted = stop.status === "COMPLETED";
            const isFailed = stop.status === "FAILED";

            return (
              <div
                key={stop.id}
                className={`rounded-xl border bg-white shadow-sm overflow-hidden ${
                  isCurrent ? "ring-2 ring-yellow-400" : ""
                } ${isCompleted ? "opacity-60" : ""}`}
              >
                <div
                  className="p-3 flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleStopExpand(stop.id)}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCompleted
                        ? "bg-green-100 text-green-700"
                        : isFailed
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isFailed ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      stop.stopNumber
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{stop.address}</p>
                    <p className="text-sm text-slate-500">
                      {stop.packages.length} colis
                    </p>
                  </div>
                  <Badge className={stopStatusConfig[stop.status]?.color}>
                    {stopStatusConfig[stop.status]?.label}
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 border-t pt-3">
                    <div className="space-y-2 text-sm">
                      {stop.recipientName && (
                        <p className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          {stop.recipientName}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {stop.address}, {stop.postalCode} {stop.city}
                      </p>
                      {stop.phone && (
                        <a
                          href={`tel:${stop.phone}`}
                          className="flex items-center gap-2 text-blue-600"
                        >
                          <Phone className="h-4 w-4" />
                          {stop.phone}
                        </a>
                      )}
                      {stop.accessCode && (
                        <p><strong>Code:</strong> {stop.accessCode}</p>
                      )}
                      {stop.instructions && (
                        <p className="text-slate-600">{stop.instructions}</p>
                      )}
                    </div>

                    {!isCompleted && !isFailed && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            openNavigation(stop);
                          }}
                        >
                          <Navigation className="mr-1 h-4 w-4" />
                          GPS
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeliveryDialog(stop, "success");
                          }}
                        >
                          Livrer
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeliveryDialog(stop, "failed");
                          }}
                        >
                          Echec
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Dialog */}
      <Dialog open={deliveryDialogOpen} onOpenChange={setDeliveryDialogOpen}>
        <DialogContent className="max-w-lg max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {deliveryMode === "success" ? "Confirmer la livraison" : "Echec de livraison"}
            </DialogTitle>
          </DialogHeader>

          {activeStop && (
            <div className="space-y-4">
              {/* Stop info */}
              <div className="p-3 bg-slate-50 rounded-lg text-sm">
                <p className="font-medium">{activeStop.address}</p>
                <p className="text-slate-500">{activeStop.postalCode} {activeStop.city}</p>
              </div>

              {deliveryMode === "success" ? (
                <>
                  {/* Packages to scan */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Colis ({activeStop.packages.length})
                    </label>
                    <div className="space-y-2">
                      {activeStop.packages.map((pkg) => {
                        const isScanned = scannedBarcodes.has(pkg.externalBarcode || pkg.barcode);
                        return (
                          <div
                            key={pkg.id}
                            className={`flex items-center gap-2 p-2 rounded border ${
                              isScanned ? "bg-green-50 border-green-200" : "bg-slate-50"
                            }`}
                          >
                            <Package className="h-4 w-4 text-slate-400" />
                            <span className="flex-1 font-mono text-sm">
                              {pkg.externalBarcode || pkg.barcode}
                            </span>
                            {isScanned && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Entrer code-barre manuellement"
                        value={manualBarcode}
                        onChange={(e) => setManualBarcode(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={addManualBarcode}>
                        <ScanBarcode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Photo */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Photo de preuve
                    </label>
                    {showCamera ? (
                      <div className="space-y-2">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full rounded-lg"
                        />
                        <div className="flex gap-2">
                          <Button onClick={capturePhoto} className="flex-1">
                            Capturer
                          </Button>
                          <Button variant="outline" onClick={cancelCamera}>
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : photoData ? (
                      <div className="space-y-2">
                        <img
                          src={photoData}
                          alt="Preuve"
                          className="w-full rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPhotoData(null)}
                        >
                          Reprendre
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-24"
                        onClick={startCamera}
                      >
                        <Camera className="mr-2 h-6 w-6" />
                        Prendre une photo
                      </Button>
                    )}
                  </div>

                  {/* Signature */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Signature *
                    </label>
                    {showSignature || signatureData ? (
                      <div className="space-y-2">
                        <canvas
                          ref={signatureCanvasRef}
                          width={300}
                          height={150}
                          className="w-full border rounded-lg bg-white touch-none"
                          onTouchStart={handleSignatureStart}
                          onTouchMove={handleSignatureMove}
                          onTouchEnd={handleSignatureEnd}
                          onMouseDown={handleSignatureStart}
                          onMouseMove={handleSignatureMove}
                          onMouseUp={handleSignatureEnd}
                          onMouseLeave={handleSignatureEnd}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSignature}
                        >
                          Effacer
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-24"
                        onClick={() => {
                          setShowSignature(true);
                          setTimeout(initSignatureCanvas, 100);
                        }}
                      >
                        <PenLine className="mr-2 h-6 w-6" />
                        Signer ici
                      </Button>
                    )}
                  </div>

                  {/* Signed by */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Nom du signataire *
                    </label>
                    <Input
                      placeholder="Nom de la personne qui signe"
                      value={signedBy}
                      onChange={(e) => setSignedBy(e.target.value)}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Notes (optionnel)
                    </label>
                    <Textarea
                      placeholder="Notes de livraison..."
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      rows={2}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Failure reason */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Raison de l echec *
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={failureReason}
                      onChange={(e) => setFailureReason(e.target.value)}
                    >
                      <option value="">Selectionner une raison</option>
                      <option value="Absent">Client absent</option>
                      <option value="Adresse incorrecte">Adresse incorrecte</option>
                      <option value="Acces impossible">Acces impossible</option>
                      <option value="Refuse par le client">Refuse par le client</option>
                      <option value="Colis endommage">Colis endommage</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  {/* Photo (optional for failure) */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Photo (optionnel)
                    </label>
                    {showCamera ? (
                      <div className="space-y-2">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full rounded-lg"
                        />
                        <div className="flex gap-2">
                          <Button onClick={capturePhoto} className="flex-1">
                            Capturer
                          </Button>
                          <Button variant="outline" onClick={cancelCamera}>
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : photoData ? (
                      <div className="space-y-2">
                        <img
                          src={photoData}
                          alt="Photo"
                          className="w-full rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPhotoData(null)}
                        >
                          Reprendre
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={startCamera}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Prendre une photo
                      </Button>
                    )}
                  </div>

                  {/* Additional notes */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Details supplementaires
                    </label>
                    <Textarea
                      placeholder="Plus de details sur l'echec..."
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      rows={2}
                    />
                  </div>
                </>
              )}

              {/* Submit buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeliveryDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  className={`flex-1 ${
                    deliveryMode === "success"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  onClick={handleSubmitDelivery}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {deliveryMode === "success" ? "Confirmer" : "Enregistrer echec"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

## src/app/(driver)/layout.tsx
```tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-slate-50">
        {children}
        <Toaster position="top-center" richColors />
      </div>
    </SessionProvider>
  );
}

```

## src/app/api/auth/[...nextauth]/route.ts
```tsx
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

```

## src/app/api/auth/register/route.ts
```tsx
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Le mot de passe doit contenir au moins 8 caracteres" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est deja utilise" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "DISPATCHER",
      },
    });

    return NextResponse.json(
      { message: "Compte cree avec succes", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}

```

## src/app/api/contracts/[id]/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        routes: {
          orderBy: { scheduledDate: "desc" },
          take: 10,
        },
        _count: {
          select: {
            routes: true,
            packages: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contrat non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error("Contract GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du contrat" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      type,
      code,
      contactName,
      contactEmail,
      contactPhone,
      address,
      city,
      postalCode,
      notes,
      ratePerStop,
      ratePerPackage,
      ratePerKm,
      isActive,
    } = body;

    // Check if new code conflicts with existing
    if (code) {
      const existing = await prisma.contract.findFirst({
        where: {
          code: code.toUpperCase(),
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Ce code de contrat existe déjà" },
          { status: 400 }
        );
      }
    }

    const contract = await prisma.contract.update({
      where: { id },
      data: {
        name,
        type,
        code: code ? code.toUpperCase() : undefined,
        contactName,
        contactEmail,
        contactPhone,
        address,
        city,
        postalCode,
        notes,
        ratePerStop: ratePerStop !== undefined ? parseFloat(ratePerStop) || null : undefined,
        ratePerPackage: ratePerPackage !== undefined ? parseFloat(ratePerPackage) || null : undefined,
        ratePerKm: ratePerKm !== undefined ? parseFloat(ratePerKm) || null : undefined,
        isActive,
      },
    });

    return NextResponse.json(contract);
  } catch (error) {
    console.error("Contract PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du contrat" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            routes: true,
            packages: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contrat non trouvé" },
        { status: 404 }
      );
    }

    // Soft delete if has related data
    if (contract._count.routes > 0 || contract._count.packages > 0) {
      await prisma.contract.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, softDeleted: true });
    }

    await prisma.contract.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contract DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du contrat" },
      { status: 500 }
    );
  }
}

```

## src/app/api/contracts/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const type = searchParams.get("type");

    const contracts = await prisma.contract.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { code: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          type ? { type: type as "SUBCONTRACTOR" | "DIRECT" } : {},
          { isActive: true },
        ],
      },
      include: {
        _count: {
          select: {
            routes: true,
            packages: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("Contracts GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des contrats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      code,
      contactName,
      contactEmail,
      contactPhone,
      address,
      city,
      postalCode,
      notes,
      ratePerStop,
      ratePerPackage,
      ratePerKm,
    } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: "Le nom et le code sont requis" },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existing = await prisma.contract.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ce code de contrat existe déjà" },
        { status: 400 }
      );
    }

    const contract = await prisma.contract.create({
      data: {
        name,
        type: type || "SUBCONTRACTOR",
        code: code.toUpperCase(),
        contactName,
        contactEmail,
        contactPhone,
        address,
        city,
        postalCode,
        notes,
        ratePerStop: ratePerStop ? parseFloat(ratePerStop) : null,
        ratePerPackage: ratePerPackage ? parseFloat(ratePerPackage) : null,
        ratePerKm: ratePerKm ? parseFloat(ratePerKm) : null,
      },
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error("Contracts POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du contrat" },
      { status: 500 }
    );
  }
}

```

## src/app/api/customers/[id]/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { orders: true, invoices: true } },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Client non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Customer GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du client" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, company, address, city, postalCode, notes, isActive } = body;

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        company,
        address,
        city,
        postalCode,
        notes,
        isActive,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Customer PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du client" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if customer has orders
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { _count: { select: { orders: true } } },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Client non trouvé" },
        { status: 404 }
      );
    }

    if (customer._count.orders > 0) {
      // Soft delete - mark as inactive
      await prisma.customer.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, softDeleted: true });
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du client" },
      { status: 500 }
    );
  }
}

```

## src/app/api/customers/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    return NextResponse.json(
      customers.map((c) => ({
        ...c,
        ordersCount: c._count.orders,
      }))
    );
  } catch (error) {
    console.error("Customers GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, address, city, postalCode, notes } = body;

    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Un client avec cet email existe déjà" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        company,
        address,
        city,
        postalCode,
        notes,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Customers POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du client" },
      { status: 500 }
    );
  }
}

```

## src/app/api/dashboard/route.ts
```tsx
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      ordersToday,
      ordersInTransit,
      ordersDeliveredToday,
      ordersPending,
      totalVehicles,
      vehiclesAvailable,
      vehiclesMaintenance,
      totalCustomers,
      totalDrivers,
      recentOrders,
      ordersThisWeek,
    ] = await Promise.all([
      // Commandes du jour
      prisma.order.count({
        where: { createdAt: { gte: today } },
      }),
      // En transit
      prisma.order.count({
        where: { status: { in: ["IN_TRANSIT", "OUT_FOR_DELIVERY"] } },
      }),
      // Livrées aujourd'hui
      prisma.order.count({
        where: {
          status: "DELIVERED",
          actualDelivery: { gte: today },
        },
      }),
      // En attente
      prisma.order.count({
        where: { status: "PENDING" },
      }),
      // Total véhicules
      prisma.vehicle.count({ where: { isActive: true } }),
      // Véhicules disponibles
      prisma.vehicle.count({ where: { status: "AVAILABLE", isActive: true } }),
      // En maintenance
      prisma.vehicle.count({ where: { status: "MAINTENANCE" } }),
      // Total clients
      prisma.customer.count({ where: { isActive: true } }),
      // Total chauffeurs
      prisma.driver.count(),
      // Commandes récentes
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { name: true } },
        },
      }),
      // Commandes de la semaine pour le graphique
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          createdAt: true,
          status: true,
        },
      }),
    ]);

    // Calculer les stats par jour pour le graphique
    const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = ordersThisWeek.filter(
        (o) => o.createdAt >= date && o.createdAt < nextDate
      );
      const dayDelivered = dayOrders.filter((o) => o.status === "DELIVERED");

      chartData.push({
        name: weekDays[date.getDay()],
        commandes: dayOrders.length,
        livraisons: dayDelivered.length,
      });
    }

    return NextResponse.json({
      stats: {
        ordersToday,
        ordersInTransit,
        ordersDeliveredToday,
        ordersPending,
        totalVehicles,
        vehiclesAvailable,
        vehiclesMaintenance,
        totalCustomers,
        totalDrivers,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        trackingNumber: order.trackingNumber,
        customer: order.customer.name,
        destination: `${order.deliveryCity}, ${order.deliveryPostalCode}`,
        status: order.status,
        date: order.createdAt,
      })),
      chartData,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}

```

## src/app/api/drivers/[id]/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        vehicles: true,
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Chauffeur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(driver);
  } catch (error) {
    console.error("Driver GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du chauffeur" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, phone, licenseNumber, licenseExpiry, isAvailable } = body;

    const driver = await prisma.driver.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Chauffeur non trouvé" },
        { status: 404 }
      );
    }

    // Update user name
    if (name) {
      await prisma.user.update({
        where: { id: driver.userId },
        data: { name },
      });
    }

    // Update driver
    const updatedDriver = await prisma.driver.update({
      where: { id },
      data: {
        phone,
        licenseNumber,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : undefined,
        isAvailable,
      },
    });

    return NextResponse.json(updatedDriver);
  } catch (error) {
    console.error("Driver PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du chauffeur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const driver = await prisma.driver.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Chauffeur non trouvé" },
        { status: 404 }
      );
    }

    // Delete driver first, then user
    await prisma.driver.delete({
      where: { id },
    });

    await prisma.user.delete({
      where: { id: driver.userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Driver DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du chauffeur" },
      { status: 500 }
    );
  }
}

```

## src/app/api/drivers/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        vehicles: { select: { plateNumber: true } },
        _count: { select: { orders: true } },
      },
    });

    return NextResponse.json(
      drivers.map((d) => ({
        id: d.id,
        name: d.user.name,
        email: d.user.email,
        phone: d.phone,
        licenseNumber: d.licenseNumber,
        licenseExpiry: d.licenseExpiry,
        isAvailable: d.isAvailable,
        vehicle: d.vehicles[0]?.plateNumber || null,
        deliveriesCount: d._count.orders,
      }))
    );
  } catch (error) {
    console.error("Drivers GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des chauffeurs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, licenseNumber, licenseExpiry } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash("password123", 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "DRIVER",
        phone,
        driver: {
          create: {
            licenseNumber,
            licenseExpiry: new Date(licenseExpiry),
            phone,
          },
        },
      },
      include: { driver: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Drivers POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du chauffeur" },
      { status: 500 }
    );
  }
}

```

## src/app/api/invoices/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true, company: true } },
        items: true,
      },
    });

    return NextResponse.json(
      invoices.map((i) => ({
        id: i.id,
        invoiceNumber: i.invoiceNumber,
        customer: i.customer.name,
        company: i.customer.company,
        issueDate: i.issueDate,
        dueDate: i.dueDate,
        subtotal: i.subtotal,
        taxRate: i.taxRate,
        taxAmount: i.taxAmount,
        total: i.total,
        status: i.status,
        ordersCount: i.items.length,
      }))
    );
  } catch (error) {
    console.error("Invoices GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des factures" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, createdById, dueDate, taxRate, notes, orderIds } = body;

    if (!customerId || !createdById) {
      return NextResponse.json(
        { error: "Customer ID et Creator ID sont requis" },
        { status: 400 }
      );
    }

    // Get customer orders to calculate totals
    const orders = await prisma.order.findMany({
      where: {
        id: { in: orderIds || [] },
        customerId,
      },
    });

    const subtotal = orders.reduce((acc, o) => acc + (o.price || 0), 0);
    const taxAmount = subtotal * ((taxRate || 20) / 100);
    const total = subtotal + taxAmount;

    // Generate invoice number
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const invoiceNumber = `INV-${yearMonth}-${randomSuffix}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customer: { connect: { id: customerId } },
        createdBy: { connect: { id: createdById } },
        issueDate: new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 86400000),
        subtotal,
        taxRate: taxRate || 20,
        taxAmount,
        total,
        notes,
        items: {
          create: orders.map((order) => ({
            description: `Commande ${order.trackingNumber}`,
            quantity: 1,
            unitPrice: order.price || 0,
            total: order.price || 0,
          })),
        },
      },
      include: {
        customer: { select: { name: true } },
        items: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Invoices POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la facture" },
      { status: 500 }
    );
  }
}

```

## src/app/api/orders/[id]/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        driver: {
          include: { user: { select: { name: true } } },
        },
        vehicle: true,
        packages: true,
        trackingEvents: {
          orderBy: { timestamp: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la commande" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      status,
      priority,
      driverId,
      vehicleId,
      deliveryAddress,
      deliveryCity,
      deliveryPostalCode,
      specialInstructions,
      estimatedDelivery,
    } = body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        priority,
        driverId,
        vehicleId,
        deliveryAddress,
        deliveryCity,
        deliveryPostalCode,
        specialInstructions,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      },
    });

    // Add tracking event if status changed
    if (status) {
      await prisma.trackingEvent.create({
        data: {
          orderId: id,
          type: status,
          description: getStatusDescription(status),
          location: order.deliveryCity,
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la commande" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    // Only allow deletion of pending orders
    if (order.status !== "PENDING") {
      // Cancel instead of delete
      await prisma.order.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      await prisma.trackingEvent.create({
        data: {
          orderId: id,
          type: "CANCELLED",
          description: "Commande annulée",
        },
      });

      return NextResponse.json({ success: true, cancelled: true });
    }

    // Delete tracking events first
    await prisma.trackingEvent.deleteMany({
      where: { orderId: id },
    });

    // Delete packages
    await prisma.package.deleteMany({
      where: { orderId: id },
    });

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la commande" },
      { status: 500 }
    );
  }
}

function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    PENDING: "Commande en attente",
    CONFIRMED: "Commande confirmée",
    PICKED_UP: "Colis récupéré",
    IN_TRANSIT: "En transit",
    OUT_FOR_DELIVERY: "En cours de livraison",
    DELIVERED: "Livré",
    CANCELLED: "Commande annulée",
    RETURNED: "Retourné",
  };
  return descriptions[status] || status;
}

```

## src/app/api/orders/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateTrackingNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const customerId = searchParams.get("customerId");

    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (search) {
      where.OR = [
        { trackingNumber: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true } },
        driver: { select: { user: { select: { name: true } } } },
        vehicle: { select: { plateNumber: true } },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const {
      customerId,
      priority,
      pickupAddress,
      pickupCity,
      pickupPostalCode,
      deliveryAddress,
      deliveryCity,
      deliveryPostalCode,
      weight,
      price,
      specialInstructions,
    } = body;

    const order = await prisma.order.create({
      data: {
        trackingNumber: generateTrackingNumber(),
        customerId,
        createdById: session.user.id,
        priority: priority || "NORMAL",
        pickupAddress,
        pickupCity,
        pickupPostalCode,
        deliveryAddress,
        deliveryCity,
        deliveryPostalCode,
        weight: weight ? parseFloat(weight) : null,
        price: price ? parseFloat(price) : 0,
        specialInstructions,
        trackingEvents: {
          create: {
            type: "ORDER_CREATED",
            description: "Commande créée",
            location: pickupCity,
          },
        },
      },
      include: {
        customer: { select: { name: true } },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}

```

## src/app/api/packages/create-route/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface PackageWithAddress {
  id: string;
  barcode: string;
  externalBarcode: string | null;
  recipientName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string | null;
  instructions: string | null;
  accessCode: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packages: packagesData,
      contractId,
      driverId,
      vehicleId,
      scheduledDate,
      routeName,
      createdById,
    } = body;

    if (!packagesData || !Array.isArray(packagesData) || packagesData.length === 0) {
      return NextResponse.json(
        { error: "Aucun colis selectionne" },
        { status: 400 }
      );
    }

    if (!scheduledDate || !createdById) {
      return NextResponse.json(
        { error: "Date et createur requis" },
        { status: 400 }
      );
    }

    // Generate route number
    const today = new Date();
    const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, "");
    const count = await prisma.route.count({
      where: {
        routeNumber: { startsWith: `R${datePrefix}` },
      },
    });
    const routeNumber = `R${datePrefix}-${String(count + 1).padStart(3, "0")}`;

    // Group packages by address to create stops
    const addressMap = new Map<string, PackageWithAddress[]>();

    for (const pkg of packagesData) {
      const addressKey = `${pkg.address.toLowerCase().trim()}|${pkg.postalCode}`;
      if (!addressMap.has(addressKey)) {
        addressMap.set(addressKey, []);
      }
      addressMap.get(addressKey)!.push(pkg);
    }

    // Create the route with stops
    const route = await prisma.route.create({
      data: {
        routeNumber,
        name: routeName || `Route ${routeNumber}`,
        status: "DRAFT",
        scheduledDate: new Date(scheduledDate),
        contractId: contractId || null,
        driverId: driverId || null,
        vehicleId: vehicleId || null,
        createdById,
        totalStops: addressMap.size,
        totalPackages: packagesData.length,
        stops: {
          create: Array.from(addressMap.entries()).map(([_, packages], index) => {
            const firstPkg = packages[0];
            return {
              stopNumber: index + 1,
              recipientName: firstPkg.recipientName || null,
              address: firstPkg.address,
              city: firstPkg.city,
              postalCode: firstPkg.postalCode,
              phone: firstPkg.phone || null,
              instructions: firstPkg.instructions || null,
              accessCode: firstPkg.accessCode || null,
              status: "PENDING",
              packages: {
                create: packages.map((pkg) => ({
                  barcode: pkg.barcode || `PKG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  externalBarcode: pkg.externalBarcode || null,
                  description: pkg.description || `Colis pour ${firstPkg.recipientName || firstPkg.address}`,
                  weight: pkg.weight ? parseFloat(pkg.weight) : null,
                  contractId: contractId || null,
                  status: "PENDING",
                })),
              },
            };
          }),
        },
      },
      include: {
        stops: {
          include: {
            packages: true,
          },
        },
        contract: { select: { name: true, code: true } },
        driver: { include: { user: { select: { name: true } } } },
        vehicle: { select: { plateNumber: true, type: true } },
      },
    });

    return NextResponse.json({
      route,
      summary: {
        routeNumber: route.routeNumber,
        stops: route.stops.length,
        packages: route.stops.reduce((acc, stop) => acc + stop.packages.length, 0),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Create route from packages error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la route" },
      { status: 500 }
    );
  }
}

```

## src/app/api/packages/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const contractId = searchParams.get("contractId");
    const unassigned = searchParams.get("unassigned") === "true";

    const packages = await prisma.package.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { barcode: { contains: search, mode: "insensitive" } },
                  { externalBarcode: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          status ? { status: status as any } : {},
          contractId ? { contractId } : {},
          unassigned ? { routeStopId: null } : {},
        ],
      },
      include: {
        contract: {
          select: { name: true, code: true },
        },
        routeStop: {
          select: {
            id: true,
            address: true,
            city: true,
            postalCode: true,
            recipientName: true,
            route: {
              select: { routeNumber: true, status: true },
            },
          },
        },
        order: {
          select: { trackingNumber: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Packages GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des colis" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packages: packagesData, contractId } = body;

    if (!packagesData || !Array.isArray(packagesData)) {
      return NextResponse.json(
        { error: "Liste de colis requise" },
        { status: 400 }
      );
    }

    const createdPackages = await prisma.$transaction(
      packagesData.map((pkg: any) =>
        prisma.package.create({
          data: {
            externalBarcode: pkg.externalBarcode || null,
            description: pkg.description || `Colis - ${pkg.recipientName || pkg.address}`,
            weight: pkg.weight ? parseFloat(pkg.weight) : null,
            contractId: contractId || null,
          },
        })
      )
    );

    return NextResponse.json(
      { created: createdPackages.length, packages: createdPackages },
      { status: 201 }
    );
  } catch (error) {
    console.error("Packages POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création des colis" },
      { status: 500 }
    );
  }
}

```

## src/app/api/routes/[id]/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        contract: true,
        driver: {
          include: { user: { select: { name: true, phone: true } } },
        },
        vehicle: true,
        createdBy: { select: { name: true } },
        stops: {
          orderBy: { stopNumber: "asc" },
          include: {
            packages: true,
          },
        },
      },
    });

    if (!route) {
      return NextResponse.json(
        { error: "Route non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(route);
  } catch (error) {
    console.error("Route GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la route" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      status,
      scheduledDate,
      startTime,
      endTime,
      driverId,
      vehicleId,
      notes,
      totalDistance,
    } = body;

    const route = await prisma.route.update({
      where: { id },
      data: {
        name,
        status,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        driverId,
        vehicleId,
        notes,
        totalDistance,
      },
      include: {
        contract: { select: { name: true, code: true } },
        driver: {
          include: { user: { select: { name: true } } },
        },
        vehicle: { select: { plateNumber: true } },
      },
    });

    return NextResponse.json(route);
  } catch (error) {
    console.error("Route PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la route" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        stops: {
          include: { packages: true },
        },
      },
    });

    if (!route) {
      return NextResponse.json(
        { error: "Route non trouvée" },
        { status: 404 }
      );
    }

    // Only allow deletion of DRAFT routes
    if (route.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Seules les routes en brouillon peuvent être supprimées" },
        { status: 400 }
      );
    }

    // Delete all packages from stops
    for (const stop of route.stops) {
      await prisma.package.deleteMany({
        where: { routeStopId: stop.id },
      });
    }

    // Delete all stops
    await prisma.routeStop.deleteMany({
      where: { routeId: id },
    });

    // Delete route
    await prisma.route.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Route DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la route" },
      { status: 500 }
    );
  }
}

```

## src/app/api/routes/[id]/stops/[stopId]/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  try {
    const { stopId } = await params;

    const stop = await prisma.routeStop.findUnique({
      where: { id: stopId },
      include: {
        packages: true,
        route: {
          select: { routeNumber: true, status: true },
        },
      },
    });

    if (!stop) {
      return NextResponse.json(
        { error: "Stop non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(stop);
  } catch (error) {
    console.error("Stop GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du stop" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  try {
    const { id: routeId, stopId } = await params;
    const body = await request.json();
    const {
      status,
      recipientName,
      address,
      city,
      postalCode,
      phone,
      latitude,
      longitude,
      accessCode,
      instructions,
      actualArrival,
      departureTime,
      signature,
      signedBy,
      proofPhoto,
      deliveryNotes,
      failureReason,
    } = body;

    const stop = await prisma.routeStop.update({
      where: { id: stopId },
      data: {
        status,
        recipientName,
        address,
        city,
        postalCode,
        phone,
        latitude,
        longitude,
        accessCode,
        instructions,
        actualArrival: actualArrival ? new Date(actualArrival) : undefined,
        departureTime: departureTime ? new Date(departureTime) : undefined,
        signature,
        signedBy,
        proofPhoto,
        deliveryNotes,
        failureReason,
      },
      include: {
        packages: true,
      },
    });

    // If stop is completed, update all packages status
    if (status === "COMPLETED") {
      await prisma.package.updateMany({
        where: { routeStopId: stopId },
        data: {
          status: "DELIVERED",
          deliveredAt: new Date(),
          signature,
          signedBy,
          proofPhoto,
          deliveryNotes,
        },
      });
    } else if (status === "FAILED") {
      await prisma.package.updateMany({
        where: { routeStopId: stopId },
        data: {
          status: "FAILED",
          deliveryNotes: failureReason,
        },
      });
    }

    // Update route stats
    await updateRouteStats(routeId);

    return NextResponse.json(stop);
  } catch (error) {
    console.error("Stop PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du stop" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  try {
    const { id: routeId, stopId } = await params;

    const stop = await prisma.routeStop.findUnique({
      where: { id: stopId },
      include: { route: { select: { status: true } } },
    });

    if (!stop) {
      return NextResponse.json(
        { error: "Stop non trouvé" },
        { status: 404 }
      );
    }

    // Only allow deletion if route is in DRAFT status
    if (stop.route.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Impossible de supprimer un stop d'une route active" },
        { status: 400 }
      );
    }

    // Delete packages first
    await prisma.package.deleteMany({
      where: { routeStopId: stopId },
    });

    // Delete stop
    await prisma.routeStop.delete({
      where: { id: stopId },
    });

    // Renumber remaining stops
    const remainingStops = await prisma.routeStop.findMany({
      where: { routeId },
      orderBy: { stopNumber: "asc" },
    });

    for (let i = 0; i < remainingStops.length; i++) {
      await prisma.routeStop.update({
        where: { id: remainingStops[i].id },
        data: { stopNumber: i + 1 },
      });
    }

    // Update route stats
    await updateRouteStats(routeId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Stop DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du stop" },
      { status: 500 }
    );
  }
}

async function updateRouteStats(routeId: string) {
  const stops = await prisma.routeStop.findMany({
    where: { routeId },
    include: { packages: true },
  });

  const totalStops = stops.length;
  const completedStops = stops.filter((s) => s.status === "COMPLETED").length;
  const totalPackages = stops.reduce((acc, s) => acc + s.packages.length, 0);
  const deliveredPackages = stops.reduce(
    (acc, s) => acc + s.packages.filter((p) => p.status === "DELIVERED").length,
    0
  );

  await prisma.route.update({
    where: { id: routeId },
    data: {
      totalStops,
      completedStops,
      totalPackages,
      deliveredPackages,
    },
  });
}

```

## src/app/api/routes/[id]/stops/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const stops = await prisma.routeStop.findMany({
      where: { routeId: id },
      orderBy: { stopNumber: "asc" },
      include: {
        packages: true,
      },
    });

    return NextResponse.json(stops);
  } catch (error) {
    console.error("Route stops GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des stops" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      recipientName,
      address,
      city,
      postalCode,
      phone,
      latitude,
      longitude,
      accessCode,
      instructions,
      packages,
    } = body;

    if (!address || !city || !postalCode) {
      return NextResponse.json(
        { error: "L'adresse complète est requise" },
        { status: 400 }
      );
    }

    // Get route to verify it exists and get contract info
    const route = await prisma.route.findUnique({
      where: { id },
      select: { contractId: true },
    });

    if (!route) {
      return NextResponse.json(
        { error: "Route non trouvée" },
        { status: 404 }
      );
    }

    // Get next stop number
    const lastStop = await prisma.routeStop.findFirst({
      where: { routeId: id },
      orderBy: { stopNumber: "desc" },
    });
    const stopNumber = (lastStop?.stopNumber ?? 0) + 1;

    // Create stop with packages
    const stop = await prisma.routeStop.create({
      data: {
        routeId: id,
        stopNumber,
        recipientName,
        address,
        city,
        postalCode,
        phone,
        latitude,
        longitude,
        accessCode,
        instructions,
        packages: packages?.length
          ? {
              create: packages.map((pkg: any) => ({
                externalBarcode: pkg.externalBarcode,
                weight: pkg.weight ? parseFloat(pkg.weight) : null,
                description: pkg.description,
                contractId: route.contractId,
              })),
            }
          : undefined,
      },
      include: {
        packages: true,
      },
    });

    // Update route stats
    await updateRouteStats(id);

    return NextResponse.json(stop, { status: 201 });
  } catch (error) {
    console.error("Route stop POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du stop" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: routeId } = await params;
    const body = await request.json();
    const { stops } = body; // Array of stop IDs in new order

    if (!stops || !Array.isArray(stops)) {
      return NextResponse.json(
        { error: "Liste des stops requise" },
        { status: 400 }
      );
    }

    // Update stop numbers based on new order
    for (let i = 0; i < stops.length; i++) {
      await prisma.routeStop.update({
        where: { id: stops[i] },
        data: { stopNumber: i + 1 },
      });
    }

    const updatedStops = await prisma.routeStop.findMany({
      where: { routeId },
      orderBy: { stopNumber: "asc" },
      include: { packages: true },
    });

    return NextResponse.json(updatedStops);
  } catch (error) {
    console.error("Route stops reorder error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la réorganisation des stops" },
      { status: 500 }
    );
  }
}

async function updateRouteStats(routeId: string) {
  const stops = await prisma.routeStop.findMany({
    where: { routeId },
    include: { packages: true },
  });

  const totalStops = stops.length;
  const completedStops = stops.filter((s) => s.status === "COMPLETED").length;
  const totalPackages = stops.reduce((acc, s) => acc + s.packages.length, 0);
  const deliveredPackages = stops.reduce(
    (acc, s) => acc + s.packages.filter((p) => p.status === "DELIVERED").length,
    0
  );

  await prisma.route.update({
    where: { id: routeId },
    data: {
      totalStops,
      completedStops,
      totalPackages,
      deliveredPackages,
    },
  });
}

```

## src/app/api/routes/import/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CSVRow {
  address: string;
  city: string;
  postalCode: string;
  recipientName?: string;
  phone?: string;
  accessCode?: string;
  instructions?: string;
  externalBarcode?: string;
  weight?: string;
  packageDescription?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      routeId,
      contractId,
      scheduledDate,
      driverId,
      vehicleId,
      createdById,
      csvData,
      routeName,
    } = body;

    if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
      return NextResponse.json(
        { error: "Données CSV invalides ou vides" },
        { status: 400 }
      );
    }

    if (!createdById) {
      return NextResponse.json(
        { error: "Créateur requis" },
        { status: 400 }
      );
    }

    let route;

    // Create new route if routeId is not provided
    if (!routeId) {
      if (!scheduledDate) {
        return NextResponse.json(
          { error: "Date de route requise pour créer une nouvelle route" },
          { status: 400 }
        );
      }

      // Generate route number
      const today = new Date();
      const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, "");
      const count = await prisma.route.count({
        where: {
          routeNumber: { startsWith: `R${datePrefix}` },
        },
      });
      const routeNumber = `R${datePrefix}-${String(count + 1).padStart(3, "0")}`;

      route = await prisma.route.create({
        data: {
          routeNumber,
          name: routeName,
          scheduledDate: new Date(scheduledDate),
          contractId,
          driverId,
          vehicleId,
          createdById,
        },
      });
    } else {
      route = await prisma.route.findUnique({
        where: { id: routeId },
      });

      if (!route) {
        return NextResponse.json(
          { error: "Route non trouvée" },
          { status: 404 }
        );
      }

      if (route.status !== "DRAFT") {
        return NextResponse.json(
          { error: "Impossible d'importer dans une route non-brouillon" },
          { status: 400 }
        );
      }
    }

    // Get existing stop count for numbering
    const existingStops = await prisma.routeStop.count({
      where: { routeId: route.id },
    });

    // Group CSV rows by address to create stops with multiple packages
    const stopGroups = groupByAddress(csvData);

    let stopNumber = existingStops;
    const createdStops = [];

    for (const [addressKey, rows] of Object.entries(stopGroups)) {
      stopNumber++;
      const firstRow = rows[0];

      // Create stop
      const stop = await prisma.routeStop.create({
        data: {
          routeId: route.id,
          stopNumber,
          recipientName: firstRow.recipientName,
          address: firstRow.address,
          city: firstRow.city,
          postalCode: firstRow.postalCode,
          phone: firstRow.phone,
          accessCode: firstRow.accessCode,
          instructions: firstRow.instructions,
        },
      });

      // Create packages for this stop
      const packages = [];
      for (const row of rows) {
        if (row.externalBarcode) {
          const pkg = await prisma.package.create({
            data: {
              externalBarcode: row.externalBarcode,
              weight: row.weight ? parseFloat(row.weight) : null,
              description: row.packageDescription,
              routeStopId: stop.id,
              contractId: contractId || route.contractId,
            },
          });
          packages.push(pkg);
        }
      }

      createdStops.push({ ...stop, packages });
    }

    // Update route stats
    const allStops = await prisma.routeStop.findMany({
      where: { routeId: route.id },
      include: { packages: true },
    });

    const totalStops = allStops.length;
    const totalPackages = allStops.reduce((acc, s) => acc + s.packages.length, 0);

    await prisma.route.update({
      where: { id: route.id },
      data: {
        totalStops,
        totalPackages,
      },
    });

    return NextResponse.json({
      success: true,
      route: {
        id: route.id,
        routeNumber: route.routeNumber,
      },
      imported: {
        stops: createdStops.length,
        packages: createdStops.reduce((acc, s) => acc + s.packages.length, 0),
      },
    });
  } catch (error) {
    console.error("Route import error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'import de la route" },
      { status: 500 }
    );
  }
}

function groupByAddress(rows: CSVRow[]): Record<string, CSVRow[]> {
  const groups: Record<string, CSVRow[]> = {};

  for (const row of rows) {
    // Create a unique key for the address
    const key = `${row.address.toLowerCase().trim()}|${row.city.toLowerCase().trim()}|${row.postalCode.trim()}`;

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(row);
  }

  return groups;
}

```

## src/app/api/routes/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const contractId = searchParams.get("contractId");
    const driverId = searchParams.get("driverId");
    const date = searchParams.get("date");

    const routes = await prisma.route.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { routeNumber: { contains: search, mode: "insensitive" } },
                  { name: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          status ? { status: status as any } : {},
          contractId ? { contractId } : {},
          driverId ? { driverId } : {},
          date
            ? {
                scheduledDate: {
                  gte: new Date(date),
                  lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
                },
              }
            : {},
        ],
      },
      include: {
        contract: {
          select: { name: true, code: true },
        },
        driver: {
          include: {
            user: { select: { name: true } },
          },
        },
        vehicle: {
          select: { plateNumber: true, type: true },
        },
        _count: {
          select: { stops: true },
        },
      },
      orderBy: { scheduledDate: "desc" },
    });

    return NextResponse.json(routes);
  } catch (error) {
    console.error("Routes GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des routes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      scheduledDate,
      contractId,
      driverId,
      vehicleId,
      createdById,
      notes,
    } = body;

    if (!scheduledDate || !createdById) {
      return NextResponse.json(
        { error: "La date et le créateur sont requis" },
        { status: 400 }
      );
    }

    // Generate route number
    const today = new Date();
    const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, "");
    const count = await prisma.route.count({
      where: {
        routeNumber: { startsWith: `R${datePrefix}` },
      },
    });
    const routeNumber = `R${datePrefix}-${String(count + 1).padStart(3, "0")}`;

    const route = await prisma.route.create({
      data: {
        routeNumber,
        name,
        scheduledDate: new Date(scheduledDate),
        contractId,
        driverId,
        vehicleId,
        createdById,
        notes,
      },
      include: {
        contract: { select: { name: true, code: true } },
        driver: {
          include: { user: { select: { name: true } } },
        },
        vehicle: { select: { plateNumber: true } },
      },
    });

    return NextResponse.json(route, { status: 201 });
  } catch (error) {
    console.error("Routes POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la route" },
      { status: 500 }
    );
  }
}

```

## src/app/api/tracking/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get("number");

    if (!trackingNumber) {
      return NextResponse.json(
        { error: "Numéro de suivi requis" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { trackingNumber: trackingNumber.toUpperCase() },
      include: {
        customer: { select: { name: true } },
        driver: {
          include: { user: { select: { name: true } } },
        },
        vehicle: { select: { plateNumber: true } },
        trackingEvents: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      trackingNumber: order.trackingNumber,
      status: order.status,
      customer: order.customer.name,
      pickupAddress: `${order.pickupAddress}, ${order.pickupPostalCode} ${order.pickupCity}`,
      deliveryAddress: `${order.deliveryAddress}, ${order.deliveryPostalCode} ${order.deliveryCity}`,
      estimatedDelivery: order.estimatedDelivery,
      driver: order.driver?.user?.name || null,
      vehicle: order.vehicle?.plateNumber || null,
      events: order.trackingEvents.map((e) => ({
        id: e.id,
        type: e.type,
        description: e.description,
        location: e.location,
        timestamp: e.timestamp,
      })),
    });
  } catch (error) {
    console.error("Tracking GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du suivi" },
      { status: 500 }
    );
  }
}

```

## src/app/api/vehicles/[id]/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        driver: {
          include: {
            user: { select: { name: true } },
          },
        },
        maintenances: {
          orderBy: { scheduledDate: "desc" },
          take: 5,
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Véhicule non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Vehicle GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du véhicule" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { plateNumber, type, brand, model, year, capacity, status } = body;

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        plateNumber,
        type,
        brand,
        model,
        year: year ? parseInt(year) : null,
        capacity: capacity ? parseFloat(capacity) : null,
        status,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Vehicle PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du véhicule" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.vehicle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vehicle DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du véhicule" },
      { status: 500 }
    );
  }
}

```

## src/app/api/vehicles/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        driver: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(
      vehicles.map((v) => ({
        ...v,
        driverName: v.driver?.user?.name || null,
      }))
    );
  } catch (error) {
    console.error("Vehicles GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des véhicules" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plateNumber, type, brand, model, year, capacity } = body;

    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plateNumber },
    });

    if (existingVehicle) {
      return NextResponse.json(
        { error: "Un véhicule avec cette immatriculation existe déjà" },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber,
        type,
        brand,
        model,
        year: year ? parseInt(year) : null,
        capacity: capacity ? parseFloat(capacity) : null,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Vehicles POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du véhicule" },
      { status: 500 }
    );
  }
}

```

## src/app/api/warehouses/[id]/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: {
        inventory: true,
        _count: { select: { orders: true, inventory: true } },
      },
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: "Entrepôt non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(warehouse);
  } catch (error) {
    console.error("Warehouse GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'entrepôt" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, address, city, postalCode, phone, email, capacity, isActive } = body;

    const warehouse = await prisma.warehouse.update({
      where: { id },
      data: {
        name,
        address,
        city,
        postalCode,
        phone,
        email,
        capacity: capacity ? parseFloat(capacity) : null,
        isActive,
      },
    });

    return NextResponse.json(warehouse);
  } catch (error) {
    console.error("Warehouse PUT error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'entrepôt" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if warehouse has inventory or orders
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: { _count: { select: { orders: true, inventory: true } } },
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: "Entrepôt non trouvé" },
        { status: 404 }
      );
    }

    if (warehouse._count.orders > 0 || warehouse._count.inventory > 0) {
      // Soft delete - mark as inactive
      await prisma.warehouse.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, softDeleted: true });
    }

    await prisma.warehouse.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Warehouse DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'entrepôt" },
      { status: 500 }
    );
  }
}

```

## src/app/api/warehouses/route.ts
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { orders: true, inventory: true } },
      },
    });

    return NextResponse.json(
      warehouses.map((w) => ({
        ...w,
        ordersCount: w._count.orders,
        itemsInStock: w._count.inventory,
      }))
    );
  } catch (error) {
    console.error("Warehouses GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des entrepôts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, city, postalCode, phone, email, capacity } = body;

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        address,
        city,
        postalCode,
        phone,
        email,
        capacity: capacity ? parseFloat(capacity) : null,
      },
    });

    return NextResponse.json(warehouse, { status: 201 });
  } catch (error) {
    console.error("Warehouses POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'entrepôt" },
      { status: 500 }
    );
  }
}

```

## src/app/layout.tsx
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LogiFlow - Gestion Logistique",
  description: "Plateforme SaaS de gestion logistique - Commandes, Flotte, Tracking, Facturation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

```

## src/app/page.tsx
```tsx
import Link from "next/link";
import { Truck, Package, MapPin, BarChart3, Users, Shield, ArrowRight, Zap, Globe, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-zinc-800/50 backdrop-blur-xl bg-[#0a0a0f]/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">LogiFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Commencer</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-400">Nouvelle version disponible</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
            Gerez votre logistique<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">en toute simplicite</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            LogiFlow est la solution complete pour gerer vos commandes, votre flotte,
            vos entrepots et votre facturation en un seul endroit.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white px-8">
                Essai gratuit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/tracking">
              <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white px-8">
                Suivre un colis
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 mt-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-zinc-500">Entreprises</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">1M+</p>
              <p className="text-sm text-zinc-500">Colis livres</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">99.9%</p>
              <p className="text-sm text-zinc-500">Disponibilite</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Une plateforme complete pour optimiser chaque aspect de votre logistique
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group p-6 rounded-2xl bg-[#12121a] border border-zinc-800/50 hover:border-cyan-500/30 transition-all duration-300">
              <div className="rounded-xl bg-cyan-500/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                <Package className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Gestion des commandes</h3>
              <p className="text-zinc-500">
                Creez, suivez et gerez toutes vos commandes avec des statuts en temps reel.
              </p>
            </div>
            <div className="group p-6 rounded-2xl bg-[#12121a] border border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-300">
              <div className="rounded-xl bg-emerald-500/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <MapPin className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Tracking en temps reel</h3>
              <p className="text-zinc-500">
                Suivez vos livraisons en temps reel et partagez le suivi avec vos clients.
              </p>
            </div>
            <div className="group p-6 rounded-2xl bg-[#12121a] border border-zinc-800/50 hover:border-violet-500/30 transition-all duration-300">
              <div className="rounded-xl bg-violet-500/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                <Truck className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Gestion de flotte</h3>
              <p className="text-zinc-500">
                Gerez vos vehicules, chauffeurs et planifiez les maintenances.
              </p>
            </div>
            <div className="group p-6 rounded-2xl bg-[#12121a] border border-zinc-800/50 hover:border-orange-500/30 transition-all duration-300">
              <div className="rounded-xl bg-orange-500/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                <BarChart3 className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Tableaux de bord</h3>
              <p className="text-zinc-500">
                Visualisez vos KPIs et performances avec des graphiques intuitifs.
              </p>
            </div>
            <div className="group p-6 rounded-2xl bg-[#12121a] border border-zinc-800/50 hover:border-sky-500/30 transition-all duration-300">
              <div className="rounded-xl bg-sky-500/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-sky-500/20 transition-colors">
                <Users className="h-6 w-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Gestion clients</h3>
              <p className="text-zinc-500">
                Centralisez toutes les informations de vos clients et leur historique.
              </p>
            </div>
            <div className="group p-6 rounded-2xl bg-[#12121a] border border-zinc-800/50 hover:border-rose-500/30 transition-all duration-300">
              <div className="rounded-xl bg-rose-500/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-rose-500/20 transition-colors">
                <Shield className="h-6 w-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Facturation</h3>
              <p className="text-zinc-500">
                Generez des factures automatiquement et suivez vos paiements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 border-t border-zinc-800/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20 mb-4">
                <Globe className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Accessible partout</h3>
              <p className="text-zinc-500">
                Accedez a votre tableau de bord depuis n importe quel appareil, a tout moment.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/20 mb-4">
                <Zap className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Ultra rapide</h3>
              <p className="text-zinc-500">
                Interface optimisee pour une experience fluide et des temps de chargement minimaux.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 mb-4">
                <Clock className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Temps reel</h3>
              <p className="text-zinc-500">
                Synchronisation instantanee de toutes vos donnees et mises a jour en direct.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-zinc-800/50 p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Pret a optimiser votre logistique ?
              </h2>
              <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                Rejoignez des centaines d entreprises qui font confiance a LogiFlow
                pour gerer leur logistique au quotidien.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white px-8">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <Truck className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LogiFlow</span>
            </div>
            <p className="text-sm text-zinc-500">
              2024 LogiFlow. Tous droits reserves.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

```

## src/app/tracking/page.tsx
```tsx
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

```

## src/components/dashboard/delivery-chart.tsx
```tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Lun", livraisons: 24, commandes: 30 },
  { name: "Mar", livraisons: 28, commandes: 35 },
  { name: "Mer", livraisons: 32, commandes: 38 },
  { name: "Jeu", livraisons: 26, commandes: 32 },
  { name: "Ven", livraisons: 35, commandes: 42 },
  { name: "Sam", livraisons: 20, commandes: 25 },
  { name: "Dim", livraisons: 12, commandes: 15 },
];

export function DeliveryChart() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Activite de la semaine</h2>
        <p className="text-sm text-slate-500">Commandes et livraisons</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCommandes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLivraisons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="commandes"
              stroke="#3b82f6"
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
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span className="text-sm text-slate-600">Commandes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-sm text-slate-600">Livraisons</span>
        </div>
      </div>
    </div>
  );
}

```

## src/components/dashboard/header.tsx
```tsx
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

```

## src/components/dashboard/recent-orders.tsx
```tsx
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

```

## src/components/dashboard/sidebar.tsx
```tsx
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

```

## src/components/dashboard/stats-card.tsx
```tsx
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "bg-cyan-500/20 text-cyan-400",
}: StatsCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800/50 bg-[#12121a] p-6 transition-all hover:border-zinc-700/50 hover:shadow-lg hover:shadow-cyan-500/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-100">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                changeType === "positive" && "text-emerald-400",
                changeType === "negative" && "text-red-400",
                changeType === "neutral" && "text-zinc-500"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-3", iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

```

## src/components/providers.tsx
```tsx
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

```

## src/components/ui/alert-dialog.tsx
```tsx
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}

```

## src/components/ui/avatar.tsx
```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }

```

## src/components/ui/badge.tsx
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

```

## src/components/ui/button.tsx
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

```

## src/components/ui/card.tsx
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

```

## src/components/ui/checkbox.tsx
```tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-zinc-600 bg-zinc-900/50 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-white data-[state=checked]:border-cyan-500 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/50 size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

```

## src/components/ui/dialog.tsx
```tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-[#12121a] text-zinc-100 border-zinc-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-zinc-900 focus:ring-cyan-500 data-[state=open]:bg-zinc-800 data-[state=open]:text-zinc-400 text-zinc-400 absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold text-zinc-100", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-zinc-400 text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

```

## src/components/ui/dropdown-menu.tsx
```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}

```

## src/components/ui/form.tsx
```tsx
"use client"

import * as React from "react"
import type * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}

```

## src/components/ui/input.tsx
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-zinc-100 placeholder:text-zinc-500 selection:bg-cyan-500 selection:text-white border-zinc-700 h-9 w-full min-w-0 rounded-md border bg-zinc-900/50 px-3 py-1 text-base text-zinc-100 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-cyan-500 focus-visible:ring-cyan-500/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }

```

## src/components/ui/label.tsx
```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none text-zinc-200 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }

```

## src/components/ui/select.tsx
```tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-zinc-700 data-[placeholder]:text-zinc-500 [&_svg:not([class*='text-'])]:text-zinc-400 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/50 aria-invalid:ring-red-500/20 aria-invalid:border-red-500 bg-zinc-900/50 hover:bg-zinc-800/50 text-zinc-100 flex w-fit items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-zinc-900 text-zinc-100 border-zinc-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-zinc-800 focus:text-zinc-100 [&_svg:not([class*='text-'])]:text-zinc-400 relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}

```

## src/components/ui/separator.tsx
```tsx
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }

```

## src/components/ui/sheet.tsx
```tsx
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

```

## src/components/ui/sonner.tsx
```tsx
"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

```

## src/components/ui/table.tsx
```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

```

## src/components/ui/tabs.tsx
```tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

```

## src/components/ui/textarea.tsx
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-zinc-700 placeholder:text-zinc-500 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/50 aria-invalid:ring-red-500/20 aria-invalid:border-red-500 bg-zinc-900/50 text-zinc-100 flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

```

## src/lib/auth.ts
```tsx
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

```

## src/lib/prisma.ts
```tsx
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

```

## src/lib/rate-limit.ts
```tsx
// Simple in-memory rate limiter
// For production, use Redis-based solution like @upstash/ratelimit

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetTime < now) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;  // Max requests allowed
  windowMs: number;     // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;  // Seconds until reset
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 60 * 1000 }
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  let entry = rateLimitMap.get(key);

  // If no entry or window expired, create new entry
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitMap.set(key, entry);

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: Math.ceil(config.windowMs / 1000),
    };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

// Helper to get client IP from request
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

```

## src/lib/utils.ts
```tsx
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

```

## src/lib/validations.ts
```tsx
import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z
    .string()
    .min(1, "Confirmez le mot de passe"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// Route schemas
export const createRouteSchema = z.object({
  name: z.string().optional(),
  scheduledDate: z
    .string()
    .min(1, "La date est requise"),
  contractId: z.string().optional(),
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
  notes: z.string().optional(),
});

export const createRouteFromPackagesSchema = z.object({
  scheduledDate: z
    .string()
    .min(1, "La date est requise"),
  contractId: z.string().optional(),
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
  routeName: z.string().optional(),
});

// Package/Stop schemas
export const packageSchema = z.object({
  externalBarcode: z.string().optional(),
  recipientName: z.string().optional(),
  address: z
    .string()
    .min(1, "L'adresse est requise"),
  city: z
    .string()
    .min(1, "La ville est requise"),
  postalCode: z
    .string()
    .min(1, "Le code postal est requis"),
  phone: z.string().optional(),
  instructions: z.string().optional(),
  accessCode: z.string().optional(),
  weight: z.string().optional(),
});

export const updateStopSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "ARRIVED", "COMPLETED", "FAILED", "SKIPPED"]),
  signature: z.string().optional(),
  signedBy: z.string().optional(),
  proofPhoto: z.string().optional(),
  deliveryNotes: z.string().optional(),
  failureReason: z.string().optional(),
});

// Contract schema
export const contractSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis"),
  code: z
    .string()
    .min(1, "Le code est requis")
    .max(10, "Le code ne peut pas dépasser 10 caractères"),
  type: z.enum(["SUBCONTRACTOR", "DIRECT"]),
  contactName: z.string().optional(),
  contactEmail: z
    .string()
    .email("Email invalide")
    .optional()
    .or(z.literal("")),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  ratePerStop: z
    .number()
    .positive("Le tarif doit être positif")
    .optional()
    .or(z.literal(0)),
  ratePerPackage: z
    .number()
    .positive("Le tarif doit être positif")
    .optional()
    .or(z.literal(0)),
  ratePerKm: z
    .number()
    .positive("Le tarif doit être positif")
    .optional()
    .or(z.literal(0)),
  notes: z.string().optional(),
});

// Customer schema
export const customerSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z
    .string()
    .min(1, "L'adresse est requise"),
  city: z
    .string()
    .min(1, "La ville est requise"),
  postalCode: z
    .string()
    .min(1, "Le code postal est requis"),
  notes: z.string().optional(),
});

// Driver schema
export const driverSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide"),
  phone: z
    .string()
    .min(1, "Le téléphone est requis"),
  licenseNumber: z
    .string()
    .min(1, "Le numéro de permis est requis"),
  licenseExpiry: z
    .string()
    .min(1, "La date d'expiration est requise"),
});

// Vehicle schema
export const vehicleSchema = z.object({
  plateNumber: z
    .string()
    .min(1, "Le numéro de plaque est requis"),
  type: z.enum(["VAN", "TRUCK", "MOTORCYCLE", "BICYCLE", "CAR"]),
  brand: z
    .string()
    .min(1, "La marque est requise"),
  model: z
    .string()
    .min(1, "Le modèle est requis"),
  year: z.number().optional(),
  capacity: z.number().optional(),
  volume: z.number().optional(),
  fuelType: z.string().optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type PackageInput = z.infer<typeof packageSchema>;
export type ContractInput = z.infer<typeof contractSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type DriverInput = z.infer<typeof driverSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;

```

## src/middleware.ts
```tsx
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Simple in-memory rate limit store (resets on server restart)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxAttempts = 5;

  let entry = loginAttempts.get(ip);

  if (!entry || entry.resetTime < now) {
    entry = { count: 1, resetTime: now + windowMs };
    loginAttempts.set(ip, entry);
    return { allowed: true, remaining: maxAttempts - 1, resetIn: 60 };
  }

  entry.count++;

  if (entry.count > maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  return {
    allowed: true,
    remaining: maxAttempts - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Rate limit login attempts
  if (path === "/api/auth/callback/credentials" && request.method === "POST") {
    const ip = getClientIp(request);
    const { allowed, remaining, resetIn } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Trop de tentatives de connexion",
          message: `Reessayez dans ${resetIn} secondes`,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(resetIn),
            "Retry-After": String(resetIn),
          },
        }
      );
    }
  }

  // Protect dashboard routes
  if (path.startsWith("/dashboard") || path.startsWith("/orders") ||
      path.startsWith("/routes") || path.startsWith("/packages") ||
      path.startsWith("/customers") || path.startsWith("/contracts") ||
      path.startsWith("/fleet") || path.startsWith("/warehouses") ||
      path.startsWith("/invoices") || path.startsWith("/settings")) {

    const session = await auth();

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect driver routes
  if (path.startsWith("/driver")) {
    const session = await auth();

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if user is a driver
    if (session.user.role !== "DRIVER" && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/routes/:path*",
    "/packages/:path*",
    "/customers/:path*",
    "/contracts/:path*",
    "/fleet/:path*",
    "/warehouses/:path*",
    "/invoices/:path*",
    "/settings/:path*",
    "/driver/:path*",
    "/api/auth/callback/credentials",
  ],
};

```

## src/types/next-auth.d.ts
```tsx
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
  }
}

```

