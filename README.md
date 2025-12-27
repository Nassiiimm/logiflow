# LogiFlow

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

SaaS de gestion logistique pour les entreprises de livraison last-mile. Gerez vos colis, routes, chauffeurs et factures en un seul endroit.

## Fonctionnalites

### Gestion des Colis
- Import CSV de colis (compatible Amazon, Purolator, etc.)
- Creation automatique de routes depuis les colis
- Groupement intelligent par adresse
- Suivi des statuts en temps reel

### Gestion des Routes
- Creation et planification de tournees
- Affectation chauffeurs/vehicules
- Suivi de progression
- Import CSV avec stops

### Interface Chauffeur
- Vue mobile optimisee
- Navigation stop par stop
- Capture signature electronique
- Photo preuve de livraison
- Mise a jour statuts en temps reel

### Dashboard
- KPIs en temps reel
- Statistiques de livraison
- Suivi des performances

### Autres Modules
- Gestion des contrats (sous-traitance)
- Gestion clients
- Gestion de flotte (vehicules + maintenance)
- Facturation
- Tracking public

## Stack Technique

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (credentials)
- **Validation**: Zod

## Installation

### Prerequis

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Setup

1. **Cloner le repo**
```bash
git clone https://github.com/Nassiiimm/logiflow.git
cd logiflow
```

2. **Installer les dependances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Editer `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/logiflow"
AUTH_SECRET="votre-secret-genere-aleatoirement"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Initialiser la base de donnees**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Lancer le serveur de developpement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### Comptes de demo

| Role | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@logiflow.com | password123 |
| Dispatcher | dispatcher@logiflow.com | password123 |
| Chauffeur | driver@logiflow.com | password123 |

## Structure du Projet

```
logiflow/
├── prisma/
│   ├── schema.prisma      # Schema base de donnees
│   └── seed.ts            # Donnees initiales
├── src/
│   ├── app/
│   │   ├── (auth)/        # Pages login/register
│   │   ├── (dashboard)/   # Pages admin
│   │   ├── (driver)/      # Interface chauffeur
│   │   ├── api/           # API Routes
│   │   └── tracking/      # Page tracking public
│   ├── components/
│   │   ├── dashboard/     # Composants dashboard
│   │   └── ui/            # Composants shadcn/ui
│   └── lib/
│       ├── auth.ts        # Config NextAuth
│       ├── prisma.ts      # Client Prisma
│       ├── validations.ts # Schemas Zod
│       └── utils.ts       # Utilitaires
└── public/
    └── exemple-colis.csv  # Fichier CSV exemple
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/routes` | Gestion des routes |
| POST | `/api/packages/create-route` | Creer route depuis colis |
| GET/POST | `/api/drivers` | Gestion chauffeurs |
| GET/POST | `/api/contracts` | Gestion contrats |
| GET/POST | `/api/customers` | Gestion clients |
| GET/POST | `/api/vehicles` | Gestion vehicules |
| GET | `/api/dashboard` | Stats dashboard |
| GET | `/api/tracking` | Suivi public |

## Deploiement

### Vercel (recommande)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t logiflow .
docker run -p 3000:3000 logiflow
```

## Roadmap

- [ ] Notifications push
- [ ] Optimisation d'itineraires (algo)
- [ ] Export PDF factures
- [ ] Integration maps (Leaflet)
- [ ] Mode offline chauffeur
- [ ] API publique

## Licence

MIT

---

Developpe avec Claude Code
