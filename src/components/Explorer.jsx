"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Globe2, Smartphone, Apple, PhoneCall } from "lucide-react";
import { categories, countries, getCountryData, getCountryName } from "@/data/countries";
import { getTranslation, languages } from "@/data/translations";
import PageTransition from "@/components/PageTransition";

export default function Explorer() {
  const [step, setStep] = useState("country");
  const [country, setCountry] = useState("india");
  const [language, setLanguage] = useState("English");
  const [category, setCategory] = useState("emergency");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingEffect, setLoadingEffect] = useState(false);

  const t = getTranslation(language);
  const countryName = getCountryName(country);
  const countryData = getCountryData(country);
  const sites = countryData[category] || [];
  const selectedSite = sites[selectedIndex] || null;

  const labels = useMemo(() => ({
    emergency: [t.emergency, t.emergencyDesc],
    transport: [t.localTransport, t.localTransportDesc],
    maps: [t.maps, t.mapsDesc],
    train: [t.train, t.trainDesc],
    metro: [t.metro, t.metroDesc],
    bus: [t.bus, t.busDesc],
    flights: [t.flights, t.flightsDesc],
    shopping: [t.shopping, t.shoppingDesc],
    food: [t.food, t.foodDesc]
  }), [t]);

  function nextWithEffect(nextStep) {
    setLoadingEffect(true);
    setTimeout(() => {
      setStep(nextStep);
      setLoadingEffect(false);
    }, 650);
  }

  function openLink(url) {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="relative">
      {loadingEffect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 grid place-items-center bg-white"
        >
          <motion.div
            animate={{ scale: [1, 1.35, 1], rotate: 360 }}
            transition={{ duration: 0.65 }}
            className="h-28 w-28 rounded-full bg-[radial-gradient(circle_at_35%_30%,#60a5fa,#0f172a_60%)] shadow-[0_0_80px_rgba(59,130,246,.45)]"
          />
        </motion.div>
      )}

      {step === "country" && (
        <PageTransition>
          <StepShell>
            <h1 className="mb-8 text-center text-6xl font-black tracking-[-0.07em] md:text-8xl">{t.whereTitle}</h1>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full max-w-xl rounded-full border border-gray-300 px-6 py-5 text-center text-xl outline-none focus:border-gray-950">
              {countries.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button onClick={() => nextWithEffect("language")} className="mt-6 rounded-full bg-gray-950 px-10 py-4 font-bold text-white">{t.continueBtn}</button>
          </StepShell>
        </PageTransition>
      )}

      {step === "language" && (
        <PageTransition>
          <StepShell>
            <h1 className="mb-4 text-center text-6xl font-black tracking-[-0.07em] md:text-8xl">{t.languageTitle}</h1>
            <p className="mb-8 text-gray-500">{countryName}</p>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full max-w-xl rounded-full border border-gray-300 px-6 py-5 text-center text-xl outline-none focus:border-gray-950">
              {languages.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button onClick={() => nextWithEffect("category")} className="mt-6 rounded-full bg-gray-950 px-10 py-4 font-bold text-white">{t.continueBtn}</button>
            <button onClick={() => setStep("country")} className="mt-3 rounded-full bg-gray-100 px-6 py-3 font-bold text-gray-950">{t.changeCountry}</button>
          </StepShell>
        </PageTransition>
      )}

      {step === "category" && (
        <PageTransition>
          <StepShell>
            <div className="glass w-full max-w-5xl rounded-[2rem] p-8 shadow-soft">
              <h1 className="mb-3 text-center text-5xl font-black tracking-[-0.05em]">{t.categoryTitle}</h1>
              <p className="mb-8 text-center text-gray-500">{countryName} • {language}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setCategory(item.key)}
                    className={`rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-xl ${category === item.key ? "border-gray-950 bg-gray-950 text-white" : "border-gray-200 bg-white"}`}
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <strong className="mt-3 block">{labels[item.key]?.[0] || item.key}</strong>
                    <span className={category === item.key ? "text-gray-300" : "text-gray-500"}>{labels[item.key]?.[1] || "Useful travel services"}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => { setSelectedIndex(0); nextWithEffect("results"); }} className="mt-8 w-full rounded-full bg-gray-950 px-10 py-4 font-bold text-white">{t.showRecommended}</button>
              <button onClick={() => setStep("language")} className="mt-3 w-full rounded-full bg-gray-100 px-6 py-3 font-bold text-gray-950">{t.changeLanguage}</button>
            </div>
          </StepShell>
        </PageTransition>
      )}

      {step === "results" && (
        <PageTransition>
          <main className="min-h-screen bg-white p-5 md:p-8">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[360px_1fr]">
              <aside className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-soft">
                <div className="border-b border-gray-200 p-6">
                  <button onClick={() => setStep("category")} className="rounded-full bg-gray-100 px-5 py-3 font-bold">← Back</button>
                  <h2 className="mt-6 text-3xl font-black tracking-[-0.04em]">{t.recommendedSites}</h2>
                  <p className="text-gray-500">{countryName} • {labels[category]?.[0] || category} • {language}</p>
                </div>

                <div className="flex max-h-[70vh] flex-col gap-3 overflow-auto p-4">
                  {sites.length === 0 ? (
                    <div className="rounded-3xl bg-gray-950 p-5 text-white">
                      <strong>{t.comingSoon}</strong>
                      <p className="text-sm text-gray-300">{t.noLinksYet}</p>
                    </div>
                  ) : sites.map((site, index) => (
                    <button
                      key={`${site.name}-${index}`}
                      onClick={() => setSelectedIndex(index)}
                      className={`rounded-3xl border p-5 text-left transition ${selectedIndex === index ? "border-gray-950 bg-gray-950 text-white" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                    >
                      <strong>{site.name}</strong>
                      <p className={selectedIndex === index ? "text-sm text-gray-300" : "text-sm text-gray-500"}>{site.type}</p>
                    </button>
                  ))}
                </div>
              </aside>

              <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-soft">
                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-4xl font-black tracking-[-0.05em]">{selectedSite?.name || t.selectWebsite}</h2>
                  <p className="text-gray-500">{selectedSite?.type || t.previewDetails}</p>

                  {selectedSite && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {category === "emergency" ? (
                        <button onClick={() => openLink(selectedSite.web || selectedSite.android || selectedSite.ios)} className="inline-flex items-center gap-2 rounded-2xl border bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"><PhoneCall size={18}/> {t.callNow}</button>
                      ) : (
                        <>
                          <button onClick={() => openLink(selectedSite.web)} className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 font-bold hover:bg-gray-950 hover:text-white"><Globe2 size={18}/> Web</button>
                          <button onClick={() => openLink(selectedSite.android)} className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 font-bold hover:bg-gray-950 hover:text-white"><Smartphone size={18}/> Android</button>
                          <button onClick={() => openLink(selectedSite.ios)} className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 font-bold hover:bg-gray-950 hover:text-white"><Apple size={18}/> iOS</button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="m-6 rounded-[2rem] bg-gradient-to-br from-gray-50 to-indigo-50 p-9">
                  <h2 className="text-5xl font-black tracking-[-0.05em]">{selectedSite?.name || t.websitePreview}</h2>
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">{selectedSite?.description || t.chooseWebsiteLeft}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {(selectedSite?.badges || [t.comingSoon, t.noLinksYet]).map((badge) => (
                      <span key={badge} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold">{badge}</span>
                    ))}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <h3 className="text-xl font-black">{t.beforeUsing}</h3>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
                    {(selectedSite?.docs || [t.noLinksYet]).map((doc) => <li key={doc}>{doc}</li>)}
                  </ul>
                </div>
              </section>
            </div>
          </main>
        </PageTransition>
      )}
    </div>
  );
}

function StepShell({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5 py-12">
      <section className="flex w-full flex-col items-center text-center">{children}</section>
    </main>
  );
}
