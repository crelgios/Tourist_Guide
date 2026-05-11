import Link from "next/link";
import Footer from "@/components/Footer";
import { categories, getCountryData, getCountryName } from "@/data/countries";
import { siteConfig } from "@/lib/site";

export const dynamicParams = true;

const categoryLabels = {
  transport: "Local Transport",
  train: "Train",
  metro: "Metro",
  bus: "Bus",
  flights: "Flights",
  maps: "Maps",
  navigation: "Navigation",
  shopping: "Shopping",
  food: "Food Delivery",
  hotel: "Hotels",
  emergency: "SOS & Emergency Helplines"
};

function AppCard({ app, emergency = false }) {
  const links = [
    { href: app.web, label: app.web?.startsWith("tel:") ? "Call Now" : "Website" },
    { href: app.android, label: "Android" },
    { href: app.ios, label: "iPhone" }
  ].filter((link) => link.href);

  return (
    <article className={`rounded-3xl p-5 ${emergency ? "bg-red-50" : "bg-gray-50"}`}>
      <h3 className="text-xl font-black">{app.name}</h3>
      {app.type && <p className="mt-1 text-sm font-bold text-gray-400">{app.type}</p>}
      <p className="mt-2 text-gray-600">{app.description}</p>

      {links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map((link) => (
            <a
              key={`${app.name}-${link.label}`}
              href={link.href}
              target={link.href.startsWith("tel:") ? undefined : "_blank"}
              rel={link.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                link.href.startsWith("tel:") ? "bg-red-600 text-white hover:bg-red-700" : "bg-white text-gray-950 ring-1 ring-gray-200 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {(app.badges || []).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {(app.badges || []).map((badge) => (
            <span key={badge} className="rounded-full bg-white px-3 py-1 text-xs font-bold">
              {badge}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export function generateMetadata({ params }) {
  const countryName = getCountryName(params.slug);
  const title = `Best Travel Apps in ${countryName}`;
  const description = `Discover trusted taxi, train, metro, bus, flight, maps, navigation, shopping, food delivery and emergency helpline apps for ${countryName}.`;

  return {
    title,
    description,
    keywords: [
      `best travel apps in ${countryName}`,
      `best taxi app in ${countryName}`,
      `best train app in ${countryName}`,
      `${countryName} transport apps`,
      `${countryName} tourist guide`
    ],
    alternates: { canonical: `/country/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/country/${params.slug}`,
      type: "article"
    }
  };
}

export default function CountryPage({ params }) {
  const countryName = getCountryName(params.slug);
  const data = getCountryData(params.slug);
  const mainCategories = categories.filter(
    (category) => category.key !== "emergency" && (data[category.key] || []).length > 0
  );
  const emergencyCategory = categories.find((category) => category.key === "emergency");
  const emergencyApps = data.emergency || [];

  return (
    <>
      <main className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <Link href="/explore" className="rounded-full bg-gray-100 px-5 py-3 font-bold text-gray-900">
            ← Explore
          </Link>

          <section className="mt-12 rounded-[2.5rem] bg-gradient-to-br from-gray-50 to-indigo-50 p-8 md:p-12">
            <p className="font-bold text-blue-600">Aliwvide country guide</p>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.06em] md:text-7xl">
              Best travel apps in {countryName}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              Find trusted websites and mobile apps for local transport, taxi, maps, trains, metro, buses, flights, shopping and food delivery in {countryName}. Emergency helplines are listed near the bottom for quick reference.
            </p>
          </section>

          <section className="mt-12 grid gap-6 md:grid-cols-2">
            {mainCategories.map((category) => {
              const apps = data[category.key] || [];
              const label = categoryLabels[category.key] || category.key;

              return (
                <div key={category.key} className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-soft">
                  <div className="text-4xl">{category.icon}</div>
                  <h2 className="mt-4 text-2xl font-black">{label}</h2>
                  <div className="mt-5 space-y-4">
                    {apps.map((app) => (
                      <AppCard key={app.name} app={app} />
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          {emergencyCategory && emergencyApps.length > 0 && (
            <section className="mt-12 rounded-[2.5rem] border border-red-100 bg-red-50 p-8 md:p-10">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{emergencyCategory.icon}</div>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">Safety information</p>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-gray-950">
                    SOS & emergency helplines in {countryName}
                  </h2>
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-gray-600">
                Use these only when needed. Always verify local emergency numbers and share your exact location clearly with emergency services.
              </p>
              <div className="mt-6 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
                {emergencyApps.map((app) => (
                  <div key={app.name} className="min-w-[82%] snap-start sm:min-w-[48%] md:min-w-0">
                    <AppCard app={app} emergency />
                  </div>
                ))}
              </div>
              {emergencyApps.length > 1 && <p className="mt-3 text-xs font-bold text-red-400 md:hidden">Swipe left to see more emergency contacts →</p>}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
