import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Best Taxi Apps in India (2026)",
  description:
    "Compare Uber, Ola, Rapido and other popular taxi apps used in India by tourists and local travelers.",
  alternates: { canonical: "/india/taxi-apps" },
  keywords: [
    "best taxi apps in India",
    "cab booking apps India",
    "Uber India",
    "Ola Cabs",
    "Rapido India",
    "India travel apps"
  ]
};

const apps = [
  {
    name: "Uber India",
    text: "Uber is one of the most used taxi apps in India and is available in many major cities, including Delhi, Mumbai and Bengaluru."
  },
  {
    name: "Ola Cabs",
    text: "Ola is a popular Indian taxi app for cabs, autos and airport rides in supported cities."
  },
  {
    name: "Rapido",
    text: "Rapido is known for bike taxis, autos and cabs in supported areas, useful for short city travel."
  }
];

export default function IndiaTaxiApps() {
  return (
    <>
      <main className="mx-auto max-w-5xl px-6 py-20">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-emerald-700">Home</Link>
          <span>/</span>
          <Link href="/country/india" className="hover:text-emerald-700">India travel apps</Link>
          <span>/</span>
          <span className="text-gray-950">Taxi apps</span>
        </nav>

        <h1 className="mt-8 text-5xl font-black tracking-[-0.05em] text-gray-950">
          Best Taxi Apps in India
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Discover cab booking and taxi apps used by tourists and local travelers in India. Compare Uber, Ola and Rapido before planning airport rides, city travel or short local trips.
        </p>

        <div className="mt-12 space-y-6">
          {apps.map((app) => (
            <section key={app.name} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-950">{app.name}</h2>
              <p className="mt-3 text-gray-600 leading-8">{app.text}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/country/india" className="rounded-full bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700">
            View all India travel apps
          </Link>
          <Link href="/category" className="rounded-full bg-gray-100 px-6 py-3 font-bold text-gray-950 hover:bg-gray-200">
            Browse by category
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
