"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { categories, countries, countryData, getCountryName } from "@/data/countries";

const HIDDEN_CATEGORIES = new Set(["emergency"]);

const CATEGORY_LABELS = {
  transport: "Taxi / Local Transport",
  train: "Train",
  metro: "Metro",
  bus: "Bus",
  flights: "Flights",
  maps: "Maps",
  navigation: "Navigation",
  shopping: "Shopping",
  food: "Food Delivery",
  hotel: "Hotel",
  carRental: "Car Rental"
};

const CATEGORY_KEYWORDS = {
  food: ["food", "delivery", "restaurant", "eat", "meal", "grocery", "zomato", "swiggy", "ubereats", "uber eats", "doordash"],
  transport: ["taxi", "cab", "ride", "local transport", "transport", "uber", "ola", "didi", "lyft", "careem", "rapido"],
  train: ["train", "rail", "railway", "irctc", "jr", "bahn", "oncf"],
  metro: ["metro", "subway", "underground", "mrt"],
  bus: ["bus", "coach", "redbus", "ctm"],
  flights: ["flight", "flights", "airline", "airport", "plane"],
  shopping: ["shopping", "shop", "mall", "store", "market", "grocery"],
  hotel: ["hotel", "stay", "room", "booking", "agoda", "airbnb", "oyo"],
  maps: ["map", "maps", "google maps", "route"],
  navigation: ["navigation", "navigate", "directions", "citymapper", "moovit", "transit"],
  carRental: ["car rental", "rental car", "self drive", "rent car", "zoomcar", "avis"]
};

const COUNTRY_ALIASES = {
  unitedstates: ["usa", "u.s.", "us", "america", "united states", "united states of america"],
  unitedkingdom: ["uk", "u.k.", "britain", "england", "united kingdom"],
  unitedarabemirates: ["uae", "dubai", "abu dhabi", "united arab emirates"],
  saudiarabia: ["saudi", "ksa", "saudi arabia"],
  japan: ["japan", "tokyo", "osaka", "kyoto"],
  india: ["india", "delhi", "mumbai", "jaipur", "rajasthan", "gujarat", "bangalore", "bengaluru"],
  germany: ["germany", "deutschland", "berlin", "munich", "hamburg"],
  morocco: ["morocco", "casablanca", "marrakech", "rabat"],
  australia: ["australia", "sydney", "melbourne", "brisbane", "perth"],
  china: ["china", "beijing", "shanghai", "guangzhou", "shenzhen"]
};

const SHOP_PRODUCTS = [
  "Cabin Trolley Bag", "Travel Backpack 45L", "Packing Cubes Set", "Universal Travel Adapter",
  "Digital Luggage Scale", "Memory Foam Neck Pillow", "RFID Passport Wallet", "Hanging Toiletry Bag",
  "20,000mAh Power Bank", "Foldable Travel Bottle", "Cable Organizer Pouch", "Luggage Strap",
  "Luggage Tags", "Travel Shoe Bags", "Compression Socks", "Sleep Mask", "Travel Umbrella",
  "Foldable Daypack", "Waterproof Phone Pouch", "Travel First Aid Pouch", "TSA Combination Lock",
  "Travel Laundry Bag", "Phone Tripod", "Car Phone Holder", "Travel Sling Bag", "Foldable Duffel Bag",
  "Travel Towel", "Portable Mini Fan", "Backpack Rain Cover", "Travel Document Organizer"
];

const TOOL_ITEMS = [
  { name: "Tasbih Counter", href: "https://tasbii.vercel.app/", keywords: ["tasbih", "tasbeeh", "counter", "zikr"] },
  { name: "Daily Dhikr", href: "https://tasbii.vercel.app/daily-dhikr", keywords: ["dhikr", "zikr", "daily dhikr", "remembrance"] },
  { name: "Dua Counter", href: "https://tasbii.vercel.app/dua-counter", keywords: ["dua", "dua counter", "prayer"] }
];

const SITE_LINKS = [
  { name: "Explore countries", href: "/explore", keywords: ["explore", "country", "countries", "apps by country"] },
  { name: "Categories", href: "/category", keywords: ["category", "categories", "app categories"] },
  { name: "Travel Tools", href: "/tools", keywords: ["tools", "tasbih", "dhikr", "dua"] },
  { name: "Shop", href: "/shop", keywords: ["shop", "product", "products", "travel gear", "travel accessories", "buy"] },
  { name: "Blog", href: "/blog", keywords: ["blog", "article", "guide", "travel guide", "post"] },
  { name: "FAQ", href: "/faq", keywords: ["faq", "question", "help"] },
  { name: "Contact", href: "/contact", keywords: ["contact", "email", "support"] }
];

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9\s.]/g, " ").replace(/\s+/g, " ").trim();
}

function includesPhrase(text, phrase) {
  return (` ${text} `).includes(` ${normalizeText(phrase)} `);
}

function categoryLabel(key) {
  return CATEGORY_LABELS[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function detectCountrySlugs(question) {
  const text = normalizeText(question);
  return [...new Set(countries.map((country) => {
    const aliases = [country.name, country.slug, ...(COUNTRY_ALIASES[country.slug] || [])].map(normalizeText);
    const best = aliases.filter((alias) => alias && includesPhrase(text, alias)).sort((a, b) => b.length - a.length)[0];
    return best ? { slug: country.slug, score: best.length } : null;
  }).filter(Boolean).sort((a, b) => b.score - a.score).map((item) => item.slug))].slice(0, 2);
}

function detectCategoryKeys(question) {
  const text = normalizeText(question);
  return [...new Set(Object.entries(CATEGORY_KEYWORDS).map(([key, words]) => {
    if (HIDDEN_CATEGORIES.has(key)) return null;
    const score = words.reduce((total, word) => total + (includesPhrase(text, word) ? 1 : 0), 0);
    return score ? { key, score } : null;
  }).filter(Boolean).sort((a, b) => b.score - a.score).map((item) => item.key))].slice(0, 2);
}

function appLink(app) {
  return app?.web || app?.android || app?.ios || "";
}

function buildCountryAnswer(question) {
  const countrySlugs = detectCountrySlugs(question);
  if (!countrySlugs.length) return null;
  const categoryKeys = detectCategoryKeys(question);

  const answers = countrySlugs.map((countrySlug) => {
    const data = countryData[countrySlug] || {};
    const available = Object.keys(data).filter((key) => !HIDDEN_CATEGORIES.has(key));
    const keys = categoryKeys.length
      ? categoryKeys.filter((key) => available.includes(key))
      : available.filter((key) => ["transport", "food", "train", "bus", "metro", "flights", "shopping", "hotel", "maps", "navigation", "carRental"].includes(key)).slice(0, 5);

    const seen = new Set();
    const apps = [];
    keys.forEach((categoryKey) => {
      const rows = Array.isArray(data[categoryKey]) ? data[categoryKey] : [];
      rows.slice(0, categoryKeys.length ? 6 : 3).forEach((app) => {
        const id = normalizeText(app?.name);
        if (!id || seen.has(id)) return;
        seen.add(id);
        apps.push({
          name: app?.name || "Travel app",
          category: categoryLabel(categoryKey),
          description: app?.description || app?.type || "Useful travel app for this country.",
          badges: Array.isArray(app?.badges) ? app.badges.slice(0, 3) : [],
          link: appLink(app)
        });
      });
    });

    return { countryName: getCountryName(countrySlug), categoryNames: keys.map(categoryLabel), apps: apps.slice(0, 8) };
  });

  return { type: "bot", title: "Aliwvide app suggestions", answers, note: "App availability can vary by city. Check the app before booking or ordering." };
}

function buildShopAnswer(question) {
  const text = normalizeText(question);
  const shopIntent = ["shop", "product", "products", "buy", "travel gear", "travel accessories", "luggage", "backpack", "adapter", "power bank", "pillow", "umbrella", "passport", "organizer"].some((word) => text.includes(normalizeText(word)));
  if (!shopIntent) return null;

  const words = text.split(" ").filter((word) => word.length > 2);
  let matches = SHOP_PRODUCTS.map((name) => ({ name, score: words.reduce((score, word) => score + (normalizeText(name).includes(word) ? 1 : 0), 0) }))
    .filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
  if (!matches.length) matches = SHOP_PRODUCTS.slice(0, 5).map((name) => ({ name }));

  return {
    type: "bot",
    title: "Aliwvide Shop",
    text: "I can help you find travel products available in the Aliwvide Shop. Purchases are completed on the external retailer site.",
    links: [{ label: "Open Aliwvide Shop", href: "/shop" }],
    items: matches.map((item) => item.name)
  };
}

function buildToolsAnswer(question) {
  const text = normalizeText(question);
  const matches = TOOL_ITEMS.filter((tool) => tool.keywords.some((keyword) => text.includes(normalizeText(keyword))));
  if (!matches.length && !text.includes("tool")) return null;
  const tools = matches.length ? matches : TOOL_ITEMS;
  return {
    type: "bot",
    title: "Aliwvide Travel Tools",
    text: "You can use these free browser-based tools directly from Aliwvide:",
    links: tools.map((tool) => ({ label: tool.name, href: tool.href, external: true })).concat([{ label: "Open all Travel Tools", href: "/tools" }])
  };
}

function buildSiteAnswer(question) {
  const text = normalizeText(question);

  if (["hi", "hello", "hey", "hii", "good morning", "good evening"].some((word) => text === word || text.startsWith(`${word} `))) {
    return {
      type: "bot",
      title: "Hi! I’m the Aliwvide Guide 👋",
      text: "I can help you across Aliwvide — country travel apps, the Shop, Travel Tools, blogs, categories, FAQs and site navigation.",
      links: [{ label: "Explore", href: "/explore" }, { label: "Shop", href: "/shop" }, { label: "Travel Tools", href: "/tools" }]
    };
  }

  if (["what can you do", "help", "how can you help", "what do you do"].some((phrase) => text.includes(phrase))) {
    return {
      type: "bot",
      title: "How I can help",
      text: "Ask for travel apps by country, products in the Shop, Tasbih/Dhikr/Dua tools, blog or FAQ pages, or where to find something on Aliwvide.",
      links: [{ label: "Explore countries", href: "/explore" }, { label: "Shop", href: "/shop" }, { label: "Travel Tools", href: "/tools" }, { label: "Blog", href: "/blog" }]
    };
  }

  const tools = buildToolsAnswer(question);
  if (tools) return tools;
  const shop = buildShopAnswer(question);
  if (shop) return shop;
  const country = buildCountryAnswer(question);
  if (country) return country;

  const links = SITE_LINKS.filter((link) => link.keywords.some((keyword) => text.includes(normalizeText(keyword)))).slice(0, 4);
  if (links.length) {
    return { type: "bot", title: "I found this on Aliwvide", text: "These sections should help:", links: links.map((link) => ({ label: link.name, href: link.href })) };
  }

  if (["sos", "emergency", "police", "ambulance"].some((word) => includesPhrase(text, word))) {
    return { type: "bot", title: "Emergency information", text: "Aliwvide does not currently provide emergency-number guidance through this assistant. For an urgent situation, use official local emergency services." };
  }

  return {
    type: "bot",
    title: "I can help with Aliwvide",
    text: "I couldn’t match that to Aliwvide content yet. Try asking about a country and app type, the Shop, Travel Tools, blogs, categories or FAQs.",
    links: [{ label: "Explore countries", href: "/explore" }, { label: "Shop", href: "/shop" }, { label: "Travel Tools", href: "/tools" }]
  };
}

function pageStarterQuestions(pathname) {
  if (pathname.startsWith("/shop")) return ["Show me travel luggage", "Do you have travel adapters?", "What can I buy here?"];
  if (pathname.startsWith("/tools")) return ["Open Tasbih Counter", "Show Daily Dhikr", "Where is the Dua Counter?"];
  if (pathname.startsWith("/blog")) return ["Where are travel guides?", "Show me the shop", "Best food apps in India"];
  return ["Best food apps in India", "Taxi apps in Japan", "Help me with the shop", "Show travel tools"];
}

export default function FreeAiAssistant() {
  const pathname = usePathname() || "/";
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ type: "bot", title: "Hi, I’m the Aliwvide Guide.", text: "I can help with travel apps, Shop products, Travel Tools and finding anything across Aliwvide." }]);
  const inputRef = useRef(null);
  const starterQuestions = useMemo(() => pageStarterQuestions(pathname), [pathname]);
  const categoryCount = useMemo(() => categories.filter((category) => !HIDDEN_CATEGORIES.has(category.key)).length, []);

  function sendMessage(textFromChip) {
    const text = (textFromChip || input).trim();
    if (!text) return;
    setMessages((current) => [...current, { type: "user", text }, buildSiteAnswer(text)]);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-950/20">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 p-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/brand/chatbot-avatar.png" alt="Aliwvide Guide" className="h-12 w-12 rounded-full border-2 border-white/80 bg-white object-cover shadow-lg" />
                <div><h2 className="text-lg font-bold">Ask Aliwvide</h2><p className="mt-1 text-sm text-emerald-50">Your guide across the whole Aliwvide website.</p></div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white hover:bg-white/20" aria-label="Close assistant">×</button>
            </div>
          </div>

          <div className="max-h-[26rem] space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={`${message.type}-${index}`} className={message.type === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={message.type === "user" ? "max-w-[85%] rounded-2xl rounded-br-md bg-emerald-600 px-4 py-3 text-sm text-white shadow-sm" : "max-w-[92%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"}>
                  {message.title && <p className="mb-1 font-bold text-slate-950">{message.title}</p>}
                  {message.text && <p className="leading-relaxed">{message.text}</p>}

                  {message.items?.length > 0 && <ul className="mt-3 space-y-1 text-xs text-slate-700">{message.items.map((item) => <li key={item} className="rounded-xl bg-slate-50 px-3 py-2">• {item}</li>)}</ul>}

                  {message.answers?.map((answer, answerIndex) => (
                    <div key={`${answer.countryName}-${answerIndex}`} className="mt-3">
                      <p className="font-bold text-slate-950">{answer.countryName}</p>
                      {answer.categoryNames?.length > 0 && <p className="mt-1 text-xs text-slate-500">Categories: {answer.categoryNames.join(", ")}</p>}
                      <div className="mt-2 space-y-2">{answer.apps.map((app, appIndex) => (
                        <div key={`${app.name}-${appIndex}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                          <div className="flex items-start justify-between gap-2"><div><p className="font-semibold text-slate-950">{appIndex + 1}. {app.name}</p><p className="text-xs font-medium text-emerald-700">{app.category}</p></div>{app.link && <a href={app.link} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-50">Open</a>}</div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">{app.description}</p>
                          {app.badges?.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{app.badges.map((badge) => <span key={badge} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">{badge}</span>)}</div>}
                        </div>
                      ))}</div>
                    </div>
                  ))}

                  {message.links?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{message.links.map((link) => link.external ? <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100">{link.label} ↗</a> : <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100">{link.label} →</Link>)}</div>}
                  {message.note && <p className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">{message.note}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">{starterQuestions.map((question) => <button type="button" key={question} onClick={() => sendMessage(question)} className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">{question}</button>)}</div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
              <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Ask about apps, shop, tools..." className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-800 outline-none placeholder:text-slate-400" />
              <button type="button" onClick={() => sendMessage()} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700">Send</button>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400">Aliwvide site guide • {categoryCount} public travel-app categories</p>
          </div>
        </div>
      )}

      <button type="button" onClick={() => setIsOpen((current) => !current)} className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-emerald-950/30 ring-1 ring-white/30 transition hover:-translate-y-0.5 hover:bg-emerald-700" aria-label="Open Aliwvide assistant">
        <img src="/brand/chatbot-avatar.png" alt="Aliwvide Guide" className="h-8 w-8 rounded-full border border-white/70 bg-white object-cover" />
        <span>Ask Aliwvide</span>
      </button>
    </div>
  );
}
