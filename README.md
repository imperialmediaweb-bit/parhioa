# Parhioa — migrare WordPress → NestJS

Site-ul Parohiei Sf. Teodora de la Sihla, migrat de pe WordPress pe NestJS + TypeScript.

**Un singur serviciu:** NestJS servește HTML cu Handlebars + Postgres + Cloudinary pentru poze.

## Setup local

```bash
npm install
cp .env.example .env
# completează:
#   DATABASE_URL=postgresql://...
#   CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET
#   WORDPRESS_API_URL=https://www.parohiasfteodoradelasihla.ro/wp-json/wp/v2
npx prisma migrate dev --name init
npm run start:dev
```

Deschizi `http://localhost:3000`.

## Import din WordPress

```bash
npm run import:wp
```

Scriptul:
1. Descarcă toate pozele din WP și le urcă pe Cloudinary
2. Importă pagini, postări, categorii, tag-uri în Postgres
3. Rescrie URL-urile pozelor în conținut să pointeze la Cloudinary
4. E idempotent (poți relua oricând)

## Rute publice

- `/` — pagina principală (cu pagina `acasa` sau `home` din WP + ultimele articole)
- `/:slug` — orice pagină din WordPress
- `/blog` — listă articole
- `/blog/:slug` — un articol

## Deploy pe Railway

1. New Project → Deploy from GitHub repo
2. Adaugi plugin **PostgreSQL** (Railway setează `DATABASE_URL` automat)
3. În **Variables**:
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `WORDPRESS_API_URL`
   - `NODE_ENV=production`
4. Railway rulează `railway.json` → migrează DB + pornește serverul
5. După primul deploy, importul:
   ```bash
   railway run npm run import:wp
   ```

## Structură

```
src/
  main.ts             # bootstrap (NestJS + Handlebars)
  app.module.ts
  app.controller.ts   # toate rutele
  prisma/             # PrismaService
  cloudinary/         # CloudinaryService
prisma/schema.prisma  # modele DB
views/                # template-uri Handlebars (home, page, blog, post)
public/styles.css     # CSS
scripts/import-wordpress.ts
```
