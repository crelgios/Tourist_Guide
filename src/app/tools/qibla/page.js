import Link from "next/link";
import QiblaFinder from "@/components/QiblaFinder";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aliwvide.com";
const pageUrl = `${siteUrl}/tools/qibla`;

export const metadata = {
  title: "Qibla Finder Online - Find Qibla Direction from My Location | Aliwvide",
  description:
    "Free online Qibla Finder to find the direction of the Kaaba from your current location. Get Qibla bearing in degrees and use a live compass on supported iPhone and Android phones.",
  keywords: [
    "qibla finder",
    "qibla direction",
    "qibla compass",
    "find qibla",
    "qibla direction from my location",
    "qibla finder online",
    "qibla direction online",
    "kaaba direction",
    "makkah direction",
    "mecca direction",
    "qibla direction compass",
    "qibla finder iphone",
    "qibla finder android",
    "qibla direction India",
    "qibla direction Delhi",
    "qibla direction while travelling"
  ],
  alternates: { canonical: "/tools/qibla" },
  openGraph: {
    title: "Qibla Finder Online | Find the Kaaba Direction from Your Location",
    description:
      "Use your current location to calculate the Qibla direction toward the Kaaba in Makkah. Includes bearing in degrees and live compass support on compatible phones.",
    url: pageUrl,
    siteName: "Aliwvide",
    type: "website",
    images: [
      {
        url: "/brand/aliwvide-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aliwvide online Qibla Finder"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Qibla Finder Online | Aliwvide",
    description: "Find the Qibla direction from your current location on iPhone, Android or desktop.",
    images: ["/brand/aliwvide-og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

const faqs = [
  {
    question: "How do I find the Qibla direction from my current location?",
    answer:
      "Open the Aliwvide Qibla Finder and tap Find my Qibla. Allow location access when your browser asks. The page calculates the bearing from your location toward the Kaaba in Makkah and shows the direction in degrees."
  },
  {
    question: "Does the Qibla Finder work on iPhone and Android?",
    answer:
      "Yes. The location-based Qibla calculation works in modern browsers on iPhone and Android. Compatible phones can also use device orientation for a live compass after permission is granted."
  },
  {
    question: "Why is my browser not asking for location permission?",
    answer:
      "Your browser may already have the website set to Allow or Deny, or device Location Services may be disabled. Check the website location permission and your phone's Location Services, then try again."
  },
  {
    question: "What does the Qibla bearing in degrees mean?",
    answer:
      "The bearing is the direction of the Kaaba measured clockwise from true north. For example, a result near 270 degrees means the Qibla is generally toward the west from that location."
  },
  {
    question: "Can I use the Qibla Finder while travelling?",
    answer:
      "Yes. Because the direction is calculated from your current coordinates, you can use the Qibla Finder when you arrive in another city or country and update your location again."
  },
  {
    question: "Is the online Qibla direction always exact?",
    answer:
      "The geographic bearing calculation is based on your device location. Live compass accuracy can be affected by magnetic cases, speakers, vehicles, metal objects and sensor calibration, so keep the phone away from interference when using the compass."
  }
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Aliwvide Qibla Finder",
    url: pageUrl,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern browser. Location access is needed to calculate the Qibla from the user's current position.",
    description:
      "Free browser-based Qibla Finder that calculates the direction and bearing toward the Kaaba in Makkah from the user's current location.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    publisher: {
      "@type": "Organization",
      name: "Aliwvide",
      url: siteUrl
    }
  },
  {
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
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Aliwvide", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Faith & Worship", item: `${siteUrl}/tools` },
      { "@type": "ListItem", position: 3, name: "Qibla Finder", item: pageUrl }
    ]
  }
];

export default function QiblaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/50 px-4 py-8 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <QiblaFinder />

      <div className="mx-auto mt-10 max-w-4xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Free online Qibla direction</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Find the direction of the Kaaba from your location
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
            <p>
              Aliwvide Qibla Finder is a browser-based Qibla direction service for Muslims who need to identify the direction of the Kaaba in Makkah. It calculates the geographic bearing from your current latitude and longitude and displays the result in degrees from true north.
            </p>
            <p>
              It can be useful at home, in a hotel, at an airport, during Umrah or Hajj travel, or whenever you arrive in a new city and are unsure which direction to face for prayer. No account is required.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3" aria-label="How the Qibla Finder works">
          {[
            ["1", "Allow location", "Tap Find my Qibla and allow your browser to use your current location."],
            ["2", "Read the bearing", "Aliwvide calculates the direction toward the Kaaba and shows the Qibla bearing in degrees."],
            ["3", "Use live compass", "On supported phones, enable the compass and rotate the phone to follow the direction arrow."]
          ].map(([number, title, text]) => (
            <article key={number} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 font-black text-emerald-700">{number}</div>
              <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Qibla Finder questions</h2>
          <div className="mt-5 divide-y divide-slate-200">
            {faqs.map((faq) => (
              <article key={faq.question} className="py-5 first:pt-0 last:pb-0">
                <h3 className="font-black text-slate-900">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
          <h2 className="text-2xl font-black">More faith features on Aliwvide</h2>
          <p className="mt-2 max-w-2xl leading-7 text-slate-300">
            You can also access Tasbih Counter, Daily Dhikr and Dua Counter from the Aliwvide Faith & Worship section.
          </p>
          <Link
            href="/tools"
            className="mt-5 inline-flex rounded-full bg-emerald-500 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-400"
          >
            Explore Faith & Worship →
          </Link>
        </section>
      </div>
    </main>
  );
}
