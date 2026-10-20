import { notFound } from "next/navigation";
import CheckoutPreview from "@/components/CheckoutPreview";
import { hasPublicSupabaseConfig, publicSupabaseRequest } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

async function getProduct(slug) {
  if (!slug || !hasPublicSupabaseConfig()) return null;
  try {
    const rows = await publicSupabaseRequest("/shop_products", {
      query: `select=id,name,slug,price,compare_at_price,currency,images,offers,shipping_text&slug=eq.${encodeURIComponent(slug)}&active=eq.true&status=eq.active&limit=1`,
      revalidate: 0,
      tags: ["shop-products"]
    });
    return rows?.[0] || null;
  } catch (error) {
    console.error("Could not load checkout product.", error);
    return null;
  }
}

export default async function CheckoutPage({ searchParams }) {
  const slug = String(searchParams?.product || "");
  const product = await getProduct(slug);
  if (!product) notFound();

  const selectedOptions = Object.fromEntries(
    Object.entries(searchParams || {})
      .filter(([key]) => key.startsWith("option_"))
      .map(([key, value]) => [
        key.replace(/^option_/, "").replace(/_/g, " "),
        String(value)
      ])
  );

  return (
    <CheckoutPreview
      product={product}
      offerId={String(searchParams?.offer || "single")}
      selectedOptions={selectedOptions}
      source={String(searchParams?.src || "")}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || ""}
    />
  );
}
