# Parhioa — migrare WordPress → NestJS

Backend NestJS + TypeScript pentru `parohiasfteodoradelasihla.ro`, cu:
- **Prisma + PostgreSQL** pentru date
- **Cloudinary** pentru imagini
- **Script de import** din WP REST API

## Setup local

```bash
npm install
cp .env.example .env
# completează DATABASE_URL, CLOUDINARY_*, WORDPRESS_API_URL
npx prisma migrate dev --name init
npm run start:dev
```

## Import din WordPress

În `.env`:
```
WORDPRESS_API_URL="https://www.parohiasfteodoradelasihla.ro/wp-json/wp/v2"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

Apoi:
```bash
npm run import:wp
```

Scriptul:
1. Descarcă toate imaginile din WP și le urcă pe Cloudinary (sub `parhioa/wp-<id>`)
2. Importă categorii, tag-uri, pagini, postări
3. Rescrie URL-urile imaginilor din conținut să pointeze la Cloudinary
4. Rulează idempotent (poți relua oricând)

## Deploy pe Railway

1. Creezi proiect nou pe Railway → "Deploy from GitHub repo"
2. Adaugi un **PostgreSQL plugin** — Railway setează `DATABASE_URL` automat
3. În **Variables** adaugi:
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `WORDPRESS_API_URL`
   - `NODE_ENV=production`
4. Railway rulează `railway.json` → migrează + pornește serverul
5. După primul deploy, rulezi importul o singură dată:
   ```bash
   railway run npm run import:wp
   ```

## API endpoints

- `GET /api/pages` — toate paginile
- `GET /api/pages/:slug` — o pagină
- `GET /api/posts?take=20&skip=0&category=...` — postări (paginat)
- `GET /api/posts/:slug` — o postare
- `GET /api/media` — toate imaginile
- `GET /api/categories` — categorii
- `GET /api/menus/:slug` — meniu cu itemi

## Frontend (Next.js)

În folder-ul `web/`. Consumă API-ul NestJS.

```bash
cd web
npm install
cp .env.example .env  # NEXT_PUBLIC_API_URL=http://localhost:3000/api
npm run dev           # pornește pe http://localhost:3000 implicit; setează PORT=3001 ca să nu intre în conflict cu API-ul
```

Rute:
- `/` — pagina principală (caută slug `acasa` sau `home`) + ultimele articole
- `/[slug]` — orice pagină din WordPress după slug
- `/blog` — listă articole
- `/blog/[slug]` — articol

Pentru Railway: creezi un al doilea serviciu apuntat la folderul `web/` cu `NEXT_PUBLIC_API_URL` setat la URL-ul public al API-ului.

## Structură

```
src/                       # NestJS backend
  main.ts
  app.module.ts
  prisma/, cloudinary/
  pages/, posts/, media/, categories/, menus/
prisma/schema.prisma
scripts/import-wordpress.ts
web/                       # Next.js frontend
  src/app/                 # rute (App Router)
  src/components/          # Header, Footer
  src/lib/api.ts           # client API
```
