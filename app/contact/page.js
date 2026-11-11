import { ArrowUpRight } from "lucide-react";
import EnquiryForm from "../enquiry-form";
import { getBusinessSettings } from "../../lib/business-settings";
import { query } from "../../lib/db";
import { getPageContent, pageMetadata } from "../../lib/site-content";

export const dynamic = "force-dynamic";
const defaultMetadata = { title: "Contact for Puttaparthi Travel | Sai Bhavani Tours & Travels", description: "Send a travel enquiry for Puttaparthi, airport transfers or an outstation journey. Share your dates, route and group size." };
export function generateMetadata() { return pageMetadata("contact", defaultMetadata); }

export default async function ContactPage({ searchParams }) {
  const content = await getPageContent("contact");
  const params = await searchParams;
  const rawOffering = params?.offering;
  const slug = typeof rawOffering === "string" ? rawOffering.slice(0, 192) : rawOffering ? "invalid-offering!" : "";
  const validSlug = slug.length <= 191 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  let offering = null;
  if (validSlug) try { const rows = await query("SELECT slug, title FROM offerings WHERE slug = ? AND published = 1 LIMIT 1", [slug]); offering = rows[0] || null; } catch { /* Submission reports database availability. */ }
  const business = await getBusinessSettings();
  const phone = business.phone.trim(), phoneDigits = phone.replace(/\D/g, "");
  const hasPhone = /^\+?[\d\s()-]+$/.test(phone) && phoneDigits.length >= 7 && phoneDigits.length <= 15;
  const whatsapp = business.whatsapp.replace(/\D/g, "");
  let googleProfile = "";
  try { const url = new URL(business.googleBusinessProfile.trim()); if (url.protocol === "https:") googleProfile = url.href; } catch { /* Hidden until confirmed. */ }
  return <main><section className="contact-section"><div className="container contact-inner">
    <div className="contact-copy"><div className="section-kicker"><span>YOUR NEXT JOURNEY</span></div><h1 className="page-title">{content?.title || <>Enquire about<br /><em>your journey.</em></>}</h1><p style={{ whiteSpace: "pre-line" }}>{content?.body || "Tell us where and when you would like to travel, including your pickup and drop-off points, number of travellers and luggage needs. You can ask about travel to Puttaparthi, airport transfers or a longer trip."}</p>
      <div className="contact-channels">
        {hasPhone && <a href={`tel:${phone.startsWith("+") ? "+" : ""}${phoneDigits}`}>Call {phone}</a>}
        {/^\d{8,15}$/.test(whatsapp) && <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">Message on WhatsApp <ArrowUpRight size={15} /></a>}
        {business.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email) && <a href={`mailto:${business.email}`}>Email {business.email}</a>}
        {business.address && <p>{business.address}</p>}
        {googleProfile && <a href={googleProfile} target="_blank" rel="noopener noreferrer">View our Google Business Profile <ArrowUpRight size={15} /></a>}
      </div>
    </div>
    <div>{slug && !offering && <p className="contact-unavailable" role="status">This offering could not be loaded. Please try again or return to the catalogue.</p>}<EnquiryForm offering={slug} offeringTitle={offering?.title || ""} /></div>
  </div></section><section className="intro section-pad"><div className="container intro-grid"><div className="section-kicker"><span>BEFORE YOU ENQUIRE</span></div><div className="intro-main"><h2>What happens next?</h2><p>Your submission is an enquiry, not a confirmed booking. Discuss availability, the vehicle, the total price and any additional charges directly before agreeing to travel. For an airport pickup, include your flight details and expected arrival time once you have them.</p><a className="text-link" href="/services">Explore travel services <ArrowUpRight size={16} /></a></div></div></section></main>;
}
