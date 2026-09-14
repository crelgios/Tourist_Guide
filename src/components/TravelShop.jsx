"use client";

import { useMemo, useState } from "react";
import { Backpack, BatteryCharging, CheckCircle2, ExternalLink, IdCard, Luggage, PackageOpen, Plane, Plug, Search, Umbrella, LockKeyhole, Armchair } from "lucide-react";

const affiliateLink = "https://www.amazon.in/dp/B0CXM9Q1SW?tag=aliwvidetrave-21";

const photos = {
  suitcase: "https://m.media-amazon.com/images/I/41sq5qID%2B4L.jpg",
  backpack: "https://www.inateck.de/cdn/shop/files/rucksacke-46l-20-46l-reiserucksack-erweiterbarer-tragerucksack-spritzwassergeschutztes-handgepack-bp03006-bp03006_black-40651106058506_720x.jpg?v=1734949625",
  packing: "https://www.matadorequipment.com/cdn/shop/files/1_Packingcube_leadimage_test.jpg?v=1707844899&width=2400",
  accessories: "https://shopbentley.com/cdn/shop/articles/Travel-Accesories-post.jpg?v=1761910584&width=1100",
  tech: "https://cdn.mgig.fr/2022/03/mg-26844308-w2000.jpg",
  documents: "https://www.irvsluggage.com/cdn/shop/files/RFIDsafe_CompactTravelOrganizer_11020130_JetBlack_8.jpg?crop=center&height=4100&v=1737400938&width=4100",
  travelcase: "https://markrydenus.com/cdn/shop/files/MR262G_5.webp?v=1753757742&width=1946",
  scale: "https://media.s-bol.com/g4jo3mBxABYl/RgMnzRE/550x551.jpg",
  umbrella: "https://nexso.ae/cdn/shop/files/61gWdg2C5hL._AC_SX569.jpg?v=1760108169&width=569",
  pillow: "https://www.staples.ca/cdn/shop/files/e9b557b213345cf6b96cdb1bd750c14c95c8eb30_square3107145_1_1000x.jpg?v=1762996698",
  bottle: "https://cdn11.bigcommerce.com/s-4bpjsyet2q/images/stencil/1280x1280/products/2771/1370256/V-01549-H-999492__33098.1763473245.jpg?c=1",
  fan: "https://highcaliberline.com/cdn/shop/files/T802-00-front-blank-800px.jpg?v=1738358318&width=990",
  tripod: "https://img.fruugo.com/product/0/21/1778317210_max.jpg",
  sling: "https://www.luggageonline.com/cdn/shop/files/f8518d4a0dbd632760609e916221cbc7b917d2c249b31da9de7f937109f275d7.jpg?v=1770305643",
  duffel: "https://www.cqxsyp.com/UpLoadFiles/SwfUpFile/150/20250729154551766585.jpg"
};

const products = [
  ["Cabin Trolley Bag", "Luggage", photos.suitcase, "Best Seller"],
  ["Travel Backpack 45L", "Bags", photos.backpack, "Popular"],
  ["Packing Cubes Set", "Organizers", photos.packing, "Travel Pick"],
  ["Universal Travel Adapter", "Electronics", photos.tech, "Must Have"],
  ["Digital Luggage Scale", "Flight Essentials", photos.scale, "Popular"],
  ["Memory Foam Neck Pillow", "Comfort", photos.pillow, "Best Seller"],
  ["RFID Passport Wallet", "Documents", photos.documents, "Travel Pick"],
  ["Hanging Toiletry Bag", "Organizers", photos.travelcase, "Popular"],
  ["20,000mAh Power Bank", "Electronics", photos.tech, "Best Seller"],
  ["Foldable Travel Bottle", "Outdoor", photos.bottle, "Travel Pick"],
  ["Cable Organizer Pouch", "Electronics", photos.tech, "Popular"],
  ["Luggage Strap", "Luggage", photos.accessories, "Travel Pick"],
  ["Luggage Tags", "Luggage", photos.accessories, "Popular"],
  ["Travel Shoe Bags", "Organizers", photos.packing, "Travel Pick"],
  ["Compression Socks", "Comfort", photos.accessories, "Popular"],
  ["Sleep Mask", "Comfort", photos.accessories, "Best Seller"],
  ["Travel Umbrella", "Outdoor", photos.umbrella, "Travel Pick"],
  ["Foldable Daypack", "Bags", photos.backpack, "Popular"],
  ["Waterproof Phone Pouch", "Outdoor", photos.travelcase, "Best Seller"],
  ["Travel First Aid Pouch", "Safety", photos.travelcase, "Travel Pick"],
  ["TSA Combination Lock", "Safety", photos.accessories, "Popular"],
  ["Travel Laundry Bag", "Organizers", photos.packing, "Travel Pick"],
  ["Phone Tripod", "Electronics", photos.tripod, "Best Seller"],
  ["Car Phone Holder", "Road Trips", photos.tech, "Popular"],
  ["Travel Sling Bag", "Bags", photos.sling, "Best Seller"],
  ["Foldable Duffel Bag", "Bags", photos.duffel, "Travel Pick"],
  ["Travel Towel", "Outdoor", photos.accessories, "Popular"],
  ["Portable Mini Fan", "Comfort", photos.fan, "Travel Pick"],
  ["Backpack Rain Cover", "Outdoor", photos.backpack, "Popular"],
  ["Travel Document Organizer", "Documents", photos.documents, "Best Seller"]
].map(([name, category, image, badge], i) => ({ id: i + 1, name, category, image, badge, link: affiliateLink }));

const categories = ["All", "Luggage", "Bags", "Electronics", "Organizers", "Comfort", "Outdoor", "Documents", "Safety"];
const categoryIcons = { Luggage, Bags: Backpack, Electronics: Plug, Organizers: PackageOpen, Comfort: Armchair, Outdoor: Umbrella, Documents: IdCard, Safety: LockKeyhole };

export default function TravelShop() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => products.filter((p) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase())), [query, category]);
  const choose = (c) => { setCategory(c); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); };

  return <main className="min-h-screen bg-[#f5f5f5] text-slate-900">
    <section className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-center"><div className="min-w-fit"><div className="text-2xl font-black tracking-tight">Aliwvide <span className="text-orange-500">Shop</span></div><div className="text-xs font-semibold text-slate-500">Travel more. Pack smarter.</div></div><form className="flex flex-1 overflow-hidden rounded-full border-2 border-orange-500 bg-white" onSubmit={(e) => e.preventDefault()}><div className="flex flex-1 items-center gap-2 px-4"><Search className="h-5 w-5 text-slate-400"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search travel bags, gadgets, organizers..." className="min-w-0 flex-1 py-3 text-sm outline-none" aria-label="Search products"/></div><button className="bg-orange-500 px-6 font-bold text-white hover:bg-orange-600" type="submit">Search</button></form><a href="#products" className="hidden rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white lg:inline-flex">Browse Products</a></div></div>
      <div className="border-t"><div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">{categories.map((c) => <button key={c} onClick={() => choose(c)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${category === c ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{c}</button>)}</div></div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[230px_1fr]">
      <aside className="hidden rounded-2xl bg-white p-5 shadow-sm lg:block"><h2 className="mb-4 font-black">All Categories</h2><div className="space-y-1">{categories.slice(1).map((c) => { const CIcon = categoryIcons[c] || PackageOpen; return <button key={c} onClick={() => choose(c)} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold hover:bg-orange-50 hover:text-orange-600"><span className="flex items-center gap-2"><CIcon className="h-4 w-4"/>{c}</span><span>›</span></button>; })}</div></aside>
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]"><div className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white sm:p-10"><div className="relative z-10 max-w-lg"><span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase">Travel essentials</span><h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">Gear up for your next journey</h1><p className="mt-4 max-w-md text-sm leading-6 text-slate-300 sm:text-base">Curated luggage, gadgets and useful accessories for flights, road trips and holidays.</p><a href="#products" className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600">Shop travel picks →</a></div><Plane className="absolute -bottom-6 -right-8 h-48 w-48 rotate-[-18deg] text-white/10 sm:h-64 sm:w-64" strokeWidth={1.2}/></div><div className="grid grid-cols-2 gap-4 lg:grid-cols-1"><button onClick={() => choose("Luggage")} className="overflow-hidden rounded-3xl bg-orange-100 text-left"><img src={photos.suitcase} alt="Cabin travel luggage" className="h-28 w-full object-contain bg-white"/><div className="p-4"><div className="text-xs font-black uppercase text-orange-600">Travel luggage</div><div className="mt-1 font-black">Pack for every trip</div></div></button><button onClick={() => choose("Electronics")} className="overflow-hidden rounded-3xl bg-sky-100 text-left"><img src={photos.tech} alt="Travel electronics and gadgets" className="h-28 w-full object-cover"/><div className="p-4"><div className="text-xs font-black uppercase text-sky-700">Travel gadgets</div><div className="mt-1 font-black">Stay powered anywhere</div></div></button></div></div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-5 sm:px-6"><div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-4"><div><CheckCircle2 className="h-5 w-5"/><b className="mt-1 block text-sm">Curated travel picks</b><p className="text-xs text-slate-500">Useful products for journeys</p></div><div><Search className="h-5 w-5"/><b className="mt-1 block text-sm">Easy to discover</b><p className="text-xs text-slate-500">Search and browse categories</p></div><div><ExternalLink className="h-5 w-5"/><b className="mt-1 block text-sm">Amazon checkout</b><p className="text-xs text-slate-500">Complete purchase on Amazon</p></div><div><Plane className="h-5 w-5"/><b className="mt-1 block text-sm">Built for travelers</b><p className="text-xs text-slate-500">Flight, road and holiday gear</p></div></div></section>

    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6"><div className="mb-5"><p className="text-xs font-black uppercase tracking-widest text-orange-500">Browse faster</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">Shop by category</h2></div><div className="grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-4">{Object.entries(categoryIcons).map(([c, CIcon]) => <button key={c} onClick={() => choose(c)} className="rounded-2xl bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"><CIcon className="mx-auto h-8 w-8 text-slate-800 sm:h-9 sm:w-9" strokeWidth={1.7}/><div className="mt-2 truncate text-[10px] font-black sm:text-xs">{c}</div></button>)}</div></section>

    <section id="products" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-8 sm:px-6"><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-orange-500">Aliwvide picks</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">{category === "All" ? "Featured travel products" : category}</h2><p className="mt-1 text-sm text-slate-500">{filtered.length} products shown</p></div>{(query || category !== "All") && <button onClick={() => { setQuery(""); setCategory("All"); }} className="self-start text-sm font-bold text-orange-600">Clear filters</button>}</div>
      {filtered.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">{filtered.map((p) => <article key={p.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-square overflow-hidden bg-white"><span className="absolute left-2 top-2 z-10 rounded-full bg-orange-500 px-2 py-1 text-[9px] font-black uppercase text-white sm:left-3 sm:top-3">{p.badge}</span><img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"/></div><div className="p-3 sm:p-4"><div className="text-[10px] font-black uppercase tracking-wide text-orange-600">{p.category}</div><h3 className="mt-1 min-h-10 text-sm font-black leading-5 sm:text-base">{p.name}</h3><p className="mt-2 text-xs text-slate-500">Check latest price & availability</p><a href={p.link} target="_blank" rel="nofollow sponsored noopener noreferrer" className="mt-3 flex items-center justify-center gap-1 rounded-full bg-[#ff9900] px-3 py-2.5 text-xs font-black text-slate-950 transition hover:bg-[#ffad33] sm:text-sm">View on Amazon <ExternalLink className="h-3.5 w-3.5"/></a></div></article>)}</div> : <div className="rounded-3xl bg-white p-10 text-center"><Search className="mx-auto h-10 w-10"/><h3 className="mt-3 text-xl font-black">No products found</h3><p className="mt-1 text-sm text-slate-500">Try another search or category.</p></div>}
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6"><div className="grid gap-4 md:grid-cols-3"><div className="rounded-3xl bg-amber-100 p-6"><PackageOpen className="h-10 w-10"/><h3 className="mt-4 text-xl font-black">Pack smarter</h3><p className="mt-1 text-sm text-slate-600">Organizers and packing essentials for less travel clutter.</p></div><div className="rounded-3xl bg-blue-100 p-6"><BatteryCharging className="h-10 w-10"/><h3 className="mt-4 text-xl font-black">Stay connected</h3><p className="mt-1 text-sm text-slate-600">Power and gadget essentials for trips near and far.</p></div><div className="rounded-3xl bg-rose-100 p-6"><Armchair className="h-10 w-10"/><h3 className="mt-4 text-xl font-black">Travel comfortably</h3><p className="mt-1 text-sm text-slate-600">Small comforts that make long journeys easier.</p></div></div><p className="mt-6 text-center text-xs leading-5 text-slate-500">As an Amazon Associate, Aliwvide may earn from qualifying purchases. Prices and availability are shown by Amazon and may change.</p></section>
  </main>;
}
