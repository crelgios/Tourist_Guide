"use client";

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
  food: ["food", "delivery", "restaurant", "eat", "meal", "grocery", "groceries", "snack", "zomato", "swiggy", "ubereats", "uber eats", "doordash", "grubhub"],
  transport: ["taxi", "cab", "ride", "local transport", "transport", "uber", "ola", "didi", "lyft", "careem", "go taxi", "rapido", "heetch"],
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

const starterQuestions = [
  "Best food apps in India",
  "Taxi apps in Japan",
  "Food delivery apps in USA",
  "Train apps in Germany"
];

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function categoryLabel(categoryKey) {
  return CATEGORY_LABELS[categoryKey] || categoryKey.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function getCountryAliases(country) {
  const name = normalizeText(country.name);
  const slug = normalizeText(country.slug);
  return [name, slug, ...(COUNTRY_ALIASES[country.slug] || [])].map(normalizeText);
}

function detectCountrySlugs(question) {
  const text = normalizeText(question);
  const matches = countries
    .map((country) => {
      const aliases = getCountryAliases(country);
      const bestAlias = aliases.find((alias) => alias && (` ${text} `).includes(` ${alias} `));
      return bestAlias ? { slug: country.slug, score: bestAlias.length } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((match) => match.slug);

  return [...new Set(matches)].slice(0, 2);
}

function detectCategoryKeys(question) {
  const text = normalizeText(question);
  const matches = Object.entries(CATEGORY_KEYWORDS)
    .map(([key, words]) => {
      if (HIDDEN_CATEGORIES.has(key)) return null;
      const score = words.reduce((total, word) => total + ((` ${text} `).includes(` ${normalizeText(word)} `) ? 1 : 0), 0);
      return score > 0 ? { key, score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.key);

  return [...new Set(matches)].slice(0, 2);
}

function getAppText(app) {
  return normalizeText([
    app?.name,
    app?.type,
    app?.description,
    ...(Array.isArray(app?.badges) ? app.badges : []),
    ...(Array.isArray(app?.docs) ? app.docs : [])
  ].join(" "));
}

function scoreApp(app, question, categoryKey) {
  const text = normalizeText(question);
  const words = text.split(" ").filter((word) => word.length > 2);
  const appText = getAppText(app);
  let score = 0;

  words.forEach((word) => {
    if (appText.includes(word)) score += 1;
  });

  if (CATEGORY_KEYWORDS[categoryKey]?.some((word) => appText.includes(normalizeText(word)))) {
    score += 3;
  }

  if (Array.isArray(app?.badges)) score += Math.min(app.badges.length, 3) * 0.2;
  return score;
}

function appLink(app) {
  return app?.web || app?.android || app?.ios || "";
}

function buildAnswer(question) {
  const cleanQuestion = question.trim();
  const lowerQuestion = normalizeText(cleanQuestion);

  if (!cleanQuestion) {
    return {
      type: "bot",
      text: "Ask me about food apps, taxi apps, train apps, bus apps, flights, shopping apps, or tourist apps by country."
    };
  }

  if (["sos", "emergency", "police", "ambulance"].some((word) => (` ${lowerQuestion} `).includes(` ${word} `))) {
    return {
      type: "bot",
      text: "SOS and emergency numbers are currently hidden on Aliwvide. I can help with taxi, food delivery, train, bus, flight, shopping, hotel, maps, and tourist app suggestions."
    };
  }

  const countrySlugs = detectCountrySlugs(cleanQuestion);
  const categoryKeys = detectCategoryKeys(cleanQuestion);

  if (countrySlugs.length === 0) {
    return {
      type: "bot",
      title: "Which country should I check?",
      text: "Please include a country name, for example: “best food apps in USA”, “taxi apps in Japan”, or “train apps in Germany”."
    };
  }

  const answers = countrySlugs.map((countrySlug) => {
    const data = countryData[countrySlug] || {};
    const availableCategoryKeys = Object.keys(data).filter((key) => !HIDDEN_CATEGORIES.has(key));
    const keysToUse = categoryKeys.length
      ? categoryKeys.filter((key) => availableCategoryKeys.includes(key))
      : availableCategoryKeys.filter((key) => ["transport", "food", "train", "bus", "metro", "flights", "shopping", "hotel", "maps", "navigation", "carRental"].includes(key)).slice(0, 4);

    let appRows = [];

    keysToUse.forEach((categoryKey) => {
      const apps = Array.isArray(data[categoryKey]) ? data[categoryKey] : [];
      const sortedApps = apps
        .map((app) => ({
          app,
          categoryKey,
          score: scoreApp(app, cleanQuestion, categoryKey)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, categoryKeys.length ? 6 : 3);

      appRows.push(...sortedApps);
    });

    if (appRows.length === 0) {
      const fallbackRows = availableCategoryKeys.flatMap((categoryKey) => {
        const apps = Array.isArray(data[categoryKey]) ? data[categoryKey] : [];
        return apps.slice(0, 2).map((app) => ({ app, categoryKey, score: 0 }));
      });
      appRows = fallbackRows.slice(0, 6);
    }

    const uniqueApps = [];
    const seen = new Set();
    appRows.forEach((row) => {
      const key = normalizeText(row.app?.name || "");
      if (key && !seen.has(key)) {
        seen.add(key);
        uniqueApps.push(row);
      }
    });

    return {
      countryName: getCountryName(countrySlug),
      categoryNames: keysToUse.map(categoryLabel),
      apps: uniqueApps.slice(0, 8).map(({ app, categoryKey }) => ({
        name: app?.name || "Travel app",
        category: categoryLabel(categoryKey),
        description: app?.description || app?.type || "Useful travel app for this country.",
        badges: Array.isArray(app?.badges) ? app.badges.slice(0, 3) : [],
        link: appLink(app)
      }))
    };
  });

  return {
    type: "bot",
    title: "Aliwvide suggestions",
    answers,
    note: "App availability can change by city. Please check inside the app before booking or ordering."
  };
}

export default function FreeAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      title: "Hi, I am Aliwvide Assistant.",
      text: "I can suggest travel, taxi, train, food delivery, shopping, hotel, map, and public transport apps by country. I work without any paid AI API."
    }
  ]);
  const inputRef = useRef(null);

  const categoryCount = useMemo(() => categories.filter((category) => !HIDDEN_CATEGORIES.has(category.key)).length, []);

  function sendMessage(textFromChip) {
    const text = (textFromChip || input).trim();
    if (!text) return;

    const userMessage = { type: "user", text };
    const botMessage = buildAnswer(text);
    setMessages((current) => [...current, userMessage, botMessage]);
    setInput("");

    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-950/20">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 p-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Free website assistant</p>
                <h2 className="mt-1 text-lg font-bold">Ask Aliwvide</h2>
                <p className="mt-1 text-sm text-emerald-50">No paid API. Uses your website app data.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white hover:bg-white/20"
                aria-label="Close assistant"
              >
                ×
              </button>
            </div>
          </div>

          <div className="max-h-[24rem] space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={`${message.type}-${index}`} className={message.type === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    message.type === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-emerald-600 px-4 py-3 text-sm text-white shadow-sm"
                      : "max-w-[92%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
                  }
                >
                  {message.title && <p className="mb-1 font-bold text-slate-950">{message.title}</p>}
                  {message.text && <p className="leading-relaxed">{message.text}</p>}

                  {message.answers?.map((answer, answerIndex) => (
                    <div key={`${answer.countryName}-${answerIndex}`} className="mt-3">
                      <p className="font-bold text-slate-950">{answer.countryName}</p>
                      {answer.categoryNames?.length > 0 && (
                        <p className="mt-1 text-xs text-slate-500">Categories: {answer.categoryNames.join(", ")}</p>
                      )}
                      <div className="mt-2 space-y-2">
                        {answer.apps.map((app, appIndex) => (
                          <div key={`${app.name}-${appIndex}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-slate-950">{appIndex + 1}. {app.name}</p>
                                <p className="text-xs font-medium text-emerald-700">{app.category}</p>
                              </div>
                              {app.link && (
                                <a
                                  href={app.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-50"
                                >
                                  Open
                                </a>
                              )}
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600">{app.description}</p>
                            {app.badges?.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {app.badges.map((badge) => (
                                  <span key={badge} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {message.note && <p className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">{message.note}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {starterQuestions.map((question) => (
                <button
                  type="button"
                  key={question}
                  onClick={() => sendMessage(question)}
                  className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                placeholder="Ask: food apps in USA..."
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400">Free smart search • {categoryCount} public categories • No API key</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-emerald-950/30 ring-1 ring-white/30 transition hover:-translate-y-0.5 hover:bg-emerald-700"
        aria-label="Open Aliwvide assistant"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15">AI</span>
        <span>Ask Aliwvide</span>
      </button>
    </div>
  );
}
