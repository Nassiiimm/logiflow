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
