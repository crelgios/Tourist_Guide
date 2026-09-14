import TravelTasbih from "@/components/TravelTasbih";

export const metadata = {
  title: "Digital Tasbih for Travellers",
  description:
    "Use Aliwvide's mobile-friendly digital Tasbih while travelling. Choose a dhikr, set a target and keep your count saved on your device.",
  alternates: {
    canonical: "/tools/tasbih"
  },
  openGraph: {
    title: "Digital Tasbih for Travellers | Aliwvide",
    description:
      "A simple mobile-friendly digital Tasbih for travellers, with saved progress, dhikr selection and tap vibration.",
    url: "/tools/tasbih",
    type: "website"
  }
};

export default function TasbihPage() {
  return <TravelTasbih />;
}
