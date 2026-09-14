import { BookOpen, HandHeart, Repeat2 } from "lucide-react";

export const metadata = {
  title: "Travel Tools",
  description:
    "Open useful travel-friendly tools from Aliwvide, including Tasbih Counter, Daily Dhikr and Dua Counter.",
  alternates: {
    canonical: "/tools"
  }
};

const tools = [
  {
    title: "Tasbih Counter",
    description: "Use the digital Tasbih counter and continue through the 99 Names of Allah.",
    href: "https://tasbii.vercel.app/",
    icon: Repeat2
  },
  {
    title: "Daily Dhikr",
    description: "Open the Daily Dhikr tool and complete remembrance step by step.",
    href: "https://tasbii.vercel.app/daily-dhikr",
    icon: BookOpen
  },
  {
    title: "Dua Counter",
    description: "Choose a dua and keep track of your recitations with a dedicated counter.",
    href: "https://tasbii.vercel.app/dua-counter",
    icon: HandHeart
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
              Open the tool you need directly. Each card connects to the working Tasbii experience without recreating or duplicating the app.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                key={tool.title}
                href={tool.href}
                className="group block h-full rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-2xl font-black text-slate-900">{tool.title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{tool.description}</p>
                <div className="mt-5 text-sm font-black text-emerald-700">Open tool →</div>
              </a>
            );
          })}
        </section>
      </div>
    </main>
  );
}
