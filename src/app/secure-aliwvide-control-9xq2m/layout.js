export const metadata = {
  title: "Secure Data Manager",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nocache: true
    }
  }
};

export default function SecureAdminLayout({ children }) {
  return children;
}
