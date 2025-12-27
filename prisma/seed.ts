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
