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



Open directly:

```txt
```

## Main files

```txt
src/data/countries.js
src/data/translations.js
src/components/Explorer.jsx
src/components/GlobeHero.jsx
```



Go to:

```txt
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




```text
```

Set these environment variables in Vercel:

```text
```

Do not put real credentials inside the code. Use Vercel Project Settings → Environment Variables.

After setting env variables, redeploy the project.


## Admin Page Restored

The admin Excel-to-JSON manager is available at:

https://www.aliwvide.com/secure-aliwvide-control-9xq2m

No username/password environment variables are required in this version. The contact form uses this hardcoded Formspree endpoint:

https://formspree.io/f/xqenywva
