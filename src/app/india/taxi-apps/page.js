export const metadata = {
  title: "Best Taxi Apps in India (2026)",
  description: "Compare Uber, Ola, Rapido and other popular taxi apps used in India.",
};

export default function IndiaTaxiApps() {
  return (
    <main className="px-6 py-20 max-w-5xl mx-auto">
      <h1 className="text-5xl font-black">Best Taxi Apps in India</h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Discover the best cab booking and taxi apps used by tourists and local travelers in India.
      </p>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="text-3xl font-bold">Uber India</h2>
          <p className="mt-3 text-gray-600 leading-8">
            Uber is one of the most used taxi apps in India and is available in major cities including Delhi, Mumbai and Bangalore.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Ola Cabs</h2>
          <p className="mt-3 text-gray-600 leading-8">
            Ola is a popular Indian taxi app that supports autos, cabs and airport rides.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Rapido</h2>
          <p className="mt-3 text-gray-600 leading-8">
            Rapido is known for affordable bike taxi rides and fast local travel.
          </p>
        </section>
      </div>
    </main>
  );
}
