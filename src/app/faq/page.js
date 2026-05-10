import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Travel App FAQs: SOS, Taxi, Train, Metro, Food, Grocery & More",
  description:
    "Frequently asked questions about SOS helplines, taxi apps, train apps, metro apps, maps, food delivery, grocery fast delivery, Blinkit, Zepto, Instamart, shopping, payment, hotel and tourist apps in India."
};

const faqs = [
  ["SOS & Emergency", "What is the SOS or emergency helpline number in India?", "112 is India’s national emergency helpline. Travellers should also verify local police, ambulance and state-specific emergency contacts before travelling."],
  ["Taxi & Transport", "Which taxi apps are useful in India?", "Uber, Ola and Rapido are commonly used in many Indian cities. Availability, pricing and ride types can vary by location."],
  ["Train", "Which app is used for train booking in India?", "IRCTC Rail Connect is the official Indian Railways ticket booking app. Live train status apps can also help with tracking and platform information."],
  ["Metro", "Which metro app should I install?", "Install the metro app for the city you are visiting, such as Delhi Metro, Mumbai Metro or Bengaluru Metro where available."],
  ["Bus", "Are bus apps useful for tourists in India?", "Yes. City bus and intercity bus apps can help with routes, booking and timing, especially for local travel."],
  ["Maps & Navigation", "Which navigation app works well in India?", "Google Maps is widely used for routes, traffic and public transport. Offline maps can help when internet coverage is weak."],
  ["Flights", "Which flight apps are useful for India travel?", "Airline apps and flight booking platforms help compare fares, check flight status and manage bookings."],
  ["Food", "Which food delivery apps are popular in India?", "Swiggy and Zomato are popular in many cities. Always check delivery address, restaurant rating and payment options."],
  ["Grocery Delivery", "What is the best grocery app in Delhi India?", "Blinkit, Zepto and Swiggy Instamart are among the best grocery apps in Delhi India for fast grocery delivery, snacks, beverages, daily essentials and travel needs."],
  ["Grocery Delivery", "Which apps provide fast grocery delivery in India?", "Blinkit, Zepto and Swiggy Instamart are popular instant grocery delivery apps in India. Delivery speed depends on the city, area, store availability and time of day."],
  ["Grocery Delivery", "Can tourists use Blinkit, Zepto and Instamart in India?", "Yes, tourists can use Blinkit, Zepto and Swiggy Instamart in supported Indian cities to order groceries, packaged food, water bottles, snacks, hygiene items and travel essentials."],
  ["Food & Grocery", "Which apps are best for food delivery and grocery fast delivery?", "For food delivery, Swiggy and Zomato are widely used. For grocery fast delivery, Blinkit, Zepto and Swiggy Instamart are useful in many Indian cities including Delhi."],
  ["Shopping", "Which shopping apps help travellers?", "Amazon India, Flipkart and local delivery platforms can help travellers buy essentials during their stay."],
  ["Payments", "Which payment apps are common in India?", "UPI payment apps like PhonePe, Google Pay and Paytm are common, but foreign travellers should check bank, SIM and KYC support."],
  ["Hotels & Stay", "Which hotel apps should travellers use?", "Hotel booking and stay apps help compare prices, reviews, location and cancellation policies."],
  ["Attractions", "How can I find tourist attractions in India?", "Use maps, travel guide apps and local attraction platforms to find places to visit, timings, tickets and reviews."],
  ["Translation", "Do tourists need translation apps in India?", "Translation apps can help with Hindi and regional languages. Download offline language packs before travel."],
  ["Currency", "Do tourists need currency apps in India?", "Currency converter apps help estimate local prices and compare exchange rates while travelling."],
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([category, question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer
    }
  }))
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-gray-600">
            Travel help center
          </p>
          <h1 className="text-5xl font-black tracking-[-0.07em] md:text-6xl">
            Travel App FAQs for India
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-gray-600">
            Find answers about SOS helplines, taxi apps, train apps, metro apps, maps, food delivery, grocery fast delivery, shopping, payment, hotel and tourist categories.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/category" className="rounded-full bg-gray-950 px-7 py-4 font-bold text-white">
              Explore categories
            </Link>
            <Link href="/" className="rounded-full bg-gray-100 px-7 py-4 font-bold text-gray-950">
              Back to home
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {faqs.map(([category, question, answer]) => (
              <div key={question} className="rounded-[1.5rem] border border-gray-200 bg-white p-6 shadow-sm">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">{category}</span>
                <h2 className="mt-3 text-xl font-bold">{question}</h2>
                <p className="mt-3 leading-7 text-gray-600">{answer}</p>
                <Link href="/category" className="mt-4 inline-block font-black text-gray-950">
                  Open related category →
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[2rem] border border-gray-200 bg-gray-50 p-8 text-gray-600">
            <p>
              All trademarks, logos, websites and app names belong to their respective owners. Always verify emergency numbers, official service availability, pricing and local policies before use.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
