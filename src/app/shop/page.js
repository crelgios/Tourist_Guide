import DropshippingShop from "@/components/DropshippingShop";
import { hasPublicSupabaseConfig, publicSupabaseRequest } from "@/lib/supabase-rest";

const pageUrl = "https://www.aliwvide.com/shop";
const socialImage = "https://www.aliwvide.com/brand/aliwvide-og-image.jpg";

export const revalidate = 300;

export const metadata = {
  title: "Aliwvide Shop | Products Featured on Instagram",
  description: "Shop products featured by Aliwvide. Browse product photos, options, prices and delivery information before checkout.",
  alternates: { canonical: "/shop" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: pageUrl,
    siteName: "Aliwvide",
    title: "Aliwvide Shop",
    description: "Products featured on Aliwvide and Instagram.",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Aliwvide Shop" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Aliwvide Shop",
    description: "Products featured on Aliwvide and Instagram.",
    images: [socialImage]
  }
};

async function getProducts() {
  if (!hasPublicSupabaseConfig()) return [];
  try {
    return await publicSupabaseRequest("/shop_products", {
      query: "select=id,name,slug,category,description,price,compare_at_price,currency,images,shipping_text&active=eq.true&status=eq.active&order=sort_order.asc,name.asc",
      revalidate: 300,
      tags: ["shop-products"]
    });
  } catch (error) {
    console.error("Could not load dropshipping products.", error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();
  return <DropshippingShop products={products || []} />;
}
