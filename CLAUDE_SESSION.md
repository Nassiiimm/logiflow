# Session Claude Code - LogiFlow

## Date: 10 Janvier 2026

## Projet
**LogiFlow** - Application SaaS de gestion logistique
- **URL Production**: https://logiflow-alpha.vercel.app
- **Stack**: Next.js 16, TypeScript, Prisma, PostgreSQL (Neon), Tailwind CSS, shadcn/ui
- **Auth**: NextAuth v5 (credentials)

## Credentials de connexion
- **Email**: admin@logiflow.fr
- **Password**: admin123

## Travail accompli cette session

### 1. Fix authentification Vercel (resolu)
- Probleme: Login ne fonctionnait pas en production
- Cause: Le middleware utilisait le mauvais nom de cookie
- Solution: Ajoute `cookieName: "__Secure-authjs.session-token"` dans `getToken()` du middleware
- Fichier: `src/middleware.ts:54`

### 2. Gestion des chauffeurs (complete)
Ajout de fonctionnalites completes pour gerer les chauffeurs:

**Fichiers modifies/crees:**
- `src/app/(dashboard)/fleet/page.tsx` - Dialogs d'edition chauffeurs/vehicules + toggle disponibilite
- `src/app/(dashboard)/fleet/drivers/[id]/page.tsx` - Page detail chauffeur (nouvelle)
- `src/components/ui/switch.tsx` - Composant Switch shadcn (nouveau)

**Fonctionnalites:**
- Edition des chauffeurs (nom, telephone, permis, expiration, disponibilite)
- Edition des vehicules (immatriculation, type, marque, modele, annee, capacite, statut)
- Toggle de disponibilite directement dans le tableau
- Page de detail chauffeur avec:
  - Informations completes
  - Statistiques (livraisons totales, completees, en cours, moyenne/jour)
  - Alerte si permis expire bientot (< 30 jours)
  - Liste des vehicules assignes
  - Historique des 10 dernieres livraisons
  - Actions (toggle disponibilite, suppression)

## Structure du projet
```
logiflow/
├── src/
│   ├── app/
│   │   ├── (auth)/login, register
│   │   ├── (dashboard)/dashboard, orders, routes, packages, customers,
│   │   │              contracts, fleet, warehouses, invoices, settings, tracking
│   │   ├── (driver)/driver - Interface chauffeur mobile
│   │   └── api/ - Routes API REST
│   ├── components/
│   │   ├── ui/ - Composants shadcn
│   │   └── dashboard/ - Composants specifiques
│   └── lib/
│       ├── auth.ts - Configuration NextAuth
│       ├── prisma.ts - Client Prisma
│       └── utils.ts - Utilitaires
├── prisma/
│   └── schema.prisma - Schema base de donnees
└── public/
```

## APIs existantes
- `/api/auth/*` - Authentification NextAuth
- `/api/drivers` - CRUD chauffeurs
- `/api/vehicles` - CRUD vehicules
- `/api/orders` - CRUD commandes
- `/api/routes` - CRUD routes de livraison
- `/api/packages` - CRUD colis
- `/api/customers` - CRUD clients
- `/api/contracts` - CRUD contrats
- `/api/warehouses` - CRUD entrepots
- `/api/invoices` - CRUD factures
- `/api/tracking` - Suivi des colis
- `/api/dashboard` - Stats dashboard

## Prochaines etapes possibles
- [ ] Assignation vehicule-chauffeur
- [ ] Notifications email (expiration permis, etc.)
- [ ] Export PDF des factures
- [ ] Carte temps reel des vehicules
- [ ] Analytics et rapports avances
- [ ] Gestion des maintenances vehicules

## Commandes utiles
```bash
# Developpement
npm run dev

# Build
npm run build

# Deploiement
vercel --prod

# Base de donnees
npx prisma studio
npx prisma db push
```

## Notes importantes
- NextAuth v5 utilise le cookie `__Secure-authjs.session-token` en production
- Le middleware doit specifier ce nom de cookie dans getToken()
- Les mots de passe avec caracteres speciaux peuvent poser probleme (utiliser alphanumerique)
