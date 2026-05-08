import Explorer from "@/components/Explorer";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Explore Travel Apps by Country",
  description: "Select country and language to find trusted apps for transport, maps, trains, flights, shopping, and food."
};

export default function ExplorePage() {
  return (
    <>
      <Explorer />
      <Footer />
    </>
  );
}
