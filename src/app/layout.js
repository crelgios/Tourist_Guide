import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aliwvide.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Discover Travel Apps Used Around the World | Aliwvide",
    template: "%s | Aliwvide"
  },
  description:
    "Discover the best taxi apps, train apps, metro apps, food delivery apps and tourist travel apps used in India and around the world.",
  keywords: [
    "best taxi apps in India",
    "India travel apps",
    "Uber alternatives India",
    "metro apps India",
    "train booking apps India",
    "tourist apps India",
    "travel apps by country",
    "cab booking apps India",
    "Delhi metro apps",
    "Aliwvide"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    siteName: "Aliwvide",
    title: "Discover Travel Apps Used Around the World",
    description:
      "Compare transport, taxi, train, metro, maps, shopping, food delivery and grocery fast delivery apps used by tourists in India.",
    url: siteUrl
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Travel Apps Used Around the World",
    description:
      "Discover trusted transport and travel apps for India and worldwide travel."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
