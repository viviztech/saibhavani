import { ArrowUpRight } from "lucide-react";
import EnquiryForm from "../enquiry-form";
import { business } from "../business";

export const metadata = { title: "Contact | Sai Bhavani Tours & Travels", description: "Share your travel plans and prepare an enquiry with Sai Bhavani Tours & Travels." };

export default function ContactPage() {
  const phone = business.phone.trim();
  const phoneDigits = phone.replace(/\D/g, "");
  const hasPhone = /^\+?[\d\s()-]+$/.test(phone) && phoneDigits.length >= 7 && phoneDigits.length <= 15;
  let googleProfile = "";
  try {
    const url = new URL(business.googleBusinessProfile.trim());
    if (url.protocol === "https:") googleProfile = url.href;
  } catch {
    // An empty or invalid profile URL is not shown as a link.
  }

  return <main><section className="contact-section"><div className="container contact-inner">
    <div className="contact-copy"><div className="section-kicker"><span>YOUR NEXT JOURNEY</span></div><h1 className="page-title">Tell us where you’d<br /><em>like to go.</em></h1><p>Share the details you know so far. An enquiry is the first step; dates, availability and price are confirmed separately.</p>
      <div className="contact-channels">
        {hasPhone ? <a href={`tel:${phone.startsWith("+") ? "+" : ""}${phoneDigits}`}>Call {phone}</a> : <p>Phone number pending confirmation.</p>}
        {googleProfile ? <a href={googleProfile} target="_blank" rel="noopener noreferrer">View our Google Business Profile <ArrowUpRight size={15} /></a> : <p>Google Business Profile link pending confirmation.</p>}
      </div>
    </div>
    <EnquiryForm />
  </div></section></main>;
}
