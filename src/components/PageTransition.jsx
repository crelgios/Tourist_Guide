"use client";

import { usePathname } from "next/navigation";

const noTransitionPrefixes = [
  "/secure-aliwvide-control-9xq2m"
];

export default function PageTransition({ children }) {
  const pathname = usePathname() || "/";
  const isDisabled = noTransitionPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isDisabled) {
    return <>{children}</>;
  }

  return (
    <div key={pathname} className="aliwvide-page-transition">
      {children}
    </div>
  );
}
