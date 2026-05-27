# public/

Fișiere statice servite direct de Next.js la root.

## Logo

Salvează icoana parohiei (Sfânta Cuvioasă Teodora de la Sihla) ca:

```
public/logo.png
```

Recomandări:
- **Format**: PNG sau WebP cu fundal transparent
- **Dimensiune**: minim 256×256px (idealul: 512×512px)
- **Aspect ratio**: pătrat (1:1)

## Hero video (opțional)

Pentru video pe primul slide din home:

```
public/hero/intro.mp4
```

Recomandări:
- **Format**: MP4 H.264 (compatibil cu toate browserele)
- **Durată**: 10–20 secunde
- **Rezoluție**: 1920×1080 (Full HD)
- **Mărime**: sub 8 MB (autoplay e mut, nu e nevoie de calitate audio)
- **Stil**: cinematic, încet, cu biserica/lumânări/icoane

Alternativ, pune video-ul pe Cloudinary și înlocuiește `/hero/intro.mp4`
din `app/page.tsx` cu URL-ul direct din Cloudinary.
