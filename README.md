# Tourist Guide Next.js Website

SEO-ready and Vercel-ready travel app guide website.

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

## Environment variable

Create `.env.local`:

```txt
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Important files

```txt
src/data/countries.js
src/data/translations.js
src/app/sitemap.js
src/app/robots.js
src/app/country/[slug]/page.js
src/app/admin/page.js
```

Admin is hidden from public navigation. Open it directly:

```txt
/admin
```
