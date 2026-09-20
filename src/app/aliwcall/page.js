import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Check,
  ClipboardList,
  Clock3,
  FileText,
  Headphones,
  PhoneCall,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const appUrl = "https://aliwcall.vercel.app";
const pageUrl = "https://www.aliwvide.com/aliwcall";

export const metadata = {
  title: "AliwCall AI Receptionist for Businesses | Aliwvide",
  description:
    "AliwCall is an inbound AI receptionist for small businesses. Answer customer calls, capture caller replies, manage leads, and review transcripts and call reports from one simple dashboard.",
  keywords: [
    "AI receptionist",
    "AI phone receptionist",
    "inbound AI calls for small business",
    "AI receptionist for inbound calls",
    "AI call assistant",
    "AliwCall",
  ],
  alternates: { canonical: "/aliwcall" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: pageUrl,
    siteName: "Aliwvide",
    title: "AliwCall — AI Receptionist for Small Businesses",
    description:
      "Answer inbound customer calls and manage caller replies, leads, transcripts and reports from one business dashboard.",
    images: [
      {
        url: "https://www.aliwvide.com/brand/aliwvide-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AliwCall AI Receptionist",
      },
    ],
  },
};

const features = [
  {
    icon: PhoneCall,
    title: "Answer inbound calls with AI",
    text: "Let your AI receptionist answer incoming customer calls and handle common conversations when you cannot pick up.",
  },
  {
    icon: Users,
    title: "Capture leads automatically",
    text: "Keep caller details and business leads together so your team can follow up from one dashboard.",
  },
  {
    icon: FileText,
    title: "Transcripts & call details",
    text: "Open an individual call to review the conversation, caller response, status and other call information.",
  },
  {
    icon: ClipboardList,
    title: "Call reports in your dashboard",
    text: "See recent calls in a compact table instead of relying on email reports or scrolling through long cards.",
  },
  {
    icon: RefreshCw,
    title: "Refresh recent calls",
    text: "Refresh the call list whenever you need the latest activity and responses.",
  },
  {
    icon: Bot,
    title: "Always-on receptionist workflow",
    text: "Give callers a consistent first response and keep their information organized even when your team is busy.",
  },
];

const steps = [
  {
    n: "01",
    title: "Create your business",
    text: "Sign up, add your business name, category and phone details.",
  },
  {
    n: "02",
    title: "Configure your AI receptionist",
    text: "Set up the receptionist and the information it should use while handling calls.",
  },
  {
    n: "03",
    title: "Receive customer calls",
    text: "Customers call your business number and the AI receptionist handles the inbound conversation.",
  },
  {
    n: "04",
    title: "Review the results",
    text: "Open the Calls and Leads sections to see caller responses, transcripts, summaries and follow-up information.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    badge: "Available now",
    description: "Try the AliwCall dashboard and AI receptionist workflow.",
    features: [
      "20 AI minutes per month",
      "Business dashboard",
      "AI receptionist settings",
      "Calls & leads",
      "Call history",
    ],
    cta: "Start Free",
    href: appUrl,
    featured: false,
  },
  {
    name: "Starter",
    price: "$14.99",
    period: "/month",
    badge: "Draft pricing",
    description: "For small businesses receiving regular customer calls.",
    features: [
      "100 AI minutes per month",
      "Inbound AI receptionist",
      "Call reports & transcripts",
      "Lead capture",
      "Dashboard history",
    ],
    cta: "Preview Plan",
    href: "#pricing-note",
    featured: true,
  },
  {
    name: "Business",
    price: "$29.99",
    period: "/month",
    badge: "Draft pricing",
    description: "For growing businesses with higher inbound call volume.",
    features: [
      "Everything in Starter",
      "250 AI minutes per month",
      "Higher inbound call capacity",
      "Advanced reporting",
      "Priority support",
    ],
    cta: "Preview Plan",
    href: "#pricing-note",
    featured: false,
  },
  {
    name: "Pro",
    price: "$59.99",
    period: "",
    badge: "Draft pricing",
    description: "For businesses with heavier inbound AI receptionist usage.",
    features: [
      "500 AI minutes per month",
      "Everything in Business",
      "Higher inbound call capacity",
      "Advanced reporting",
      "Priority support",
    ],
    cta: "Preview Plan",
    href: "#pricing-note",
    featured: false,
  },
];

const faqs = [
  {
    q: "What is AliwCall?",
    a: "AliwCall is an inbound AI receptionist designed to answer customer calls, capture caller responses, track leads and keep call information organized in one dashboard.",
  },
  {
    q: "Does AliwCall make outbound calls?",
    a: "Not in the current service. AliwCall is currently focused on inbound calls, where customers call your business and the AI receptionist answers them.",
  },
  {
    q: "Can I see each caller's response?",
    a: "Yes. The Calls view is designed to show a quick caller-reply preview, and you can open a call to review more detailed information.",
  },
  {
    q: "Are the paid prices final?",
    a: "No. The Starter, Business and Pro prices shown on this preview page are draft pricing for review. Final pricing and usage rules will be confirmed before production launch.",
  },
];

export default function AliwCallPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.16),_transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              <Sparkles className="h-4 w-4" />
              AliwCall by Aliwvide
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Never miss a customer call with your AI receptionist
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              AliwCall answers inbound customer calls for your business and keeps caller replies, leads, transcripts and reports organized in one simple dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={appUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-400"
              >
                Start Free
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                View Pricing
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> No card required for free access</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 20 free AI minutes</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Mobile-friendly dashboard</span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-xl font-black text-emerald-400">AliwCall</div>
                  <div className="mt-1 text-xs text-slate-400">Business dashboard</div>
                </div>
                <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">● AI ON</div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ["12", "Calls"],
                  ["7", "Leads"],
                  ["8", "Minutes used"],
                  ["12", "Free minutes left"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-2xl font-black">{value}</div>
                    <div className="mt-1 text-sm text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                <div className="grid grid-cols-[.7fr_1fr_1.4fr_.7fr] gap-2 bg-white/[0.05] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  <span>Time</span><span>Caller</span><span>Reply</span><span>Status</span>
                </div>
                {[
                  ["10:24", "+1 202…", "Yes, please call me tomorrow.", "ended"],
                  ["10:11", "+1 415…", "I want pricing details.", "ended"],
                  ["09:48", "+1 305…", "Send me more information.", "ended"],
                ].map((row) => (
                  <div key={row[0]} className="grid grid-cols-[.7fr_1fr_1.4fr_.7fr] gap-2 border-t border-white/10 px-3 py-3 text-xs text-slate-300">
                    {row.map((cell) => <span key={cell} className="truncate">{cell}</span>)}
                  </div>
                ))}
              </div>
              <button className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200">
                <RefreshCw className="h-4 w-4" /> Refresh calls
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Why AliwCall</span>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">One place to manage your inbound AI receptionist</h2>
          <p className="mt-4 text-lg leading-8 text-slate-400">
            Built for small businesses that want customer calls answered consistently, caller details captured, and useful follow-up information kept in one place.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{feature.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-400">How it works</span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">From setup to follow-up in four steps</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.n} className="rounded-3xl border border-white/10 bg-slate-950 p-6">
                <div className="text-sm font-black text-emerald-400">{step.n}</div>
                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Pricing</span>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Start free. Upgrade when your call volume grows.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-400">
            Free access reflects the current AliwCall setup. Paid plan prices below are draft USD pricing for inbound AI receptionist usage while final provider costs and margins are being finalized.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-3xl border p-6 ${plan.featured ? "border-emerald-400 bg-emerald-400/[0.08] shadow-xl shadow-emerald-950/20" : "border-white/10 bg-white/[0.04]"}`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-6 rounded-full bg-emerald-500 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">Popular preview</div>
              )}
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{plan.badge}</div>
              <h3 className="mt-3 text-2xl font-black">{plan.name}</h3>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="pb-1 text-sm text-slate-400">{plan.period}</span>
              </div>
              <p className="mt-4 min-h-14 leading-7 text-slate-400">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                target={plan.href.startsWith("http") ? "_blank" : undefined}
                rel={plan.href.startsWith("http") ? "noreferrer" : undefined}
                className={`mt-7 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 font-bold transition ${plan.featured ? "bg-emerald-500 text-white hover:bg-emerald-400" : "border border-white/10 bg-white/[0.05] text-white hover:bg-white/10"}`}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
        <div id="pricing-note" className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-5 text-sm leading-6 text-amber-100/80">
          <strong className="text-amber-200">Preview pricing note:</strong> Starter, Business and Pro prices are draft USD values for this preview only. Final included minutes, overage pricing and provider costs should be confirmed before production launch.
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-400">Built for business</span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Know what every inbound caller needed</h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              AliwCall is designed so your team can quickly understand what happened without listening to every call from the beginning.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [Headphones, "Caller reply", "See the latest caller response directly in the call list."],
              [FileText, "Conversation detail", "Open a call to review more detailed conversation information."],
              [Clock3, "Usage tracking", "Monitor monthly AI-minute usage from the dashboard."],
              [ShieldCheck, "Business account", "Keep business data organized under your own account and workspace."],
            ].map(([Icon, title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-slate-950 p-5">
                <Icon className="h-6 w-6 text-emerald-400" />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">FAQ</span>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Common questions</h2>
        </div>
        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <summary className="cursor-pointer list-none font-bold">{faq.q}</summary>
              <p className="mt-3 leading-7 text-slate-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-sky-500/10 p-8 text-center sm:p-12">
          <Bot className="mx-auto h-12 w-12 text-emerald-300" />
          <h2 className="mt-5 text-3xl font-black sm:text-4xl">Give your business an AI receptionist</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Create your AliwCall account, set up your business and explore the dashboard with free monthly AI minutes.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={appUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-400">
              Open AliwCall <ArrowRight className="h-5 w-5" />
            </a>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
