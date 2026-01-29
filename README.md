# WAJIL Official Site (v1)
[![Deploy to GitHub Pages](https://github.com/alfredpenha/wajil/actions/workflows/deploy.yml/badge.svg)](https://github.com/alfredpenha/wajil/actions/workflows/deploy.yml)

Landing ultra ligera en Astro + TailwindCSS + TypeScript. Contenido centralizado en `src/content/site.json` y estructura lista para integrar Sanity en v2 sin reescribir componentes.

## Stack y deploy
- Astro (SSG) + TailwindCSS + TypeScript
- Deploy target elegido: **Cloudflare Pages**
  - Justificacion: distribucion global en edge, despliegue rapido para sitios estaticos y buen soporte para Astro sin configuracion compleja.

## Requisitos
- Node 18+
- npm o pnpm

## Desarrollo local
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy en Cloudflare Pages
1. Crear un nuevo proyecto en Cloudflare Pages.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Variables de entorno (si aplica): ver seccion Analytics.

## Deployment (GitHub Pages)
- URL esperada: https://alfredpenha.github.io/wajil/
- Activar Pages: Settings → Pages → Source = GitHub Actions
- Si carga HTML pero no CSS/imagenes: revisa que `base: '/wajil/'` este configurado en `astro.config.mjs`.
- `dist/` no se commitea; lo publica GitHub Actions.

## Analytics (Plausible preferido)
El layout incluye el script de Plausible y un helper para eventos en `src/lib/analytics.ts`.

Variables publicas:
```
PUBLIC_ANALYTICS_PROVIDER=plausible
PUBLIC_PLAUSIBLE_DOMAIN=wajil.com
PUBLIC_GA4_ID=G-XXXXXXX
```

Para cambiar a GA4, configura:
```
PUBLIC_ANALYTICS_PROVIDER=ga4
PUBLIC_GA4_ID=G-XXXXXXX
```

## Contenido e imagenes
- Edita copy, links, reseñas y paths en `src/content/site.json`.
- Coloca assets en `src/assets/images` y actualiza las rutas en el JSON.
- La pagina usa `<picture>` con AVIF + WebP + fallback JPG.

## Estructura
```
src/
  assets/images/
  components/
  content/site.json
  layouts/Base.astro
  lib/analytics.ts
  pages/index.astro
  pages/privacy.astro
  styles/global.css
```
