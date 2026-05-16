import "./globals.css";
import Script from "next/script";
import SiteShell from "@/components/SiteShell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aliwvide.com";

export const viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Aliwvide",
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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Aliwvide",
    statusBarStyle: "black-translucent"
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  openGraph: {
    type: "website",
    siteName: "Aliwvide",
    title: "Discover Travel Apps Used Around the World",
    description:
      "Compare transport, taxi, train, metro, maps, shopping, food delivery and grocery fast delivery apps used by tourists in India.",
    url: siteUrl,
    images: [
      {
        url: "/brand/aliwvide-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aliwvide travel apps by country logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Travel Apps Used Around the World",
    description:
      "Discover trusted transport and travel apps for India and worldwide travel.",
    images: ["/brand/aliwvide-og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true
  },
  other: {
    "google-adsense-account": "ca-pub-6039065775977708"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6039065775977708"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2QF326WF22"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-2QF326WF22');
          `}
        </Script>

        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
