import Link from "next/link";
import GlobeHero from "@/components/GlobeHero";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Best Travel Apps in India for Tourists (2026)",
  description:
    "Find taxi, train, metro, bus, flight, maps, food, shopping, payment, hotel, attraction, translation and SOS helpline apps for India travel.",
  keywords: [
    "best taxi apps in India",
    "India travel apps",
    "India transport apps",
    "SOS helpline India tourists",
    "emergency apps India",
    "Uber India",
    "Ola app",
    "Rapido app",
    "IRCTC Rail Connect",
    "Delhi metro apps",
    "food delivery apps India",
    "best grocery app in Delhi India",
    "grocery fast delivery India",
    "instant grocery delivery Delhi",
    "Blinkit delivery app",
    "Zepto grocery delivery",
    "Swiggy Instamart fast delivery",
    "payment apps India",
    "hotel booking apps India"
  ],
  alternates: { canonical: "/" }
};

const faqs = [
  {
    q: "Which taxi apps are useful in India?",
    a: "Uber, Ola, Rapido and city-based ride services are commonly used for taxis, cabs and bike rides in India. Availability can change by city, so compare options before booking.",
    category: "Taxi & Transport"
  },
  {
    q: "Which app is used for train booking in India?",
    a: "IRCTC Rail Connect is the official app for Indian Railways ticket booking. Travellers can also use railway enquiry and live train status apps for trip planning.",
    category: "Train"
  },
  {
    q: "Which metro apps should I use in India?",
    a: "Metro apps depend on the city. Delhi Metro, Mumbai Metro, Bengaluru Metro and other local metro apps help with route maps, fare information and station guidance.",
    category: "Metro"
  },
  {
    q: "Which maps and navigation apps work well in India?",
    a: "Google Maps is widely used in India for road navigation, public transport routes and local places. Some travellers also use local transit and offline map apps.",
    category: "Maps & Navigation"
  },
  {
    q: "Which food delivery apps are popular in India?",
    a: "Swiggy and Zomato are popular food delivery apps in many Indian cities. Travellers should check address accuracy, delivery range and payment options before ordering.",
    category: "Food"
  },
  {
    q: "What is the best grocery app in Delhi India?",
    a: "Blinkit, Zepto and Swiggy Instamart are among the best grocery apps in Delhi India for fast grocery delivery, snacks, beverages, daily essentials and travel needs.",
    category: "Grocery Delivery"
  },
  {
    q: "Which apps provide fast grocery delivery in India?",
    a: "Blinkit, Zepto and Swiggy Instamart are popular instant grocery delivery apps in India. Delivery speed depends on the city, area, store availability and time of day.",
    category: "Grocery Delivery"
  },
  {
    q: "Can tourists use Blinkit, Zepto and Instamart in India?",
    a: "Yes, tourists can use Blinkit, Zepto and Swiggy Instamart in supported Indian cities to order groceries, packaged food, water bottles, snacks, hygiene items and travel essentials.",
    category: "Grocery Delivery"
  },
  {
    q: "Which apps are best for food delivery and grocery fast delivery?",
    a: "For food delivery, Swiggy and Zomato are widely used. For grocery fast delivery, Blinkit, Zepto and Swiggy Instamart are useful in many Indian cities including Delhi.",
    category: "Food & Grocery"
  },
  {
    q: "Which shopping apps are useful for travellers in India?",
    a: "Amazon India, Flipkart and local delivery platforms are useful for shopping, travel essentials and quick product delivery where available.",
    category: "Shopping"
  },
  {
    q: "Which payment apps are commonly used in India?",
    a: "UPI-based payment apps such as PhonePe, Google Pay and Paytm are widely used in India, but international travellers should check whether their bank and SIM support local payments.",
    category: "Payments"
  },
  {
    q: "Which hotel and stay apps are useful in India?",
    a: "Travellers can compare hotels and stays using booking platforms, hotel apps and local accommodation services. Always check reviews, location and cancellation rules.",
    category: "Hotels & Stay"
  },
  {
    q: "Which apps help with tourist attractions in India?",
    a: "Maps, travel guide apps and local attraction platforms can help tourists find monuments, nearby places, tickets, timings and reviews.",
    category: "Attractions"
  },
  {
    q: "Which translation apps help tourists in India?",
    a: "Google Translate and other translation apps can help with Hindi and regional languages. Offline language packs are useful when mobile internet is weak.",
    category: "Translation"
  },
  {
    q: "What is the SOS or emergency helpline number in India?",
    a: "In India, 112 is the national emergency helpline number. Travellers may also use police, ambulance and local emergency apps where available. Always verify emergency contacts for the city or state you are visiting.",
    category: "SOS & Emergency"
  },
  {
    q: "Where can I find all travel app categories on Aliwvide?",
    a: "Open the category page to choose taxi, emergency, train, metro, bus, flights, maps, food, shopping, payment, hotel, stay, attractions, translation and currency tools by country.",
    category: "All Categories"
  }
];

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

const categoryCards = [
  ["🚨", "SOS & Emergency", "Emergency helplines, police, ambulance and traveller safety support"],
  ["🚖", "Taxi Apps", "Uber, Ola, Rapido and local ride apps"],
  ["🚄", "Train & Metro", "Railway, metro and local route apps used in India"],
  ["🚌", "Bus & Local Transport", "Bus, public transport and city travel apps"],
  ["🗺️", "Maps & Navigation", "Maps, route planning and offline navigation tools"],
  ["✈️", "Flights", "Airline and flight booking platforms"],
  ["🍽️", "Food & Grocery", "Food delivery, Blinkit, Zepto and Instamart grocery apps"],
  ["🛍️", "Shopping", "Shopping and local delivery apps"],
  ["💳", "Payments", "Wallet, UPI and travel payment apps"],
  ["🏨", "Hotels & Stay", "Hotel booking and accommodation apps"],
  ["📍", "Attractions", "Tourist places, activities and local guides"],
  ["🌐", "Translation & Currency", "Translator and currency conversion tools"]
];

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
          <div className="max-w-5xl">
            <p className="mb-4 inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-gray-600">
              India travel app guide
            </p>
            <h1 className="text-5xl font-black tracking-[-0.05em] md:text-6xl">
              Best Travel Apps in India for Tourists
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-600">
              Aliwvide helps tourists and travellers discover trusted taxi apps,
              SOS helplines, metro apps, train booking apps, food delivery apps, grocery fast delivery apps,
              payment apps, hotel apps and navigation apps used across India.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/category" className="rounded-full bg-gray-950 px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:shadow-xl">
                Explore all categories
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map(([icon, title, desc]) => (
              <Link href="/category" key={title} className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
                <div className="text-4xl">{icon}</div>
                <h2 className="mt-5 text-xl font-black">{title}</h2>
                <p className="mt-2 text-gray-500">{desc}</p>
                <span className="mt-5 inline-block text-sm font-black text-gray-950">Open category →</span>
              </Link>
            ))}
          </div>

          <div className="mt-20 grid gap-10 md:grid-cols-2">
            <div className="rounded-[2rem] bg-gray-50 p-8">
              <h2 className="text-3xl font-black">Why tourists use Aliwvide</h2>
              <p className="mt-4 text-gray-600 leading-8">
                Travellers often struggle to know which local apps work in a new country.
                Aliwvide simplifies this by grouping apps into useful categories like emergency,
                taxi, train, metro, maps, food, shopping, payment and hotel booking.
              </p>
            </div>

            <div className="rounded-[2rem] bg-gray-50 p-8">
              <h2 className="text-3xl font-black">Popular travel app categories</h2>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li>• SOS and emergency helplines</li>
                <li>• Taxi, cab and local transport apps</li>
                <li>• Train, metro and bus apps</li>
                <li>• Maps, navigation and translation tools</li>
                <li>• Food, shopping, payment and hotel apps</li>
              </ul>
            </div>
          </div>

          <div className="mt-24" id="faq">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h2 className="text-4xl font-black">Frequently Asked Questions</h2>
                <p className="mt-3 max-w-3xl text-gray-600">
                  Quick answers for India travel apps, SOS helplines and all major tourist categories.
                </p>
              </div>

            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-[1.5rem] border border-gray-200 bg-white p-6 shadow-sm">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">{item.category}</span>
                  <h3 className="mt-3 text-xl font-bold">{item.q}</h3>
                  <p className="mt-3 text-gray-600 leading-7">{item.a}</p>
                  <Link href="/category" className="mt-4 inline-block font-black text-gray-950">
                    View related category →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
