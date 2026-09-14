import ManagedTravelShop from "@/components/ManagedTravelShop";
import { hasPublicSupabaseConfig, publicSupabaseRequest } from "@/lib/supabase-rest";

const pageUrl = "https://www.aliwvide.com/shop";
const socialImage = "https://www.aliwvide.com/brand/aliwvide-og-image.jpg";

export const revalidate = 3600;

export const metadata = {
  title: "Best Travel Accessories & Travel Essentials in India | Aliwvide Shop",
  description: "Discover curated travel accessories in India including cabin luggage, travel backpacks, organizers, travel gadgets, neck pillows, adapters, power banks and flight essentials.",
  keywords: ["travel accessories India", "travel essentials India", "best travel gadgets", "travel bags India", "cabin luggage", "travel backpack", "packing cubes", "travel adapter", "travel organizer", "flight essentials", "travel products"],
  alternates: { canonical: "/shop" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", url: pageUrl, siteName: "Aliwvide", title: "Best Travel Accessories & Travel Essentials in India | Aliwvide Shop", description: "Browse curated travel bags, gadgets, organizers and flight essentials selected for smarter journeys.", images: [{ url: socialImage, width: 1200, height: 630, alt: "Aliwvide Travel Shop" }] },
  twitter: { card: "summary_large_image", title: "Best Travel Accessories & Travel Essentials in India | Aliwvide Shop", description: "Curated travel accessories, bags, gadgets, organizers and flight essentials for smarter journeys.", images: [socialImage] }
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "CollectionPage", "@id": `${pageUrl}#collection`, url: pageUrl, name: "Aliwvide Travel Shop", description: "Curated travel accessories, luggage, gadgets, organizers and travel essentials for travelers in India.", isPartOf: { "@type": "WebSite", name: "Aliwvide", url: "https://www.aliwvide.com" }, about: ["Travel accessories", "Travel essentials", "Travel luggage", "Travel gadgets", "Packing organizers"] },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.aliwvide.com/" }, { "@type": "ListItem", position: 2, name: "Travel Shop", item: pageUrl }] }
  ]
};

async function getAffiliateLinks() {
  if (!hasPublicSupabaseConfig()) return {};
  try {
    const rows = await publicSupabaseRequest("/shop_products", { query: "select=name,affiliate_url&active=eq.true&order=sort_order.asc", revalidate: 3600, tags: ["shop-products"] });
    return Object.fromEntries((rows || []).filter((row) => row?.name && row?.affiliate_url).map((row) => [row.name, row.affiliate_url]));
  } catch (error) {
    console.error("Could not load shop affiliate links from Supabase.", error);
    return {};
  }
}

export default async function ShopPage() {
  const affiliateLinks = await getAffiliateLinks();
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <ManagedTravelShop affiliateLinks={affiliateLinks} />
  </>;
}
