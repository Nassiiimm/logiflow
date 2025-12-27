# LogiFlow - Code Complet

## Structure du Projet
```
src/types/next-auth.d.ts
src/app/layout.tsx
src/app/api/customers/route.ts
src/app/api/customers/[id]/route.ts
src/app/api/warehouses/route.ts
src/app/api/warehouses/[id]/route.ts
src/app/api/drivers/route.ts
src/app/api/drivers/[id]/route.ts
src/app/api/invoices/route.ts
src/app/api/auth/register/route.ts
src/app/api/auth/[...nextauth]/route.ts
src/app/api/contracts/route.ts
src/app/api/contracts/[id]/route.ts
src/app/api/dashboard/route.ts
src/app/api/packages/create-route/route.ts
src/app/api/packages/route.ts
src/app/api/tracking/route.ts
src/app/api/vehicles/route.ts
src/app/api/vehicles/[id]/route.ts
src/app/api/orders/route.ts
src/app/api/orders/[id]/route.ts
src/app/api/routes/route.ts
src/app/api/routes/[id]/stops/route.ts
src/app/api/routes/[id]/stops/[stopId]/route.ts
src/app/api/routes/[id]/route.ts
src/app/api/routes/import/route.ts
src/app/tracking/page.tsx
src/app/(auth)/register/page.tsx
src/app/(auth)/layout.tsx
src/app/(auth)/login/page.tsx
src/app/(driver)/driver/route/[id]/page.tsx
src/app/(driver)/driver/page.tsx
src/app/(driver)/layout.tsx
src/app/(dashboard)/customers/page.tsx
src/app/(dashboard)/settings/page.tsx
src/app/(dashboard)/warehouses/page.tsx
src/app/(dashboard)/invoices/page.tsx
src/app/(dashboard)/contracts/page.tsx
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/packages/page.tsx
src/app/(dashboard)/orders/page.tsx
src/app/(dashboard)/fleet/page.tsx
src/app/(dashboard)/routes/[id]/page.tsx
src/app/(dashboard)/routes/page.tsx
src/app/page.tsx
src/components/ui/alert-dialog.tsx
src/components/ui/tabs.tsx
src/components/ui/card.tsx
src/components/ui/sheet.tsx
src/components/ui/label.tsx
src/components/ui/sonner.tsx
src/components/ui/avatar.tsx
src/components/ui/dialog.tsx
src/components/ui/badge.tsx
src/components/ui/table.tsx
src/components/ui/separator.tsx
src/components/ui/button.tsx
src/components/ui/checkbox.tsx
src/components/ui/dropdown-menu.tsx
```

## prisma/schema.prisma
```typescript
// Prisma Schema pour LogiFlow - SaaS de Gestion Logistique

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ======================= UTILISATEURS =======================

enum UserRole {
  ADMIN
  MANAGER
  DISPATCHER
  DRIVER
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String
  role          UserRole  @default(DISPATCHER)
  phone         String?
  avatar        String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  driver        Driver?
  orders        Order[]   @relation("OrderCreator")
  invoices      Invoice[]
  routes        Route[]   @relation("RouteCreator")
}

// ======================= CONTRATS SOUS-TRAITANCE =======================

enum ContractType {
  SUBCONTRACTOR   // Sous-traitance (Amazon, Purolator, etc.)
  DIRECT          // Client direct
}

model Contract {
  id            String       @id @default(cuid())
  name          String       // Ex: "Amazon Logistics", "Purolator"
  type          ContractType @default(SUBCONTRACTOR)
  code          String       @unique // Ex: "AMZN", "PURO", "KWIK"
  contactName   String?
  contactEmail  String?
  contactPhone  String?
  address       String?
  city          String?
  postalCode    String?
  notes         String?

  // Tarification
  ratePerStop   Float?       // Tarif par stop
  ratePerPackage Float?      // Tarif par colis
  ratePerKm     Float?       // Tarif au km

  isActive      Boolean      @default(true)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  // Relations
  routes        Route[]
  packages      Package[]
}

// ======================= CLIENTS =======================

model Customer {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  phone         String?
  company       String?
  address       String
  city          String
  postalCode    String
  country       String    @default("France")
  notes         String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  orders        Order[]
  invoices      Invoice[]
}

// ======================= ROUTES & TOURNEES =======================

enum RouteStatus {
  DRAFT         // Brouillon
  PLANNED       // Planifiee
  IN_PROGRESS   // En cours
  COMPLETED     // Terminee
  CANCELLED     // Annulee
}

model Route {
  id              String      @id @default(cuid())
  routeNumber     String      @unique
  name            String?     // Ex: "Route Montreal Nord - 15 Dec"
  status          RouteStatus @default(DRAFT)
  scheduledDate   DateTime    // Date prevue
  startTime       DateTime?   // Heure de depart reelle
  endTime         DateTime?   // Heure de fin reelle

  // Statistiques
  totalStops      Int         @default(0)
  completedStops  Int         @default(0)
  totalPackages   Int         @default(0)
  deliveredPackages Int       @default(0)
  totalDistance   Float?      // en km

  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  contractId      String?
  contract        Contract?   @relation(fields: [contractId], references: [id])

  driverId        String?
  driver          Driver?     @relation(fields: [driverId], references: [id])

  vehicleId       String?
  vehicle         Vehicle?    @relation(fields: [vehicleId], references: [id])

  createdById     String
  createdBy       User        @relation("RouteCreator", fields: [createdById], references: [id])

  stops           RouteStop[]
}

enum StopStatus {
  PENDING       // En attente
  IN_PROGRESS   // Chauffeur en route
  ARRIVED       // Arrive sur place
  COMPLETED     // Livre
  FAILED        // Echec de livraison
  SKIPPED       // Saute
}

model RouteStop {
  id              String      @id @default(cuid())
  stopNumber      Int         // Ordre dans la route
  status          StopStatus  @default(PENDING)

  // Adresse
  recipientName   String?
  address         String
  city            String
  postalCode      String
  phone           String?

  // Coordonnees GPS
  latitude        Float?
  longitude       Float?

  // Instructions
  accessCode      String?     // Code d'acces immeuble
  instructions    String?     // Instructions speciales

  // Temps
  estimatedArrival DateTime?
  actualArrival   DateTime?
  departureTime   DateTime?

  // Preuve de livraison
  signature       String?     // Base64 de la signature
  signedBy        String?     // Nom du signataire
  proofPhoto      String?     // URL ou Base64 de la photo
  deliveryNotes   String?     // Notes a la livraison
  failureReason   String?     // Raison si echec

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  routeId         String
  route           Route       @relation(fields: [routeId], references: [id], onDelete: Cascade)

  packages        Package[]

  // Index pour optimiser les requetes
  @@index([routeId, stopNumber])
}

// ======================= COMMANDES & COLIS =======================

enum OrderStatus {
  PENDING       // En attente
  CONFIRMED     // Confirmee
  PICKED_UP     // Recuperee
  IN_TRANSIT    // En transit
  OUT_FOR_DELIVERY // En cours de livraison
  DELIVERED     // Livree
  CANCELLED     // Annulee
  RETURNED      // Retournee
}

enum OrderPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

model Order {
  id              String        @id @default(cuid())
  trackingNumber  String        @unique @default(cuid())
  status          OrderStatus   @default(PENDING)
  priority        OrderPriority @default(NORMAL)

  // Adresses
  pickupAddress   String
  pickupCity      String
  pickupPostalCode String
  deliveryAddress String
  deliveryCity    String
  deliveryPostalCode String

  // Details
  description     String?
  weight          Float?        // en kg
  dimensions      String?       // LxWxH en cm
  specialInstructions String?

  // Dates
  pickupDate      DateTime?
  estimatedDelivery DateTime?
  actualDelivery  DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Prix
  price           Float         @default(0)

  // Relations
  customerId      String
  customer        Customer      @relation(fields: [customerId], references: [id])

  createdById     String
  createdBy       User          @relation("OrderCreator", fields: [createdById], references: [id])

  driverId        String?
  driver          Driver?       @relation(fields: [driverId], references: [id])

  vehicleId       String?
  vehicle         Vehicle?      @relation(fields: [vehicleId], references: [id])

  warehouseId     String?
  warehouse       Warehouse?    @relation(fields: [warehouseId], references: [id])

  packages        Package[]
  trackingEvents  TrackingEvent[]
  invoiceItems    InvoiceItem[]
}

enum PackageStatus {
  PENDING         // En attente
  IN_TRANSIT      // En transit
  OUT_FOR_DELIVERY // En livraison
  DELIVERED       // Livre
  FAILED          // Echec
  RETURNED        // Retourne
}

model Package {
  id              String        @id @default(cuid())

  // Double reference code-barre
  barcode         String        @unique @default(cuid())  // Notre code interne
  externalBarcode String?       // Code-barre du client (Amazon, Purolator, etc.)

  status          PackageStatus @default(PENDING)

  // Details physiques
  weight          Float?        // en kg
  length          Float?        // en cm
  width           Float?        // en cm
  height          Float?        // en cm
  description     String?

  // Preuve de livraison (niveau colis)
  signature       String?       // Base64 de la signature
  signedBy        String?       // Nom du signataire
  proofPhoto      String?       // URL ou Base64 de la photo
  deliveredAt     DateTime?
  deliveryNotes   String?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  orderId         String?
  order           Order?        @relation(fields: [orderId], references: [id], onDelete: Cascade)

  routeStopId     String?
  routeStop       RouteStop?    @relation(fields: [routeStopId], references: [id])

  contractId      String?
  contract        Contract?     @relation(fields: [contractId], references: [id])

  // Index pour recherche par code-barre
  @@index([externalBarcode])
}

// ======================= TRACKING =======================

enum TrackingEventType {
  ORDER_CREATED
  ORDER_CONFIRMED
  PICKED_UP
  IN_WAREHOUSE
  IN_TRANSIT
  OUT_FOR_DELIVERY
  DELIVERY_ATTEMPTED
  DELIVERED
  CANCELLED
  RETURNED
  EXCEPTION
  SCAN           // Scan de code-barre
  SIGNATURE      // Signature capturee
  PHOTO          // Photo prise
}

model TrackingEvent {
  id          String            @id @default(cuid())
  type        TrackingEventType
  description String
  location    String?
  latitude    Float?
  longitude   Float?

  // Preuve
  signature   String?           // Base64 de la signature
  photoUrl    String?           // URL de la photo
  scannedBarcode String?        // Code-barre scanne

  timestamp   DateTime          @default(now())

  // Relations
  orderId     String
  order       Order             @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

// ======================= FLOTTE =======================

enum VehicleType {
  VAN
  TRUCK
  MOTORCYCLE
  BICYCLE
  CAR
}

enum VehicleStatus {
  AVAILABLE
  IN_USE
  MAINTENANCE
  OUT_OF_SERVICE
}

model Vehicle {
  id              String        @id @default(cuid())
  plateNumber     String        @unique
  type            VehicleType
  brand           String
  model           String
  year            Int?
  capacity        Float?        // en kg
  volume          Float?        // en m3
  status          VehicleStatus @default(AVAILABLE)
  currentLocation String?
  latitude        Float?
  longitude       Float?
  fuelType        String?
  lastMaintenance DateTime?
  nextMaintenance DateTime?
  isActive        Boolean       @default(true)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  driverId        String?
  driver          Driver?       @relation(fields: [driverId], references: [id])
  orders          Order[]
  routes          Route[]
  maintenances    Maintenance[]
}

model Driver {
  id              String    @id @default(cuid())
  licenseNumber   String    @unique
  licenseExpiry   DateTime
  phone           String
  emergencyContact String?
  isAvailable     Boolean   @default(true)
  currentLocation String?
  latitude        Float?
  longitude       Float?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id])
  vehicles        Vehicle[]
  orders          Order[]
  routes          Route[]
}

model Maintenance {
  id            String    @id @default(cuid())
  type          String    // Oil change, Tire change, etc.
  description   String?
  cost          Float?
  scheduledDate DateTime
  completedDate DateTime?
  notes         String?
  createdAt     DateTime  @default(now())

  // Relations
  vehicleId     String
  vehicle       Vehicle   @relation(fields: [vehicleId], references: [id])
}

// ======================= ENTREPOTS =======================

model Warehouse {
  id            String    @id @default(cuid())
  name          String
  address       String
  city          String
  postalCode    String
  country       String    @default("France")
  capacity      Float?    // en m3
  currentStock  Float     @default(0)
  latitude      Float?
  longitude     Float?
  phone         String?
  email         String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  orders        Order[]
  inventory     InventoryItem[]
}

model InventoryItem {
  id            String    @id @default(cuid())
  sku           String
  name          String
  description   String?
  quantity      Int       @default(0)
  minQuantity   Int       @default(0)
  location      String?   // Zone dans l'entrepot
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  warehouseId   String
  warehouse     Warehouse @relation(fields: [warehouseId], references: [id])

  @@unique([sku, warehouseId])
}

// ======================= FACTURATION =======================

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
}

model Invoice {
  id            String        @id @default(cuid())
  invoiceNumber String        @unique
  status        InvoiceStatus @default(DRAFT)
  issueDate     DateTime      @default(now())
  dueDate       DateTime
  subtotal      Float
  taxRate       Float         @default(20)
  taxAmount     Float
  total         Float
  notes         String?
  paidAt        DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  customerId    String
  customer      Customer      @relation(fields: [customerId], references: [id])

  createdById   String
  createdBy     User          @relation(fields: [createdById], references: [id])

  items         InvoiceItem[]
}

model InvoiceItem {
  id          String  @id @default(cuid())
  description String
  quantity    Int     @default(1)
  unitPrice   Float
  total       Float

  // Relations
  invoiceId   String
  invoice     Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  orderId     String?
  order       Order?  @relation(fields: [orderId], references: [id])
}

// ======================= PARAMETRES =======================

model Settings {
  id              String    @id @default(cuid())
  companyName     String    @default("LogiFlow")
  companyAddress  String?
  companyPhone    String?
  companyEmail    String?
  companyLogo     String?
  currency        String    @default("EUR")
  timezone        String    @default("Europe/Paris")
  defaultTaxRate  Float     @default(20)
  trackingPageUrl String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

## prisma/seed.ts
```typescript
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

## src/lib/auth.ts
```typescript
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
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```

## src/lib/utils.ts
```typescript
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

## src/app/api/routes/route.ts
```typescript
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

## src/app/api/packages/route.ts
```typescript
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

## src/app/api/packages/create-route/route.ts
```typescript
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

## src/app/api/drivers/route.ts
```typescript
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

## src/app/api/contracts/route.ts
```typescript
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

## src/app/api/dashboard/route.ts
```typescript
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

## src/app/page.tsx
```typescript
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

## src/app/(dashboard)/layout.tsx
```typescript
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

## src/app/(dashboard)/packages/page.tsx
```typescript
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

## src/app/(dashboard)/routes/page.tsx
```typescript
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

## src/app/(dashboard)/dashboard/page.tsx
```typescript
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

## src/app/(auth)/login/page.tsx
```typescript
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Une erreur est survenue");
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
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@logiflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
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

