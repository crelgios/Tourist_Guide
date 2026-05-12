import Explorer from "@/components/Explorer";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Explore Travel Apps by Country",
  description:
    "Select a country and language to find trusted apps for transport, maps, trains, flights, shopping, food delivery and emergency help.",
  alternates: { canonical: "/explore" }
};

export default function ExplorePage() {
  return (
    <>
      <Explorer />
      <Footer />
    </>
  );
}
