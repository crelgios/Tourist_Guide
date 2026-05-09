import Explorer from "@/components/Explorer";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Travel App Categories",
  description: "Choose a travel category and find trusted taxi, train, metro, maps, food, shopping and tourist apps by country."
};

export default function CategoryPage() {
  return (
    <>
      <Explorer initialStep="category" />
      <Footer />
    </>
  );
}
