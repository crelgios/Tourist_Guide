import GlobeHero from "@/components/GlobeHero";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Aliwvide - Best Travel Apps by Country",
  description:
    "Find trusted local transport, maps, train, metro, bus, flight, shopping, and food delivery apps for any country.",
  alternates: { canonical: "/" }
};

export default function Home() {
  return (
    <>
      <GlobeHero />
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-5xl font-black tracking-[-0.05em]">What can users discover?</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
            Search a country and discover the main apps tourists need before travelling.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              ["🚖", "Local Transport", "Taxi, cab and local ride apps"],
              ["🚄", "Train & Metro", "Railway and metro tools"],
              ["✈️", "Flights", "Flight comparison and airlines"],
              ["🛍️", "Shopping & Food", "Local trusted platforms"]
            ].map(([icon, title, desc]) => (
              <div key={title} className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-soft">
                <div className="text-4xl">{icon}</div>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-2 text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
