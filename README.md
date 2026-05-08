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


## Admin Export JSON

Go to:

```txt
/admin
```

Upload your Excel file, then click:

```txt
Export JSON
```

This downloads:

```txt
aliwvide-countries-data.json
```

Because this is no-backend, it does not update live site automatically. Replace your data file or connect this JSON to a backend later.

## Secure Admin Login

The old `/admin` page has been removed.

Use this hidden admin URL:

```text
/secure-aliwvide-control-9xq2m
```

Set these environment variables in Vercel:

```text
ADMIN_USERNAME=your_private_username
ADMIN_PASSWORD=your_private_strong_password
```

Do not put real credentials inside the code. Use Vercel Project Settings → Environment Variables.

After setting env variables, redeploy the project.
