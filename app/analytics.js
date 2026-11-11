"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./analytics.css";

const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const measurementId = /^G-[A-Z0-9]+$/.test(id) ? id : "";
const consentKey = "sai-bhavani-analytics-consent";
const scriptId = "sai-bhavani-analytics-script";
const eventName = "sai-bhavani-enquiry-submitted";

function disableAnalytics() {
  if (!measurementId) return;
  window[`ga-disable-${measurementId}`] = true;
  // Discard queued commands if the script has not finished loading. The Google
  // disable flag stops the already loaded library without installing it again.
  if (Array.isArray(window.dataLayer)) window.dataLayer.length = 0;
}

function locationForAnalytics(pathname) {
  return `${window.location.origin}${pathname || "/"}`;
}

// A deliberately empty event: no form fields, offering names, or URL query.
export function trackEnquirySubmitted() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(eventName));
}

export default function Analytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState(null);
  const [open, setOpen] = useState(false);
  const publicPage = pathname !== "/admin" && !pathname?.startsWith("/admin/");

  useEffect(() => {
    if (!measurementId) return;
    try {
      const saved = localStorage.getItem(consentKey);
      setConsent(saved === "granted" ? "granted" : saved === "denied" ? "denied" : "unset");
    } catch { setConsent("unset"); }
    const sync = (event) => {
      if (event.key !== consentKey) return;
      if (event.newValue !== "granted") disableAnalytics();
      setConsent(event.newValue === "granted" ? "granted" : "denied");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (!measurementId || consent !== "granted" || !publicPage) {
      disableAnalytics();
      return;
    }
    window[`ga-disable-${measurementId}`] = false;
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) window.gtag = function () { window.dataLayer.push(arguments); };
    if (!document.getElementById(scriptId)) window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_referrer: "",
      page_location: locationForAnalytics(pathname),
      page_title: "Sai Bhavani Tours & Travels",
    });
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.referrerPolicy = "no-referrer";
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.onerror = () => script.remove();
      document.head.appendChild(script);
    }
    const enquiry = () => window.gtag?.("event", "enquiry_submit", {
      page_location: locationForAnalytics(window.location.pathname),
      page_referrer: "",
      page_title: "Sai Bhavani Tours & Travels",
    });
    window.addEventListener(eventName, enquiry);
    return () => { window.removeEventListener(eventName, enquiry); disableAnalytics(); };
  }, [consent, publicPage]);

  useEffect(() => {
    if (consent !== "granted" || !publicPage || !measurementId) return;
    window.gtag?.("event", "page_view", {
      page_location: locationForAnalytics(pathname),
      page_referrer: "",
      page_title: "Sai Bhavani Tours & Travels",
    });
  }, [consent, pathname, publicPage]);

  function choose(value) {
    if (value !== "granted") disableAnalytics();
    try { localStorage.setItem(consentKey, value); } catch { /* Preference lasts for this visit. */ }
    setConsent(value);
    setOpen(false);
  }

  if (!measurementId || !publicPage || consent === null) return null;
  return <>
    <button type="button" className="analytics-preferences" onClick={() => setOpen(true)}>Analytics preferences</button>
    {(consent === "unset" || open) && <div className="analytics-banner" role="region" aria-label="Analytics preferences">
      <p>May we use Google Analytics to understand website visits? It is optional. You can change your choice at any time.</p>
      <div className="analytics-actions">
        <button type="button" onClick={() => choose("granted")}>Allow analytics</button>
        <button type="button" onClick={() => choose("denied")}>{consent === "granted" ? "Withdraw consent" : "Decline"}</button>
        {open && <button type="button" onClick={() => setOpen(false)}>Close</button>}
      </div>
    </div>}
  </>;
}
