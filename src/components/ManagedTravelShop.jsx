"use client";

import { useEffect } from "react";
import TravelShop from "@/components/TravelShop";

export default function ManagedTravelShop({ affiliateLinks = {} }) {
  useEffect(() => {
    const updateLinks = () => {
      document.querySelectorAll("#products article").forEach((card) => {
        const name = card.querySelector("h3")?.textContent?.trim();
        const link = card.querySelector("a[target='_blank']");
        const managedUrl = name ? affiliateLinks[name] : null;
        if (link && managedUrl) link.href = managedUrl;
      });
    };

    updateLinks();
    const observer = new MutationObserver(updateLinks);
    const products = document.getElementById("products");
    if (products) observer.observe(products, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [affiliateLinks]);

  return <TravelShop />;
}
