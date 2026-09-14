"use client";

import { useMemo, useState } from "react";
import {
  Accessibility,
  Backpack,
  BatteryCharging,
  BriefcaseBusiness,
  Cable,
  Camera,
  Car,
  CheckCircle2,
  CloudRain,
  Cross,
  ExternalLink,
  Fan,
  FolderOpen,
  Footprints,
  IdCard,
  Luggage,
  Moon,
  PackageOpen,
  Plane,
  Plug,
  Scale,
  Search,
  Shirt,
  ShoppingBag,
  Smartphone,
  Tags,
  Umbrella,
  WalletCards,
  Waves,
  LockKeyhole,
  CupSoda,
  Armchair
} from "lucide-react";

const affiliateLink = "https://www.amazon.in/dp/B0CXM9Q1SW?tag=aliwvidetrave-21";

const iconMap = {
  luggage: Luggage,
  backpack: Backpack,
  packing: PackageOpen,
  adapter: Plug,
  scale: Scale,
  pillow: Armchair,
  passport: WalletCards,
  toiletry: BriefcaseBusiness,
  powerbank: BatteryCharging,
  bottle: CupSoda,
  cable: Cable,
  strap: Tags,
  tags: Tags,
  shoes: Footprints,
  socks: Accessibility,
  mask: Moon,
  umbrella: Umbrella,
  daypack: Backpack,
  phonepouch: Smartphone,
  firstaid: Cross,
  lock: LockKeyhole,
  laundry: Shirt,
  tripod: Camera,
  carholder: Car,
  sling: BriefcaseBusiness,
  duffel: ShoppingBag,
  towel: Waves,
  fan: Fan,
  raincover: CloudRain,
  documents: FolderOpen
};

const products = [
  ["Cabin Trolley Bag", "Luggage", "luggage", "Best Seller"],
  ["Travel Backpack 45L", "Bags", "backpack", "Popular"],
  ["Packing Cubes Set", "Organizers", "packing", "Travel Pick"],
  ["Universal Travel Adapter", "Electronics", "adapter", "Must Have"],
  ["Digital Luggage Scale", "Flight Essentials", "scale", "Popular"],
  ["Memory Foam Neck Pillow", "Comfort", "pillow", "Best Seller"],
  ["RFID Passport Wallet", "Documents", "passport", "Travel Pick"],
  ["Hanging Toiletry Bag", "Organizers", "toiletry", "Popular"],
  ["20,000mAh Power Bank", "Electronics", "powerbank", "Best Seller"],
  ["Foldable Travel Bottle", "Outdoor", "bottle", "Travel Pick"],
  ["Cable Organizer Pouch", "Electronics", "cable", "Popular"],
  ["Luggage Strap", "Luggage", "strap", "Travel Pick"],
  ["Luggage Tags", "Luggage", "tags", "Popular"],
  ["Travel Shoe Bags", "Organizers", "shoes", "Travel Pick"],
  ["Compression Socks", "Comfort", "socks", "Popular"],
  ["Sleep Mask", "Comfort", "mask", "Best Seller"],
  ["Travel Umbrella", "Outdoor", "umbrella", "Travel Pick"],
  ["Foldable Daypack", "Bags", "daypack", "Popular"],
  ["Waterproof Phone Pouch", "Outdoor", "phonepouch", "Best Seller"],
  ["Travel First Aid Pouch", "Safety", "firstaid", "Travel Pick"],
  ["TSA Combination Lock", "Safety", "lock", "Popular"],
  ["Travel Laundry Bag", "Organizers", "laundry", "Travel Pick"],
  ["Phone Tripod", "Electronics", "tripod", "Best Seller"],
  ["Car Phone Holder", "Road Trips", "carholder", "Popular"],
  ["Travel Sling Bag", "Bags", "sling", "Best Seller"],
  ["Foldable Duffel Bag", "Bags", "duffel", "Travel Pick"],
  ["Travel Towel", "Outdoor", "towel", "Popular"],
  ["Portable Mini Fan", "Comfort", "fan", "Travel Pick"],
  ["Backpack Rain Cover", "Outdoor", "raincover", "Popular"],
  ["Travel Document Organizer", "Documents", "documents", "Best Seller"]
].map(([name, category, icon, badge], i) => ({ id: i + 1, name, category, icon, badge, link: affiliateLink }));

const categories = ["All", "Luggage", "Bags", "Electronics", "Organizers", "Comfort", "Outdoor", "Documents", "Safety"];

const categoryIcons = {
  Luggage,
  Bags: Backpack,
  Electronics: Plug,
  Organizers: PackageOpen,
  Comfort: Armchair,
  Outdoor: Umbrella,
  Documents: IdCard,
  Safety: LockKeyhole
};

function IconTile({ icon, className = "h-16 w-16" }) {
  const Icon = iconMap[icon] || PackageOpen;
  return <Icon className={className} strokeWidth={1.6} aria-hidden="true" />;
}

export default function TravelShop() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => products.filter((p) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase())), [query, category]);
  const choose = (c) => { setCategory(c); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); };

  return <main className="min-h-screen bg-[#f5f5f5] text-slate-900">
    <section className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="min-w-fit"><div className="text-2xl font-black tracking-tight">Aliwvide <span className="text-orange-500">Shop</span></div><div className="text-xs font-semibold text-slate-500">Travel more. Pack smarter.</div></div>
          <form className="flex flex-1 overflow-hidden rounded-full border-2 border-orange-500 bg-white" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-1 items-center gap-2 px-4"><Search className="h-5 w-5 text-slate-400"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search travel bags, gadgets, organizers..." className="min-w-0 flex-1 py-3 text-sm outline-none" aria-label="Search products"/></div>
            <button className="bg-orange-500 px-6 font-bold text-white hover:bg-orange-600" type="submit">Search</button>
          </form>
          <a href="#products" className="hidden rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white lg:inline-flex">Browse Products</a>
        </div>
      </div>
      <div className="border-t"><div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">{categories.map((c) => <button key={c} onClick={() => choose(c)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${category === c ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{c}</button>)}</div></div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[230px_1fr]">
      <aside className="hidden rounded-2xl bg-white p-5 shadow-sm lg:block"><h2 className="mb-4 font-black">All Categories</h2><div className="space-y-1">{categories.slice(1).map((c) => { const CIcon = categoryIcons[c] || PackageOpen; return <button key={c} onClick={() => choose(c)} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold hover:bg-orange-50 hover:text-orange-600"><span className="flex items-center gap-2"><CIcon className="h-4 w-4"/>{c}</span><span>›</span></button>; })}</div></aside>
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white sm:p-10"><div className="relative z-10 max-w-lg"><span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase">Travel essentials</span><h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">Gear up for your next journey</h1><p className="mt-4 max-w-md text-sm leading-6 text-slate-300 sm:text-base">Curated luggage, gadgets and useful accessories for flights, road trips and holidays.</p><a href="#products" className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600">Shop travel picks →</a></div><Plane className="absolute -bottom-6 -right-8 h-48 w-48 rotate-[-18deg] text-white/10 sm:h-64 sm:w-64" strokeWidth={1.2}/></div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1"><button onClick={() => choose("Luggage")} className="rounded-3xl bg-orange-100 p-5 text-left"><Luggage className="h-10 w-10 text-orange-600"/><div className="mt-4 text-xs font-black uppercase text-orange-600">Travel luggage</div><div className="mt-1 font-black">Pack for every trip</div></button><button onClick={() => choose("Electronics")} className="rounded-3xl bg-sky-100 p-5 text-left"><Plug className="h-10 w-10 text-sky-700"/><div className="mt-4 text-xs font-black uppercase text-sky-700">Travel gadgets</div><div className="mt-1 font-black">Stay powered anywhere</div></button></div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-5 sm:px-6"><div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-4"><div><CheckCircle2 className="h-5 w-5"/><b className="mt-1 block text-sm">Curated travel picks</b><p className="text-xs text-slate-500">Useful products for journeys</p></div><div><Search className="h-5 w-5"/><b className="mt-1 block text-sm">Easy to discover</b><p className="text-xs text-slate-500">Search and browse categories</p></div><div><ExternalLink className="h-5 w-5"/><b className="mt-1 block text-sm">Amazon checkout</b><p className="text-xs text-slate-500">Complete purchase on Amazon</p></div><div><Plane className="h-5 w-5"/><b className="mt-1 block text-sm">Built for travelers</b><p className="text-xs text-slate-500">Flight, road and holiday gear</p></div></div></section>

    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6"><div className="mb-5"><p className="text-xs font-black uppercase tracking-widest text-orange-500">Browse faster</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">Shop by category</h2></div><div className="grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-4">{Object.entries(categoryIcons).map(([c, CIcon]) => <button key={c} onClick={() => choose(c)} className="rounded-2xl bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"><CIcon className="mx-auto h-8 w-8 text-slate-800 sm:h-9 sm:w-9" strokeWidth={1.7}/><div className="mt-2 truncate text-[10px] font-black sm:text-xs">{c}</div></button>)}</div></section>

    <section id="products" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-8 sm:px-6"><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-orange-500">Aliwvide picks</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">{category === "All" ? "Featured travel products" : category}</h2><p className="mt-1 text-sm text-slate-500">{filtered.length} products shown</p></div>{(query || category !== "All") && <button onClick={() => { setQuery(""); setCategory("All"); }} className="self-start text-sm font-bold text-orange-600">Clear filters</button>}</div>
      {filtered.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">{filtered.map((p) => <article key={p.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50 text-slate-800"><span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-[9px] font-black uppercase text-white sm:left-3 sm:top-3">{p.badge}</span><IconTile icon={p.icon}/></div><div className="p-3 sm:p-4"><div className="text-[10px] font-black uppercase tracking-wide text-orange-600">{p.category}</div><h3 className="mt-1 min-h-10 text-sm font-black leading-5 sm:text-base">{p.name}</h3><p className="mt-2 text-xs text-slate-500">Check latest price & availability</p><a href={p.link} target="_blank" rel="nofollow sponsored noopener noreferrer" className="mt-3 flex items-center justify-center gap-1 rounded-full bg-[#ff9900] px-3 py-2.5 text-xs font-black text-slate-950 transition hover:bg-[#ffad33] sm:text-sm">View on Amazon <ExternalLink className="h-3.5 w-3.5"/></a></div></article>)}</div> : <div className="rounded-3xl bg-white p-10 text-center"><Search className="mx-auto h-10 w-10"/><h3 className="mt-3 text-xl font-black">No products found</h3><p className="mt-1 text-sm text-slate-500">Try another search or category.</p></div>}
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6"><div className="grid gap-4 md:grid-cols-3"><div className="rounded-3xl bg-amber-100 p-6"><PackageOpen className="h-10 w-10"/><h3 className="mt-4 text-xl font-black">Pack smarter</h3><p className="mt-1 text-sm text-slate-600">Organizers and packing essentials for less travel clutter.</p></div><div className="rounded-3xl bg-blue-100 p-6"><BatteryCharging className="h-10 w-10"/><h3 className="mt-4 text-xl font-black">Stay connected</h3><p className="mt-1 text-sm text-slate-600">Power and gadget essentials for trips near and far.</p></div><div className="rounded-3xl bg-rose-100 p-6"><Armchair className="h-10 w-10"/><h3 className="mt-4 text-xl font-black">Travel comfortably</h3><p className="mt-1 text-sm text-slate-600">Small comforts that make long journeys easier.</p></div></div><p className="mt-6 text-center text-xs leading-5 text-slate-500">As an Amazon Associate, Aliwvide may earn from qualifying purchases. Prices and availability are shown by Amazon and may change.</p></section>
  </main>;
}
