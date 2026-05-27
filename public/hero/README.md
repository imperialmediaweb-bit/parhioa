# /public/hero/

Pune aici fișierul video pentru primul slide din home:

```
public/hero/intro.mp4
```

## Recomandări pentru video

- **Format**: MP4 (codec H.264 + audio AAC)
- **Rezoluție**: 1920×1080 (Full HD)
- **Durată**: 10–20 secunde (rulează în buclă, deci scurt e mai bine)
- **Mărime fișier**: sub 8 MB ideal, max 15 MB
- **Audio**: păstrează-l mut (autoplay nu merge cu sunet — browserul refuză)
- **Stil**: cinematic, încet, focal point clar (biserică, lumânări, icoane, slujbă)

## Cum convertești un video existent

Cu **HandBrake** (gratuit, https://handbrake.fr):
- Preset: **Vimeo YouTube HQ 1080p60**
- Web Optimized: ✓
- Audio: dezactivează

Sau cu **FFmpeg**:
```bash
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset slow -an -vf "scale=1920:-2" -movflags +faststart intro.mp4
```

## Alternativă: Cloudinary

Dacă vrei să eviți să bagi video-ul în repo (pentru fișiere mari), urcă-l pe
Cloudinary și înlocuiește în `app/page.tsx` valoarea `src` cu URL-ul Cloudinary:

```tsx
media: {
  type: 'video',
  src: 'https://res.cloudinary.com/<cloud>/video/upload/parhioa/intro.mp4',
  poster: '...',
}
```
