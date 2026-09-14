import QiblaFinder from "@/components/QiblaFinder";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aliwvide.com";

export const metadata = {
  title: "Qibla Finder Online | Find Qibla Direction | Aliwvide",
  description: "Find the Qibla direction from your current location with Aliwvide's browser-based Qibla Finder. Get the bearing toward the Kaaba in Makkah and use a live compass on supported phones.",
  alternates: { canonical: "/tools/qibla" },
  openGraph: {
    title: "Qibla Finder | Aliwvide",
    description: "Use your location to find the direction of the Kaaba in Makkah.",
    url: `${siteUrl}/tools/qibla`,
    siteName: "Aliwvide",
    type: "website"
  },
  robots: { index: true, follow: true }
};

export default function QiblaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/50 px-4 py-10 sm:px-6 sm:py-14">
      <QiblaFinder />
    </main>
  );
}
