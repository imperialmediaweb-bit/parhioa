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

## Structură

```
src/
  main.ts                  # bootstrap
  app.module.ts
  prisma/                  # PrismaService global
  cloudinary/              # CloudinaryService global
  pages/, posts/, media/, categories/, menus/
prisma/schema.prisma       # modele DB
scripts/import-wordpress.ts # script de migrare
```
