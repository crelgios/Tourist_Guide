import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { hasPublicSupabaseConfig, publicSupabaseRequest } from "@/lib/supabase-rest";

export const revalidate = 300;

async function getProduct(slug) {
  if (!hasPublicSupabaseConfig()) return null;
  try {
    const rows = await publicSupabaseRequest("/shop_products", {
      query: `select=id,name,slug,category,description,price,compare_at_price,currency,images,video_url,variants,shipping_text&slug=eq.${encodeURIComponent(slug)}&active=eq.true&status=eq.active&limit=1`,
      revalidate: 300,
      tags: ["shop-products"]
    });
    return rows?.[0] || null;
  } catch (error) {
    console.error("Could not load shop product.", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product | Aliwvide Shop" };

  const image = Array.isArray(product.images) ? product.images[0] : null;
  const title = `${product.name} | Aliwvide Shop`;
  const description = product.description?.slice(0, 155) || `Shop ${product.name} on Aliwvide.`;

  return {
    title,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      type: "website",
      url: `https://www.aliwvide.com/shop/${product.slug}`,
      siteName: "Aliwvide",
      title,
      description,
      images: image ? [{ url: image, alt: product.name }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined
    }
  };
}

export default async function ProductPage({ params, searchParams }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const image = Array.isArray(product.images) ? product.images[0] : null;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: Array.isArray(product.images) ? product.images : image ? [image] : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency || "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `https://www.aliwvide.com/shop/${product.slug}`
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ProductDetail product={product} source={String(searchParams?.src || "")} />
    </>
  );
}
