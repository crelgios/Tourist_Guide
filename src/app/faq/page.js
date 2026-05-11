import Link from "next/link";
import Footer from "@/components/Footer";
import siteContent from "@/data/site-content.json";

export const metadata = {
  title: "Travel App FAQs: SOS, Taxi, Train, Metro, Food, Grocery & More",
  description:
    "Frequently asked questions about SOS helplines, taxi apps, train apps, metro apps, maps, food delivery, grocery delivery, shopping and tourist apps in India.",
  alternates: { canonical: "/faq" }
};

const faqs = siteContent.faqs || [];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="min-h-screen bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-gray-600">
            Travel help center
          </p>
          <h1 className="text-5xl font-black tracking-[-0.07em] md:text-6xl">Travel App FAQs for India</h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-gray-600">
            Find answers about SOS helplines, taxi apps, train apps, metro apps, maps, food delivery, grocery delivery, shopping and tourist categories.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/category" className="rounded-full bg-gray-950 px-7 py-4 font-bold text-white">
              Explore categories
            </Link>
            <Link href="/blog" className="rounded-full bg-gray-100 px-7 py-4 font-bold text-gray-950">
              Read travel guides
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.id} className="rounded-[1.5rem] border border-gray-200 bg-white p-6 shadow-sm">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">{faq.category || "General"}</span>
                <h2 className="mt-3 text-xl font-bold">{faq.question}</h2>
                <p className="mt-3 leading-7 text-gray-600">{faq.answer}</p>
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
