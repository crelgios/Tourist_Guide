import Footer from "@/components/Footer";
import { getPublishedFaqs } from "@/lib/content";

export const revalidate = 3600;

export const metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Aliwvide travel apps guide, taxi apps, transport apps and tourist app suggestions.",
  alternates: {
    canonical: "/faq"
  }
};

export default async function FAQPage() {
  const faqs = await getPublishedFaqs();

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

  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-14">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />

        <h1 className="text-4xl font-bold text-slate-900">
          Frequently Asked Questions
        </h1>

        <p className="mt-4 text-slate-600">
          Answers about travel apps, taxi apps, country guides and tourist app suggestions.
        </p>

        <div className="mt-10 space-y-5">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                {faq.category || "General"}
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                {faq.question}
              </h2>

              <p className="mt-3 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
