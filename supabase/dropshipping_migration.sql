-- Run this once in Supabase SQL Editor for the Aliwvide dropshipping shop.
-- It keeps supplier information private from public storefront queries.

alter table public.shop_products
  add column if not exists slug text,
  add column if not exists category text not null default 'General',
  add column if not exists description text not null default '',
  add column if not exists price numeric(12,2),
  add column if not exists compare_at_price numeric(12,2),
  add column if not exists currency text not null default 'USD',
  add column if not exists images jsonb not null default '[]'::jsonb,
  add column if not exists video_url text not null default '',
  add column if not exists variants jsonb not null default '[]'::jsonb,
  add column if not exists shipping_text text not null default '',
  add column if not exists status text not null default 'draft';

create unique index if not exists shop_products_slug_unique
on public.shop_products(slug)
where slug is not null;

alter table public.shop_products
  drop constraint if exists shop_products_status_check;

alter table public.shop_products
  add constraint shop_products_status_check
  check (status in ('draft', 'active'));

create table if not exists public.shop_product_private (
  product_id uuid primary key references public.shop_products(id) on delete cascade,
  supplier_url text not null default '',
  supplier_cost numeric(12,2),
  source_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists shop_product_private_set_updated_at on public.shop_product_private;
create trigger shop_product_private_set_updated_at
before update on public.shop_product_private
for each row execute function public.set_updated_at();

alter table public.shop_product_private enable row level security;

drop policy if exists "Public can read active shop products" on public.shop_products;
create policy "Public can read active shop products"
on public.shop_products
for select
to anon, authenticated
using (active = true and status = 'active');

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects
for select
to public
using (bucket_id = 'product-images');
