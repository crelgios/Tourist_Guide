# Aliwvide Travel Guide

Modern Next.js + Tailwind website for discovering trusted travel apps by country.

## Run locally

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

## Vercel

Framework Preset: Next.js  
Build Command: `npm run build`  
Install Command: `npm install`

Set environment variable:

```txt
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Hidden Admin

Admin is hidden from public navigation and sitemap.

Open directly:

```txt
/admin
```

## Main files

```txt
src/data/countries.js
src/data/translations.js
src/components/Explorer.jsx
src/components/GlobeHero.jsx
src/app/admin/page.js
```
