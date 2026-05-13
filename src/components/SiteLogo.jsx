import Image from "next/image";
import Link from "next/link";

export default function SiteLogo({
  compact = false,
  dark = false,
  onClick,
  className = ""
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`flex min-w-0 items-center gap-3 ${className}`}
      aria-label="Aliwvide homepage"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-md shadow-slate-950/20 ring-1 ring-white/50 sm:h-12 sm:w-12">
        <Image
          src="/brand/aliwvide-icon-512.png"
          alt="Aliwvide logo icon"
          width={48}
          height={48}
          priority
          className="h-9 w-9 object-contain sm:h-10 sm:w-10"
        />
      </span>

      {!compact && (
        <span className="min-w-0 leading-tight">
          <span
            className={`block text-lg font-black tracking-[-0.03em] sm:text-xl ${
              dark ? "text-slate-950" : "text-white"
            }`}
          >
            Aliwvide
          </span>
          <span
            className={`hidden text-xs font-semibold sm:block ${
              dark ? "text-slate-500" : "text-sky-100"
            }`}
          >
            Travel apps by country
          </span>
        </span>
      )}
    </Link>
  );
}
