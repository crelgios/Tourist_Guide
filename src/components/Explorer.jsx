"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Globe2, Smartphone, Apple, PhoneCall } from "lucide-react";
import { categories, countries, getCountryData, getCountryName } from "@/data/countries";
import { getTranslation, languages } from "@/data/translations";
import PageTransition from "@/components/PageTransition";

export default function Explorer({ initialStep = "country" }) {
  const safeInitialStep = ["country", "language", "category", "results"].includes(initialStep) ? initialStep : "country";
  const [step, setStep] = useState(safeInitialStep);
  const [country, setCountry] = useState("india");
  const [language, setLanguage] = useState("English");
  const [category, setCategory] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const t = getTranslation(language);
  const countryName = getCountryName(country);
  const countryData = getCountryData(country);
  const sites = countryData[category] || [];
  const selectedSite = sites[selectedIndex] || null;

  const historyStateRef = useRef({
    step: safeInitialStep,
    country: "india",
    language: "English",
    category: "",
    selectedIndex: 0
  });

  useEffect(() => {
    historyStateRef.current = { step, country, language, category, selectedIndex };
  }, [step, country, language, category, selectedIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initialState = {
      aliwvideExplorer: true,
      step: historyStateRef.current.step,
      country: historyStateRef.current.country,
      language: historyStateRef.current.language,
      category: historyStateRef.current.category,
      selectedIndex: historyStateRef.current.selectedIndex
    };

    window.history.replaceState(initialState, "", window.location.href);

    function handlePopState(event) {
      const nextState = event.state;
      if (!nextState?.aliwvideExplorer) return;

      setStep(nextState.step || "country");
      setCountry(nextState.country || "india");
      setLanguage(nextState.language || "English");
      setCategory(nextState.category || "");
      setSelectedIndex(Number(nextState.selectedIndex || 0));
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function writeExplorerHistory(nextValues, mode = "push") {
    if (typeof window === "undefined") return;

    const nextState = {
      aliwvideExplorer: true,
      ...historyStateRef.current,
      ...nextValues
    };

    const method = mode === "replace" ? "replaceState" : "pushState";
    window.history[method](nextState, "", window.location.href);
    historyStateRef.current = nextState;
  }

  function goToStep(nextStep) {
    writeExplorerHistory({ step: nextStep });
    setStep(nextStep);
  }

  function goBackToPreviousStep(fallbackStep = "category") {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }
    setStep(fallbackStep);
  }

  const labels = useMemo(() => ({
    emergency: [t.emergency, t.emergencyDesc],
    transport: [t.localTransport, t.localTransportDesc],
    maps: [t.maps, t.mapsDesc],
    train: [t.train, t.trainDesc],
    metro: [t.metro, t.metroDesc],
    bus: [t.bus, t.busDesc],
    flights: [t.flights, t.flightsDesc],
    shopping: [t.shopping, t.shoppingDesc],
    food: [t.food, t.foodDesc],
    navigation: [t.navigation || "Navigation", t.navigationDesc || "Routes, maps and local travel guidance"],
    payment: [t.payment || "Payments", t.paymentDesc || "Payment, wallet and local money apps"],
    hotel: [t.hotel || "Hotels", t.hotelDesc || "Hotel booking and travel stay options"],
    stay: [t.stay || "Stay", t.stayDesc || "Apartments, rooms and accommodation"],
    attractions: [t.attractions || "Attractions", t.attractionsDesc || "Places to visit and tourist activities"],
    translation: [t.translation || "Translation", t.translationDesc || "Language and translator tools"],
    currency: [t.currency || "Currency", t.currencyDesc || "Currency exchange and money conversion"]
  }), [t]);

  function openLink(url) {
    if (!url) return;
    if (String(url).startsWith("tel:")) {
      window.location.href = url;
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openCategory(categoryKey) {
    writeExplorerHistory({ step: "results", category: categoryKey, selectedIndex: 0 });
    setCategory(categoryKey);
    setSelectedIndex(0);
    setStep("results");
  }

  function changeCountry(nextCountry) {
    const nextCategory = step === "category" ? "" : category;
    writeExplorerHistory({ country: nextCountry, category: nextCategory, selectedIndex: 0 }, "replace");
    setCountry(nextCountry);
    if (step === "category") setCategory("");
    setSelectedIndex(0);
  }

  function changeLanguage(nextLanguage) {
    writeExplorerHistory({ language: nextLanguage }, "replace");
    setLanguage(nextLanguage);
  }

  function chooseCountry(nextCountry) {
    writeExplorerHistory({ country: nextCountry, selectedIndex: 0 }, "replace");
    setCountry(nextCountry);
    setSelectedIndex(0);
  }

  function chooseLanguage(nextLanguage) {
    writeExplorerHistory({ language: nextLanguage }, "replace");
    setLanguage(nextLanguage);
  }

  const switcherSelectClass = "w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-sm font-bold text-gray-950 outline-none backdrop-blur focus:border-gray-950";

  const isEmergency = category === "emergency";
  const callUrl = selectedSite?.web?.startsWith("tel:") ? selectedSite.web : null;

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
      {step === "country" && (
        <PageTransition key="country-step">
          <StepShell>
            <h1 className="mb-8 text-center text-6xl font-black tracking-[-0.07em] md:text-8xl">{t.whereTitle}</h1>
            <select value={country} onChange={(e) => chooseCountry(e.target.value)} className="w-full max-w-xl rounded-full border border-gray-300 px-6 py-5 text-center text-xl outline-none focus:border-gray-950">
              {countries.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button onClick={() => goToStep("language")} className="mt-6 rounded-full bg-gray-950 px-10 py-4 font-bold text-white">{t.continueBtn}</button>
          </StepShell>
        </PageTransition>
      )}

      {step === "language" && (
        <PageTransition key="language-step">
          <StepShell>
            <h1 className="mb-4 text-center text-6xl font-black tracking-[-0.07em] md:text-8xl">{t.languageTitle}</h1>
            <p className="mb-8 text-gray-500">{countryName}</p>
            <select value={language} onChange={(e) => chooseLanguage(e.target.value)} className="w-full max-w-xl rounded-full border border-gray-300 px-6 py-5 text-center text-xl outline-none focus:border-gray-950">
              {languages.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button onClick={() => goToStep("category")} className="mt-6 rounded-full bg-gray-950 px-10 py-4 font-bold text-white">{t.continueBtn}</button>
            <button onClick={() => goToStep("country")} className="mt-3 rounded-full bg-gray-100 px-6 py-3 font-bold text-gray-950">{t.changeCountry}</button>
          </StepShell>
        </PageTransition>
      )}

      {step === "category" && (
        <PageTransition key="category-step">
          <StepShell>
            <div className="glass w-full max-w-5xl rounded-[2rem] p-8 shadow-soft">
              <h1 className="mb-3 text-center text-5xl font-black tracking-[-0.05em]">{t.categoryTitle}</h1>
              <p className="mb-6 text-center text-gray-500">{countryName} • {language}</p>

              <div className="mb-8 grid gap-3 rounded-[1.5rem] border border-white/60 bg-white/50 p-3 shadow-sm backdrop-blur md:grid-cols-2">
                <label className="text-left">
                  <span className="mb-2 block px-1 text-xs font-black uppercase tracking-[0.2em] text-gray-500">{t.country || "Country"}</span>
                  <select
                    value={country}
                    onChange={(e) => changeCountry(e.target.value)}
                    className={switcherSelectClass}
                  >
                    {countries.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                </label>

                <label className="text-left">
                  <span className="mb-2 block px-1 text-xs font-black uppercase tracking-[0.2em] text-gray-500">{t.language || "Language"}</span>
                  <select
                    value={language}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className={switcherSelectClass}
                  >
                    {languages.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => openCategory(item.key)}
                    className={`rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-xl ${category === item.key ? "border-gray-950 bg-gray-950 text-white" : "border-gray-200 bg-white"}`}
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <strong className="mt-3 block">{labels[item.key]?.[0] || item.key}</strong>
                    <span className={category === item.key ? "text-gray-300" : "text-gray-500"}>{labels[item.key]?.[1] || "Useful travel services"}</span>
                  </button>
                ))}
              </div>
              <p className="mt-6 text-center text-sm font-semibold text-gray-500">{t.clickCategoryHint || "Click any category to open recommendations directly."}</p>
              <button onClick={() => goToStep("country")} className="mt-3 w-full rounded-full bg-gray-100 px-6 py-3 font-bold text-gray-950">{t.changeCountry || "Change country"}</button>
            </div>
          </StepShell>
        </PageTransition>
      )}

      {step === "results" && (
        <PageTransition key={`results-${category}`}>
          <main className="min-h-screen bg-white p-5 md:p-8">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[360px_1fr]">
              <aside className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-soft">
                <div className="border-b border-gray-200 p-6">
                  <button onClick={() => goBackToPreviousStep("category")} className="rounded-full bg-gray-100 px-5 py-3 font-bold">← Back</button>
                  <h2 className="mt-6 text-3xl font-black tracking-[-0.04em]">{t.recommendedSites}</h2>
                  <p className="text-gray-500">{countryName} • {labels[category]?.[0] || category} • {language}</p>

                  <div className="mt-5 grid gap-3">
                    <label>
                      <span className="mb-2 block px-1 text-xs font-black uppercase tracking-[0.2em] text-gray-500">{t.country || "Country"}</span>
                      <select
                        value={country}
                        onChange={(e) => changeCountry(e.target.value)}
                        className={switcherSelectClass}
                      >
                        {countries.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                      </select>
                    </label>
                    <label>
                      <span className="mb-2 block px-1 text-xs font-black uppercase tracking-[0.2em] text-gray-500">{t.language || "Language"}</span>
                      <select
                        value={language}
                        onChange={(e) => changeLanguage(e.target.value)}
                        className={switcherSelectClass}
                      >
                        {languages.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="flex max-h-[70vh] flex-col gap-3 overflow-auto p-4">
                  {sites.length === 0 ? (
                    <div className="rounded-3xl bg-gray-950 p-5 text-white">
                      <strong>{t.comingSoon}</strong>
                      <p className="text-sm text-gray-300">{t.noLinksYet}</p>
                    </div>
                  ) : sites.map((site, index) => {
                    const rowCallUrl = site?.web?.startsWith("tel:") ? site.web : null;
                    return (
                      <div
                        key={`${site.name}-${index}`}
                        className={`rounded-3xl border p-5 text-left transition ${selectedIndex === index ? "border-gray-950 bg-gray-950 text-white" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                      >
                        <button onClick={() => { writeExplorerHistory({ selectedIndex: index }, "replace"); setSelectedIndex(index); }} className="w-full text-left">
                          <strong>{site.name}</strong>
                          <p className={selectedIndex === index ? "text-sm text-gray-300" : "text-sm text-gray-500"}>{site.type}</p>
                        </button>
                        {rowCallUrl && (
                          <button
                            onClick={() => openLink(rowCallUrl)}
                            className={`mt-3 inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black ${selectedIndex === index ? "bg-white text-gray-950" : "bg-red-600 text-white"}`}
                          >
                            <PhoneCall size={16}/> {t.callNow || "Call Now"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </aside>

              <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-soft">
                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-4xl font-black tracking-[-0.05em]">{selectedSite?.name || t.selectWebsite}</h2>
                  <p className="text-gray-500">{selectedSite?.type || t.previewDetails}</p>

                  {selectedSite && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {callUrl ? (
                        <button onClick={() => openLink(callUrl)} className="inline-flex items-center gap-2 rounded-2xl border bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"><PhoneCall size={18}/> {t.callNow || "Call Now"}</button>
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

                <div className={`m-6 rounded-[2rem] p-9 ${isEmergency ? "bg-gradient-to-br from-red-50 to-orange-50" : "bg-gradient-to-br from-gray-50 to-indigo-50"}`}>
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
      </AnimatePresence>
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
