import Image from "next/image";

export default function LogoHeroMedia() {
  return (
    <div className="relative mx-auto max-w-lg" aria-label="Aliwvide brand logo">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-r from-sky-400/25 via-fuchsia-400/20 to-emerald-300/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[0.06] p-8 text-center shadow-2xl shadow-sky-950/30 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.18),transparent_42%)]" />
        <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <Image
          src="/brand/aliwvide-icon-512.png"
          alt="Aliwvide travel apps icon"
          width={512}
          height={512}
          priority
          sizes="(min-width: 1024px) 260px, 60vw"
          className="relative mx-auto h-52 w-52 object-contain drop-shadow-2xl md:h-64 md:w-64"
        />

        <div className="relative mt-2">
          <p className="text-5xl font-black tracking-[-0.06em] text-white drop-shadow-sm md:text-6xl">
            Aliwvide
          </p>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.24em] text-sky-100 md:text-base">
            Travel apps by country
          </p>
        </div>
      </div>
    </div>
  );
}
