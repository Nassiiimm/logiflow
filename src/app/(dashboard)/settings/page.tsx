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
