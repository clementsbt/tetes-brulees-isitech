# Les Têtes Brûlées - Site Web du Club

Site web pour le club de Speedriding **Les Têtes Brûlées** à Valfréjus.

## Stack Technique

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth
- **Calendrier:** FullCalendar (à venir)

## Fonctionnalités

### Pages publiques
- ✅ Galerie des membres du club
- ✅ Informations sur le site de Valfréjus
- ✅ Liste des événements organisés par le club

### Espace membre (après inscription et validation)
- ✅ Calendrier de présence à Valfréjus
- ✅ Création et participation aux événements
- ✅ Système de covoiturage (origine des participants)
- ✅ Gestion de profil

### Admin
- ✅ Validation des inscriptions (vérification numéro FFVL)
- 🔮 Future: Agent email pour auto-validation des licences FFVL

## Installation

```bash
# Clone le repo
git clone <repo-url>
cd tetes-brulees

# Install dependencies
npm install

# Configure .env
cp .env.example .env
# Éditer .env avec tes credentials

# Setup database
npx prisma migrate dev

# Run dev server
npm run dev
```

## Structure

```
tetes-brulees/
├── app/                # Next.js App Router
│   ├── (public)/      # Routes publiques
│   └── (protected)/   # Routes membres
├── prisma/
│   └── schema.prisma  # Database schema
├── components/        # React components
└── lib/               # Utils, Prisma client, etc.
```

## Deploy

Le site est déployé automatiquement sur **Vercel** à chaque push sur `main`.

URL de production : _À venir_

## License

Projet privé - Club Les Têtes Brûlées
# Force redeploy
# test Wed May 20 18:45:13 UTC 2026
