import { BookOpen, Compass, HandHeart, Repeat2 } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aliwvide.com";

export const metadata = {
  title: "Faith & Worship: Tasbih, Dhikr, Dua & Qibla Finder | Aliwvide",
  description:
    "Use Aliwvide Faith & Worship features including a free online Tasbih counter, Daily Dhikr, Dua Counter and Qibla Finder. Mobile-friendly for travellers, Umrah visitors and everyday worship.",
  alternates: {
    canonical: "/tools"
  },
  openGraph: {
    title: "Faith & Worship | Tasbih, Dhikr, Dua & Qibla Finder",
    description:
      "Open Tasbih, Daily Dhikr, Dua Counter and the Aliwvide Qibla Finder from one simple page.",
    url: `${siteUrl}/tools`,
    siteName: "Aliwvide",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Faith & Worship | Aliwvide",
    description: "Tasbih Counter, Daily Dhikr, Dua Counter and Qibla Finder in one place."
  },
  robots: {
    index: true,
    follow: true
  }
};

const tools = [
  {
    title: "Tasbih Counter",
    description:
      "Use a free digital Tasbih counter, save your progress and continue through the 99 Names of Allah.",
    href: "https://tasbii.vercel.app/",
    icon: Repeat2,
    external: true
  },
  {
    title: "Daily Dhikr",
    description:
      "Follow a simple Daily Dhikr routine and complete remembrance step by step on your phone.",
    href: "https://tasbii.vercel.app/daily-dhikr",
    icon: BookOpen,
    external: true
  },
  {
    title: "Dua Counter",
    description:
      "Choose a dua and keep track of your recitations with a dedicated online counter.",
    href: "https://tasbii.vercel.app/dua-counter",
    icon: HandHeart,
    external: true
  },
  {
    title: "Qibla Finder",
    description:
      "Use your current location to calculate the direction of the Kaaba in Makkah, with optional live compass support on compatible phones.",
    href: "/tools/qibla",
    icon: Compass,
    external: false
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Aliwvide Faith & Worship",
  url: `${siteUrl}/tools`,
  description:
    "Faith and worship features including a Tasbih Counter, Daily Dhikr, Dua Counter and Qibla Finder.",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.title,
      url: tool.href.startsWith("/") ? `${siteUrl}${tool.href}` : tool.href
    }))
  }
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/50 px-4 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-200">
              Aliwvide Faith & Worship
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              Tasbih, Dhikr, Dua and Qibla in one place
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Keep useful faith and worship features close while travelling or at home. Open Tasbih, Daily Dhikr, Dua Counter or find the Qibla directly from the cards below.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Available faith and worship features">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                key={tool.title}
                href={tool.href}
                target={tool.external ? "_blank" : undefined}
                rel={tool.external ? "noopener noreferrer" : undefined}
                className="group block h-full rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-2xl font-black text-slate-900">{tool.title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{tool.description}</p>
                <div className="mt-5 text-sm font-black text-emerald-700">
                  {tool.title === "Qibla Finder" ? "Find Qibla →" : "Open →"}
                </div>
              </a>
            );
          })}
        </section>

        <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black text-slate-900">Faith features for home and travel</h2>
          <div className="mt-4 grid gap-5 text-sm leading-7 text-slate-600 sm:text-base md:grid-cols-2">
            <p>
              Aliwvide brings together simple browser-based faith features without requiring an account. They are easy to open during a journey, at an airport, in a hotel, at home or while visiting a new city.
            </p>
            <p>
              Use the digital Tasbih for counted remembrance, Daily Dhikr for a guided routine, the Dua Counter for repeated dua, or Qibla Finder to calculate the direction of the Kaaba from your current location.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
