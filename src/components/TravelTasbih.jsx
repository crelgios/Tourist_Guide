"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Minus, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "aliwvide-travel-tasbih-v1";

const dhikrOptions = [
  { id: "subhanallah", label: "SubhanAllah", arabic: "سُبْحَانَ ٱللَّٰهِ", meaning: "Glory be to Allah" },
  { id: "alhamdulillah", label: "Alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ", meaning: "All praise is for Allah" },
  { id: "allahuakbar", label: "Allahu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ", meaning: "Allah is the Greatest" },
  { id: "astaghfirullah", label: "Astaghfirullah", arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", meaning: "I seek forgiveness from Allah" }
];

const targets = [33, 99, 100];

export default function TravelTasbih() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [dhikrId, setDhikrId] = useState("subhanallah");
  const [vibration, setVibration] = useState(true);
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const lastTap = useRef(0);

  const dhikr = useMemo(
    () => dhikrOptions.find((item) => item.id === dhikrId) || dhikrOptions[0],
    [dhikrId]
  );

  const progress = Math.min(100, target > 0 ? (count / target) * 100 : 0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved) {
        setCount(Number(saved.count) || 0);
        setTarget(targets.includes(Number(saved.target)) ? Number(saved.target) : 33);
        if (dhikrOptions.some((item) => item.id === saved.dhikrId)) setDhikrId(saved.dhikrId);
        setVibration(saved.vibration !== false);
      }
    } catch (_) {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, target, dhikrId, vibration }));
  }, [count, target, dhikrId, vibration, ready]);

  function vibrate(pattern = 18) {
    if (vibration && typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(pattern);
  }

  function increment() {
    const now = Date.now();
    if (now - lastTap.current < 120) return;
    lastTap.current = now;

    setCount((current) => {
      const next = current + 1;
      if (next === target) {
        setCompleted(true);
        vibrate([45, 45, 90]);
        window.setTimeout(() => setCompleted(false), 1700);
      } else {
        vibrate();
      }
      return next;
    });
  }

  function decrement() {
    setCount((current) => Math.max(0, current - 1));
    vibrate(10);
  }

  function reset() {
    if (!window.confirm("Reset the current Tasbih count?")) return;
    setCount(0);
    setCompleted(false);
    vibrate(25);
  }

  function changeDhikr(nextId) {
    setDhikrId(nextId);
    setCount(0);
    setCompleted(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/tools" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700">
            <ArrowLeft className="h-4 w-4" /> Travel Tools
          </Link>
          <div className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-800">Count saved on this device</div>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-slate-950 text-white shadow-2xl shadow-emerald-900/10">
          <div className="grid lg:grid-cols-[1.1fr_.9fr]">
            <div className="relative px-5 py-8 text-center sm:px-10 sm:py-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,.28),_transparent_42%)]" />
              <div className="relative">
                <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
                  <Sparkles className="h-3.5 w-3.5" /> Digital Tasbih for Travellers
                </div>

                <div className="mt-5 min-h-[132px]">
                  <div className="text-4xl font-bold leading-relaxed text-emerald-300 sm:text-5xl" dir="rtl">{dhikr.arabic}</div>
                  <h1 className="mt-2 text-2xl font-black sm:text-3xl">{dhikr.label}</h1>
                  <p className="mt-1 text-sm text-slate-400">{dhikr.meaning}</p>
                </div>

                <div className="mx-auto mt-4 w-full max-w-md">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>{count} counted</span>
                    <span>Target {target}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-emerald-400 transition-all duration-200" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <button type="button" onClick={increment} className="relative mx-auto mt-8 grid h-52 w-52 select-none place-items-center rounded-full border-[10px] border-emerald-300/20 bg-gradient-to-br from-emerald-300 to-emerald-600 shadow-[0_25px_70px_rgba(16,185,129,.3)] transition active:scale-95 sm:h-60 sm:w-60" aria-label="Increase Tasbih count">
                  <span className="text-6xl font-black tabular-nums text-white sm:text-7xl">{count}</span>
                  <span className="absolute bottom-10 text-[10px] font-black uppercase tracking-[0.28em] text-emerald-950/70">Tap</span>
                </button>

                <div className="mt-6 flex justify-center gap-3">
                  <button type="button" onClick={decrement} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 transition hover:bg-white/10"><Minus className="h-4 w-4" /> Undo one</button>
                  <button type="button" onClick={reset} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 transition hover:bg-white/10"><RotateCcw className="h-4 w-4" /> Reset</button>
                </div>
              </div>
            </div>

            <aside className="border-t border-white/10 bg-white/[0.04] p-5 sm:p-8 lg:border-l lg:border-t-0">
              <h2 className="text-lg font-black">Choose dhikr</h2>
              <div className="mt-4 grid gap-2">
                {dhikrOptions.map((item) => (
                  <button key={item.id} type="button" onClick={() => changeDhikr(item.id)} className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${dhikrId === item.id ? "border-emerald-400 bg-emerald-400/15" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                    <div>
                      <div className="font-bold">{item.label}</div>
                      <div className="mt-0.5 text-xs text-slate-400" dir="rtl">{item.arabic}</div>
                    </div>
                    {dhikrId === item.id && <Check className="h-5 w-5 text-emerald-300" />}
                  </button>
                ))}
              </div>

              <h2 className="mt-7 text-lg font-black">Target</h2>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {targets.map((value) => (
                  <button key={value} type="button" onClick={() => setTarget(value)} className={`rounded-2xl border px-3 py-3 font-black transition ${target === value ? "border-emerald-400 bg-emerald-400 text-slate-950" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>{value}</button>
                ))}
              </div>

              <button type="button" onClick={() => setVibration((value) => !value)} className="mt-6 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10">
                <div>
                  <div className="font-bold">Tap vibration</div>
                  <div className="text-xs text-slate-400">Useful when counting without watching the screen</div>
                </div>
                {vibration ? <Volume2 className="h-5 w-5 text-emerald-300" /> : <VolumeX className="h-5 w-5 text-slate-500" />}
              </button>

              <div className="mt-6 rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">Your Tasbih progress is stored locally in this browser. No sign-in is required.</div>
            </aside>
          </div>
        </section>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-slate-500">Aliwvide Travel Tools are designed to be simple to use on a phone while you are away from home. Keep this page bookmarked for quick access during your journey.</p>
      </div>

      {completed && (
        <div className="fixed inset-x-4 bottom-6 z-[70] mx-auto flex max-w-md items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-center font-black text-white shadow-2xl"><Check className="h-5 w-5" /> Target {target} reached</div>
      )}
    </main>
  );
}
