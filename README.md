# Aliwvide Travel Guide

This Next.js project now supports two content modes:

1. **Fallback JSON mode** — if Supabase environment variables are not added yet, the site still reads `src/data/site-content.json`.
2. **Live Supabase mode** — once Supabase is configured, blogs and FAQs are read from Supabase and can be managed live from the hidden admin page without redeploying.

## Hidden admin URL

`/secure-aliwvide-control-9xq2m`

The admin area now has:

- Live blog create, edit, delete
- Upload one blog JSON file and publish it live
- Live FAQ create, edit, delete
- Upload one FAQ JSON file and publish it live
- Existing Excel-to-country-data JSON tool

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** in Supabase.
3. Run `supabase/schema.sql`.
4. Optionally run `supabase/seed.sql` to copy the sample blog and FAQ content into Supabase.
5. Add these Vercel Environment Variables:

```env
NEXT_PUBLIC_SITE_URL=https://www.aliwvide.com
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
ADMIN_SESSION_SECRET=replace_with_a_long_random_secret
N8N_API_SECRET=replace_with_a_long_random_secret
```

6. Redeploy on Vercel.
7. Open the hidden admin URL and log in.

## n8n blog posting endpoint

Use this route from n8n:

```http
POST /api/n8n/blogs
```

Add one of these headers:

```http
x-n8n-secret: YOUR_N8N_API_SECRET
```

or

```http
Authorization: Bearer YOUR_N8N_API_SECRET
```

Example body:

```json
{
  "title": "Best Taxi Apps in India for Tourists",
  "slug": "best-taxi-apps-in-india-for-tourists",
  "description": "A simple guide to the best taxi apps tourists can use in India.",
  "content": "Your full blog content here.",
  "status": "published"
}
```

If the same `slug` is sent again, the n8n route updates the existing blog instead of creating a duplicate.

## Build locally

```bash
npm install
npm run build
```

## Aliwvide brand assets added

Logo files are in `public/brand/`.

Used in the project:
- Navbar logo: `src/components/SiteLogo.jsx`
- Footer logo: `src/components/Footer.jsx`
- Homepage hero brand card: `src/components/LogoHeroMedia.jsx`
- Browser/favicon icons: `public/favicon.ico`, `public/icon.png`, `public/apple-touch-icon.png`
- Social preview image: `public/brand/aliwvide-og-image.jpg`

The animation files are included in `public/brand/` but are not loaded in the navbar to keep mobile performance fast.
