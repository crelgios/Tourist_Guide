"use client";

import { useMemo, useState } from "react";

function normalizeUrl(url) {
  if (!url) return "https://www.aliwvide.com";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}${url.startsWith("/") ? url : `/${url}`}`;
  }

  return `https://www.aliwvide.com${url.startsWith("/") ? url : `/${url}`}`;
}

function openSharePopup(url, name) {
  if (typeof window === "undefined") return;

  const width = 680;
  const height = 620;
  const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
  const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

  window.open(
    url,
    name,
    `noopener,noreferrer,width=${width},height=${height},left=${left},top=${top}`
  );
}

export function createShareLinks({ url, title, description }) {
  const cleanUrl = normalizeUrl(url);
  const cleanTitle = title || "Aliwvide travel guide";
  const cleanDescription = description || "Discover useful travel apps by country on Aliwvide.";
  const whatsappText = `${cleanTitle}\n\n${cleanDescription}\n\nRead here: ${cleanUrl}`;
  const xText = `${cleanTitle}\n\n${cleanDescription}`;

  return {
    url: cleanUrl,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}&quote=${encodeURIComponent(cleanTitle)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(cleanUrl)}&text=${encodeURIComponent(xText)}`
  };
}

export default function SocialShareButtons({ url, title, description, compact = false }) {
  const [copied, setCopied] = useState(false);

  const shareLinks = useMemo(
    () => createShareLinks({ url, title, description }),
    [url, title, description]
  );

  async function handleNativeShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title || "Aliwvide travel guide",
          text: description || "Discover useful travel apps by country on Aliwvide.",
          url: shareLinks.url
        });
        return;
      }

      await handleCopy();
    } catch (error) {
      // User cancelled native share. No action needed.
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareLinks.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
    }
  }

  const baseButton = compact
    ? "rounded-full px-4 py-2 text-sm font-bold transition"
    : "rounded-full px-5 py-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5";

  return (
    <div className="flex flex-wrap gap-3" aria-label="Share this blog post">
      <button
        type="button"
        onClick={handleNativeShare}
        className={`${baseButton} bg-slate-950 text-white hover:bg-slate-800`}
      >
        Share
      </button>

      <button
        type="button"
        onClick={() => openSharePopup(shareLinks.whatsapp, "share-whatsapp")}
        className={`${baseButton} bg-green-600 text-white hover:bg-green-700`}
      >
        WhatsApp
      </button>

      <button
        type="button"
        onClick={() => openSharePopup(shareLinks.facebook, "share-facebook")}
        className={`${baseButton} bg-blue-600 text-white hover:bg-blue-700`}
      >
        Facebook
      </button>

      <button
        type="button"
        onClick={() => openSharePopup(shareLinks.twitter, "share-twitter")}
        className={`${baseButton} bg-black text-white hover:bg-slate-800`}
      >
        X / Twitter
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className={`${baseButton} border border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700`}
      >
        {copied ? "Copied" : "Copy Link"}
      </button>
    </div>
  );
}
