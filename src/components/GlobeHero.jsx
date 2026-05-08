"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function GlobeHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#020817] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(59,130,246,.45),transparent_32%),radial-gradient(circle_at_35%_70%,rgba(168,85,247,.22),transparent_30%)]" />
      <div className="absolute right-[-12vw] top-[8vh] h-[72vw] max-h-[780px] w-[72vw] max-w-[780px] rounded-full border border-blue-300/25 bg-[radial-gradient(circle_at_35%_30%,#60a5fa,#0f172a_42%,#020617_68%)] shadow-[0_0_110px_rgba(59,130,246,.35)]">
        <div className="absolute inset-10 rounded-full border border-white/10" />
        <div className="absolute left-[25%] top-[32%] rounded-full bg-emerald-400 px-4 py-2 text-sm font-bold text-white shadow-lg">India</div>
        <div className="absolute left-[9%] top-[18%] rounded-full bg-violet-400 px-4 py-2 text-sm font-bold text-white shadow-lg">Europe</div>
        <div className="absolute bottom-[22%] right-[12%] rounded-full bg-orange-400 px-4 py-2 text-sm font-bold text-white shadow-lg">Australia</div>
      </div>

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3 text-2xl font-extrabold">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500">🌍</span>
          Tourist Guide
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/">Home</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/faq">FAQ</Link>
        </div>
      </nav>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-3 text-blue-200">
            Explore trusted apps by country
          </div>
          <h1 className="text-6xl font-black leading-tight tracking-[-0.07em] md:text-8xl">
            Your Journey, <span className="text-blue-400">Our Guide</span>
          </h1>
          <p className="mt-7 max-w-xl text-xl leading-8 text-gray-300">
            Discover trusted local transport, maps, trains, buses, flights, food and shopping apps before you travel.
          </p>
          <Link
            href="/explore"
            className="mt-10 inline-flex rounded-full bg-white px-7 py-4 text-lg font-bold text-gray-950 shadow-2xl transition hover:scale-105"
          >
            Start exploring →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
