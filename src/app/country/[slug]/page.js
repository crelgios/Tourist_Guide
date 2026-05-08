import Link from "next/link";
import Footer from "@/components/Footer";
import { categories, countries, getCountryData, getCountryName } from "@/data/countries";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return countries.map((country) => ({ slug: country.slug }));
}

export function generateMetadata({ params }) {
  const countryName = getCountryName(params.slug);
  const title = `Best Travel Apps in ${countryName}`;
  const description = `Discover trusted taxi, train, metro, bus, flight, shopping, food delivery, and maps apps for ${countryName}.`;

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
    alternates: {
      canonical: `/country/${params.slug}`
    },
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

  return (
    <>
      <main className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <Link href="/explore" className="rounded-full bg-gray-100 px-5 py-3 font-bold text-gray-900">
            ← Explore
          </Link>

          <section className="mt-12 rounded-[2.5rem] bg-gradient-to-br from-gray-50 to-indigo-50 p-8 md:p-12">
            <p className="font-bold text-blue-600">Country guide</p>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.06em] md:text-7xl">
              Best travel apps in {countryName}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              Find trusted websites and mobile apps for local transport, maps, trains, metro, buses, flights, shopping, and food delivery in {countryName}.
            </p>
          </section>

          <section className="mt-12 grid gap-6 md:grid-cols-2">
            {categories.map((category) => {
              const apps = data[category.key] || [];
              const label = {
                transport: "Local Transport",
                maps: "Maps",
                train: "Train",
                metro: "Metro",
                bus: "Bus",
                flights: "Flights",
                shopping: "Shopping",
                food: "Food Delivery"
              }[category.key];

              return (
                <div key={category.key} className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-soft">
                  <div className="text-4xl">{category.icon}</div>
                  <h2 className="mt-4 text-2xl font-black">{label}</h2>
                  <div className="mt-5 space-y-4">
                    {apps.length === 0 ? (
                      <p className="text-gray-500">Coming soon.</p>
                    ) : (
                      apps.map((app) => (
                        <article key={app.name} className="rounded-3xl bg-gray-50 p-5">
                          <h3 className="text-xl font-black">{app.name}</h3>
                          <p className="mt-2 text-gray-600">{app.description}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {app.badges.map((badge) => (
                              <span key={badge} className="rounded-full bg-white px-3 py-1 text-xs font-bold">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
