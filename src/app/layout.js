import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://your-domain.com"),
  title: {
    default: "Tourist Guide - Best Travel Apps by Country",
    template: "%s | Tourist Guide"
  },
  description:
    "Find trusted local transport, train, metro, bus, flights, shopping, food delivery, and map apps by country.",
  keywords: [
    "best travel apps by country",
    "best taxi app by country",
    "best train app by country",
    "tourist transport apps",
    "country travel guide",
    "local apps for tourists",
    "best apps for travelers"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    siteName: "Tourist Guide",
    title: "Tourist Guide - Best Travel Apps by Country",
    description:
      "Discover trusted transport, train, metro, bus, flight, food, shopping, and map apps by country.",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tourist Guide"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tourist Guide - Best Travel Apps by Country",
    description:
      "Find trusted travel apps, transport services, and local platforms by country.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
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
