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
