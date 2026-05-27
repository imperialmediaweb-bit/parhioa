# Parhioa — Parohia Sf. Cuvioasă Teodora de la Sihla

Migrare WordPress → **Next.js 14 (App Router) + TypeScript** cu design premium:
- **shadcn/ui** (Button, Card, Badge) — componente accesibile
- **Magic UI** (BorderBeam, ShimmerButton, AnimatedGradientText, NumberTicker, FadeIn)
- **Framer Motion** pentru animații
- **Fonts**: Cinzel (titluri — feel bizantin/lapidar), Cormorant Garamond (serif clasic ortodox), Inter (UI)
- **Tailwind CSS** cu paleta brandului (navy + coral + cream + gold)
- **Prisma + PostgreSQL** pentru date
- **Cloudinary** pentru poze

**Un singur serviciu** pe Railway: Next.js servește totul (frontend + SSR + API), import script separat.

## Setup local

```bash
npm install
cp .env.example .env
# completează:
#   DATABASE_URL=postgresql://...
#   CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET
#   WORDPRESS_API_URL=https://www.parohiasfteodoradelasihla.ro/wp-json/wp/v2
npx prisma migrate dev --name init
npm run dev
```

Deschizi `http://localhost:3000`.

## Import din WordPress

```bash
npm run import:wp
```

Scriptul:
1. Descarcă toate pozele din WP, le urcă pe Cloudinary (sub `parhioa/wp-<id>`)
2. Importă pagini, postări, categorii, tag-uri în Postgres
3. Rescrie URL-urile imaginilor din conținut → Cloudinary
4. E idempotent

## Rute

- `/` — pagina principală cu hero, secțiuni, articole, CTA donații
- `/[slug]` — orice pagină din WordPress
- `/blog` — listă noutăți
- `/blog/[slug]` — articol

## Deploy Railway

1. New Project → Deploy from GitHub repo
2. Adaugi **PostgreSQL** plugin
3. **Variables**:
   - `DATABASE_URL` (auto din plugin)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `WORDPRESS_API_URL`
   - `NODE_ENV=production`
4. Build & deploy → `railway.json` rulează `prisma migrate deploy && next start`
5. Import inițial:
   ```bash
   railway run npm run import:wp
   ```

## Structură

```
app/                       # Next.js App Router
  layout.tsx               # root layout (fonts + header + footer)
  page.tsx                 # home (hero + secțiuni + posts + CTA)
  [slug]/page.tsx          # pagini WP dinamice
  blog/page.tsx, blog/[slug]/page.tsx
  globals.css              # tailwind + tipografie WP-content
components/
  ui/                      # shadcn-style: button, card, badge
  magicui/                 # border-beam, shimmer-button, gradient-text, number-ticker, fade-in
  site/                    # logo, header, footer, hero, post-card, eyebrow
lib/
  prisma.ts                # client Prisma singleton
  utils.ts                 # cn() + formatDateRo()
prisma/schema.prisma       # modele DB (Page, Post, Media, Category, Tag, Menu)
scripts/import-wordpress.ts
```

## Palette & fonturi

```
Navy   #1a2942  (titluri, header)
Coral  #c4513f  (accent, butoane, link-uri)
Cream  #faf6ef  (fundaluri secundare)
Gold   #c8a87a  (accent secundar)

Cinzel             — display, „piatră săpată", titluri mari
Cormorant Garamond — body serif clasic, italic accent
Inter              — UI, butoane, navigație
```
