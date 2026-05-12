import Link from "next/link";
import Footer from "@/components/Footer";
import BlogSection from "@/components/BlogSection";
import { siteConfig } from "@/lib/site";
import { countryData, getCountryName } from "@/data/countries";
import siteContent from "@/data/site-content.json";
import { getHomepageAppIcon } from "@/data/homepage-app-icons";

export const metadata = {
  title: "Discover Travel Apps Used Around the World | Aliwvide",
  description:
    "Find the best travel, transport, food delivery, grocery delivery, navigation, taxi, train, metro and tourist apps used in countries around the world.",
  keywords: [
    "travel apps by country",
    "Discover Travel Apps Used Around the World",
    "best travel apps worldwide",
    "transport apps by country",
    "taxi apps by country",
    "food delivery apps by country",
    "best grocery app in Delhi India",
    "grocery fast delivery India",
    "instant grocery delivery Delhi",
    "Blinkit delivery app",
    "Zepto grocery delivery",
    "Swiggy Instamart fast delivery",
    "best taxi apps in India",
    "India travel apps",
    "SOS helpline India tourists",
    "emergency apps India",
    "IRCTC Rail Connect",
    "Delhi metro apps"
  ],
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: "Discover Travel Apps Used Around the World | Aliwvide",
    description:
      "Explore trusted travel, transport, navigation, taxi, train, metro, food delivery and tourist apps used worldwide.",
    url: siteConfig.url,
    siteName: "Aliwvide",
    type: "website"
  }
};


const topAppCategoryPriority = [
  "transport",
  "maps",
  "food",
  "train",
  "metro",
  "flights",
  "shopping",
  "hotel",
  "emergency"
];

const appLogoThemes = [
  "bg-black text-white",
  "bg-indigo-100 text-indigo-800",
  "bg-red-100 text-red-700",
  "bg-blue-100 text-blue-700",
  "bg-yellow-200 text-black",
  "bg-purple-100 text-purple-800",
  "bg-orange-100 text-orange-700",
  "bg-emerald-100 text-emerald-700"
];

function getInitials(name = "App") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}


function getFallbackIcon(app) {
  const text = `${app?.name || ""} ${app?.category || ""} ${app?.label || ""}`.toLowerCase();

  if (text.includes("train") || text.includes("rail") || text.includes("irctc")) return "🚆";
  if (text.includes("metro") || text.includes("subway")) return "🚇";
  if (text.includes("map") || text.includes("navigation")) return "🗺️";
  if (text.includes("food") || text.includes("delivery")) return "🍔";
  if (text.includes("grocery") || text.includes("blinkit") || text.includes("zepto") || text.includes("instamart")) return "🛒";
  if (text.includes("flight") || text.includes("air")) return "✈️";
  if (text.includes("hotel") || text.includes("stay") || text.includes("booking")) return "🏨";
  if (text.includes("shopping") || text.includes("shop")) return "🛍️";
  if (text.includes("emergency") || text.includes("sos") || text.includes("police") || text.includes("ambulance")) return "🆘";

  return "📱";
}


function buildTopAppsForCountry(slug, data) {
  const apps = [];

  topAppCategoryPriority.forEach((category) => {
    const categoryApps = data?.[category] || [];
    categoryApps.slice(0, 2).forEach((app) => {
      if (!apps.find((item) => item.name === app.name)) {
        apps.push({
          ...app,
          category,
          label: app.type || category.replace(/-/g, " ")
        });
      }
    });
  });

  return {
    slug,
    name: getCountryName(slug),
    apps: apps.slice(0, 6)
  };
}

const homepageTopCountrySlugs = ["india", "japan", "saudiarabia"];

const topCountrySections = homepageTopCountrySlugs
  .map((slug) => buildTopAppsForCountry(slug, countryData[slug]))
  .filter((country) => country.apps.length > 0);

const listedCountries = Object.keys(countryData).length;
const listedCategories = new Set(
  Object.values(countryData).flatMap((data) => Object.keys(data || {}))
).size;
const listedApps = Object.values(countryData).reduce(
  (total, data) => total + Object.values(data || {}).reduce((sum, apps) => sum + (apps?.length || 0), 0),
  0
);

const stats = [
  [String(listedCountries), "Countries"],
  [String(listedCategories), "App Types"],
  [String(listedApps), "Listed Services"]
];

export const revalidate = 3600;

export default function Home() {
  const faqs = (siteContent.faqs || []).slice(0, 8).map((faq) => ({
    q: faq.question,
    a: faq.answer,
    category: faq.category || "General"
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="overflow-hidden bg-white text-slate-950">
        <section className="relative min-h-[82svh] overflow-hidden bg-[#020817] text-white">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,#020817_0%,#0f172a_48%,#312e81_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(56,189,248,.38),transparent_30%),radial-gradient(circle_at_18%_78%,rgba(168,85,247,.30),transparent_34%)]" />
          <div className="absolute right-[-120px] top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl md:h-[34rem] md:w-[34rem]" />
          <div className="absolute bottom-[-120px] left-[-100px] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl md:h-[30rem] md:w-[30rem]" />

          <div className="relative z-10 mx-auto grid min-h-[82svh] max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.02fr_.98fr]">
            <div className="max-w-3xl">
              <p className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-blue-100 backdrop-blur">
                Travel apps by country
              </p>
              <h1 className="text-5xl font-black leading-[.94] tracking-[-0.06em] sm:text-6xl md:text-8xl">
                Discover <span className="bg-gradient-to-r from-sky-300 to-violet-400 bg-clip-text text-transparent">Travel Apps</span> Used Around the World
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
                Explore trusted travel, transport, navigation, taxi, train, metro, food delivery and grocery apps used by locals and tourists worldwide.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/category" className="rounded-full bg-gradient-to-r from-sky-400 to-violet-500 px-7 py-4 font-black text-white shadow-2xl transition hover:-translate-y-1">
                  Explore Countries
                </Link>
                <Link href="#faq" className="rounded-full border border-white/25 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20">
                  FAQ
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block" aria-hidden="true">
              <div className="absolute -inset-6 rounded-[3rem] bg-white/5 blur-2xl" />
              <img
                src="/hero/aliwvide-travel-apps-hero.svg"
                alt=""
                width="760"
                height="620"
                loading="eager"
                fetchPriority="high"
                className="relative h-auto w-full select-none drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#030712] px-6 py-8 text-white">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-3xl font-black">{value}</p>
                <p className="mt-1 text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-slate-50 to-violet-50 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full bg-white px-4 py-2 font-black shadow-sm">🌍 QUICK PREVIEW</p>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] md:text-5xl">Top Travel Apps by Country</h2>
              <p className="mt-5 leading-8 text-slate-600">
                Preview useful travel, taxi, maps, train, food delivery and grocery apps for India, Japan and Saudi Arabia. Open the category page to explore all countries.
              </p>
            </div>

            <div className="mt-10 flex gap-5 overflow-x-auto pb-5 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-3">
              {topCountrySections.map((country) => (
                <article key={country.slug} className="min-w-[86%] snap-start rounded-[2.2rem] border border-white bg-white/90 p-5 shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl sm:min-w-[68%] md:min-w-0 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[.2em] text-violet-500">Top apps</p>
                      <h3 className="mt-2 text-2xl font-black tracking-[-0.03em]">{country.name}</h3>
                    </div>
                    <Link href={`/country/${country.slug}`} className="shrink-0 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                      Open →
                    </Link>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-[1.8rem] bg-slate-50/70 p-2">
                    <div className="aliwvide-app-marquee flex w-max gap-3">
                      {[...country.apps, ...country.apps].map((app, index) => {
                        const iconSrc = getHomepageAppIcon(app.name);

                        return (
                          <Link
                            href={`/country/${country.slug}`}
                            key={`${country.slug}-${app.name}-${index}`}
                            className="w-[150px] shrink-0 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-md"
                          >
                            <div className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl shadow-sm ring-1 ring-slate-200 ${iconSrc ? "bg-white" : appLogoThemes[index % appLogoThemes.length]}`}>
                              {iconSrc ? (
                                <img
                                  src={iconSrc}
                                  alt={`${app.name} icon`}
                                  width="44"
                                  height="44"
                                  loading="lazy"
                                  className="h-11 w-11 rounded-xl object-contain"
                                />
                              ) : (
                                getFallbackIcon(app)
                              )}
                            </div>
                            <h4 className="mt-3 line-clamp-2 min-h-[40px] text-sm font-black leading-5">{app.name}</h4>
                            <p className="mt-1 line-clamp-1 text-xs capitalize text-slate-500">{app.label}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-400">Auto sliding preview — swipe anytime →</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
            <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white md:p-10">
              <p className="font-black uppercase tracking-[.2em] text-sky-300">Tourist friendly</p>
              <h2 className="mt-4 text-4xl font-black">Why travellers use Aliwvide</h2>
              <p className="mt-5 leading-8 text-slate-300">
                Travellers often struggle to know which local apps work in a new country. Aliwvide groups apps into useful categories like emergency, taxi, train, metro, maps, food, grocery, shopping and hotel booking.
              </p>
            </div>
            <div className="rounded-[2.5rem] bg-slate-100 p-8 md:p-10">
              <p className="font-black uppercase tracking-[.2em] text-violet-500">Trip planning</p>
              <h2 className="mt-4 text-4xl font-black">Plan before you land</h2>
              <p className="mt-5 leading-8 text-slate-600">
                Compare the apps travellers often need before a trip: local rides, maps, train booking, food delivery, shopping and emergency contacts. Open a country guide and save the tools that match your route.
              </p>
            </div>
          </div>
        </section>

        <BlogSection />

        <section id="faq" className="bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="font-black uppercase tracking-[.2em] text-violet-500">FAQ</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-5xl">Frequently Asked Questions</h2>
              <p className="mt-4 leading-8 text-slate-600">
                Quick answers for worldwide travel apps, India travel apps, SOS helplines, food delivery and grocery fast delivery categories.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {faqs.map((item) => (
                <article key={item.q} className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{item.category}</span>
                  <h3 className="mt-3 text-xl font-black">{item.q}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.a}</p>
                  <Link href="/category" className="mt-4 inline-block font-black text-slate-950">
                    View related category →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
