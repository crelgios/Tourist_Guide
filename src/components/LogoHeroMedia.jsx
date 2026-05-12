import Image from "next/image";

export default function LogoHeroMedia() {
  return (
    <div className="relative mx-auto max-w-xl rounded-[2.5rem] bg-white/95 p-5 shadow-2xl shadow-sky-950/30 ring-1 ring-white/70 backdrop-blur">
      <div className="absolute -inset-5 -z-10 rounded-[3rem] bg-gradient-to-r from-sky-400/30 via-fuchsia-400/25 to-violet-500/30 blur-2xl" />
      <Image
        src="/brand/aliwvide-logo-full.webp"
        alt="Aliwvide - Travel apps by country"
        width={1200}
        height={675}
        priority
        sizes="(min-width: 1024px) 560px, 90vw"
        className="h-auto w-full rounded-[1.75rem] object-contain"
      />
    </div>
  );
}
