import Link from "next/link";
import { Compass, HeartHandshake, MoonStar, Repeat2 } from "lucide-react";

export const metadata = {
  title: "Travel Tools for Tourists",
  description:
    "Use simple travel-friendly tools from Aliwvide, including a digital Tasbih, with more useful utilities for travellers coming soon.",
  alternates: {
    canonical: "/tools"
  }
};

const tools = [
  {
    title: "Digital Tasbih",
    description: "Count dhikr on your phone while travelling. Your progress is saved on this device.",
    href: "/tools/tasbih",
    icon: Repeat2,
    status: "Available"
  },
  {
    title: "Qibla Finder",
    description: "Quickly find the Qibla direction when you are in an unfamiliar place.",
    icon: Compass,
    status: "Coming soon"
  },
  {
    title: "Travel Duas",
    description: "Keep useful duas for journeys, airports, hotels and daily travel close at hand.",
    icon: HeartHandshake,
    status: "Coming soon"
  },
  {
    title: "Daily Dhikr",
    description: "A simple morning and evening remembrance companion for travellers.",
    icon: MoonStar,
    status: "Coming soon"
  }
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-200">
              Aliwvide Travel Tools
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Useful tools for your journey</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Aliwvide already helps travellers discover the apps they need. Travel Tools adds simple utilities you can use directly on the website while you are away from home.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const content = (
              <div className="h-full rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${tool.href ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                    {tool.status}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-black text-slate-900">{tool.title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{tool.description}</p>
                {tool.href && <div className="mt-5 text-sm font-black text-emerald-700">Open tool →</div>}
              </div>
            );

            return tool.href ? (
              <Link key={tool.title} href={tool.href} className="block">
                {content}
              </Link>
            ) : (
              <div key={tool.title}>{content}</div>
            );
          })}
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-900">Built for tourists on the move</h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate-700">
            These tools are intended to be fast, mobile friendly and easy to use without creating an account. More travel utilities can be added here later without mixing them into Aliwvide's third-party app categories.
          </p>
        </section>
      </div>
    </main>
  );
}
