import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://aliwvide.com"),
  title: {
    default: "Aliwvide - Best Travel Apps by Country",
    template: "%s | Aliwvide"
  },
  description:
    "Find trusted local transport, train, metro, bus, flights, shopping, food delivery, and map apps by country.",
  keywords: [
    "Aliwvide",
    "best travel apps by country",
    "best taxi app by country",
    "best train app by country",
    "tourist transport apps",
    "country travel guide",
    "local apps for tourists"
  ],
  openGraph: {
    type: "website",
    siteName: "Aliwvide",
    title: "Aliwvide - Best Travel Apps by Country",
    description:
      "Discover trusted transport, maps, train, metro, bus, flight, shopping, and food apps by country.",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "Aliwvide - Best Travel Apps by Country",
    description: "Find trusted travel apps and local platforms by country."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
