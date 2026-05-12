"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const hiddenNavbarPrefixes = [
  "/admin",
  "/secure-aliwvide-control-9xq2m"
];

export default function SiteShell({ children }) {
  const pathname = usePathname() || "/";

  const hideNavbar = hiddenNavbarPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
