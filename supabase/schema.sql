create extension if not exists pgcrypto;

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  content text not null,
  cover_image text default '',
  status text not null default 'published' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'General',
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shop_products (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  affiliate_url text not null default '',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
before update on public.blogs
for each row execute function public.set_updated_at();

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at
before update on public.faqs
for each row execute function public.set_updated_at();

drop trigger if exists shop_products_set_updated_at on public.shop_products;
create trigger shop_products_set_updated_at
before update on public.shop_products
for each row execute function public.set_updated_at();

alter table public.blogs enable row level security;
alter table public.faqs enable row level security;
alter table public.shop_products enable row level security;

drop policy if exists "Public can read published blogs" on public.blogs;
create policy "Public can read published blogs"
on public.blogs
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Public can read faqs" on public.faqs;
create policy "Public can read faqs"
on public.faqs
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read active shop products" on public.shop_products;
create policy "Public can read active shop products"
on public.shop_products
for select
to anon, authenticated
using (active = true);


-- Aliwvide dropshipping storefront
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
  add column if not exists offers jsonb not null default '[]'::jsonb,
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


create table if not exists public.shop_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  product_id uuid references public.shop_products(id) on delete set null,
  product_snapshot jsonb not null default '{}'::jsonb,
  customer jsonb not null default '{}'::jsonb,
  selected_options jsonb not null default '{}'::jsonb,
  quantity integer not null default 1 check (quantity > 0),
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'USD',
  source text not null default '',
  paypal_order_id text unique,
  paypal_capture_id text,
  payment_status text not null default 'pending'
    check (payment_status in ('pending','paid','failed','cancelled','refunded')),
  fulfilment_status text not null default 'new'
    check (fulfilment_status in ('new','ordered','shipped','delivered','cancelled')),
  tracking_carrier text not null default '',
  tracking_number text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists shop_orders_set_updated_at on public.shop_orders;
create trigger shop_orders_set_updated_at
before update on public.shop_orders
for each row execute function public.set_updated_at();

alter table public.shop_orders enable row level security;
