import './globals.css';

export const metadata = {
  title: { default: 'Aliwvide', template: '%s | Aliwvide' },
  description: 'Discover the best travel, transport, taxi, metro, train, food delivery, navigation, shopping, grocery, and tourist apps worldwide.',
  keywords: ['best travel apps','transport apps','taxi apps','metro apps','train apps','food delivery apps','grocery delivery apps','tourist apps','India travel guide','Aliwvide'],
  metadataBase: new URL('https://www.aliwvide.com'),
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico', apple: '/apple-touch-icon.png' },
  openGraph: {
    title: 'Aliwvide - Best Travel App Guide Worldwide',
    description: 'Find trusted travel, taxi, metro, train, grocery, food delivery, shopping, and tourist apps by country.',
    url: 'https://www.aliwvide.com',
    siteName: 'Aliwvide',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Aliwvide Compass Logo' }],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aliwvide',
    description: 'Best travel and transport app guide worldwide.',
    images: ['/og-image.png']
  }
};

export const viewport = { themeColor: '#0f332b' };

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
