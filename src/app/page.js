import GlobeHero from "@/components/GlobeHero";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Best Travel Apps in India for Tourists (2026)",
  description:
    "Discover the best taxi apps, train booking apps, metro apps, food delivery apps and tourist travel apps used in India.",
  keywords: [
    "best taxi apps in India",
    "travel apps India",
    "India transport apps",
    "Uber India",
    "Ola app",
    "Rapido app",
    "IRCTC Rail Connect",
    "Delhi metro apps"
  ],
  alternates: { canonical: "/" }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Which taxi app is best in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Uber, Ola and Rapido are among the most popular taxi and ride booking apps in India."
      }
    },
    {
      "@type": "Question",
      "name": "Which app is used for train booking in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "IRCTC Rail Connect is the official train booking app used in India."
      }
    }
  ]
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GlobeHero />
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-5xl font-black tracking-[-0.05em]">
            Best Travel Apps in India for Tourists
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-600">
            Aliwvide helps tourists and travelers discover trusted taxi apps,
            metro apps, train booking apps, food delivery apps and navigation
            apps used across India. Compare popular services like Uber, Ola,
            Rapido and IRCTC before your trip.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              ["🚖", "Taxi Apps", "Uber, Ola, Rapido and local ride apps"],
              ["🚄", "Train & Metro", "Railway and metro apps used in India"],
              ["✈️", "Flights", "Airlines and flight booking platforms"],
              ["🛍️", "Food & Shopping", "Trusted Indian delivery apps"]
            ].map(([icon, title, desc]) => (
              <div key={title} className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-soft">
                <div className="text-4xl">{icon}</div>
                <h2 className="mt-5 text-xl font-black">{title}</h2>
                <p className="mt-2 text-gray-500">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black">Why tourists use Aliwvide</h2>
              <p className="mt-4 text-gray-600 leading-8">
                Travelers often struggle to find the best local transport and
                travel apps before visiting India. Aliwvide simplifies this by
                showing trusted apps used for taxi booking, train travel, metro
                navigation, airport rides and food delivery.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-black">Popular travel app categories</h2>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li>• Taxi and cab booking apps</li>
                <li>• Metro and train apps</li>
                <li>• Maps and navigation tools</li>
                <li>• Food delivery apps</li>
                <li>• Shopping and payment apps</li>
              </ul>
            </div>
          </div>

          <div className="mt-24">
            <h2 className="text-4xl font-black">Frequently Asked Questions</h2>

            <div className="mt-10 space-y-8">
              <div>
                <h3 className="text-2xl font-bold">
                  Which taxi app is best in India?
                </h3>
                <p className="mt-2 text-gray-600">
                  Uber, Ola and Rapido are among the most used ride booking apps in India.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold">
                  Which app is used for train booking in India?
                </h3>
                <p className="mt-2 text-gray-600">
                  IRCTC Rail Connect is the official train booking app for Indian Railways.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold">
                  Which apps should tourists install before visiting India?
                </h3>
                <p className="mt-2 text-gray-600">
                  Tourists usually install taxi, metro, maps, payment and food delivery apps before travelling in India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
