import { ArrowRight, Sparkles } from "lucide-react";
import { getPageContent, pageMetadata, safePageImage } from "../../lib/site-content";

export const dynamic = "force-dynamic";
const defaultMetadata = { title: "About Our Travel Planning | Sai Bhavani Tours & Travels", description: "Learn how to discuss a travel enquiry, compare journey details and confirm arrangements with Sai Bhavani Tours & Travels." };
export function generateMetadata() { return pageMetadata("about", defaultMetadata); }

const steps = [
  { number: "01", title: "Tell us your plans", description: "Share your travel dates, pickup and drop locations, and the number of travellers." },
  { number: "02", title: "Discuss the options", description: "The team can discuss your requirements, availability and a personalised quotation." },
  { number: "03", title: "Confirm your journey", description: "Agree on the route, price and other arrangements directly before you travel." },
];

export default async function AboutPage() {
  const content = await getPageContent("about");
  return <main>
    <section className="intro section-pad"><div className="container intro-grid">
      <div className="section-kicker"><span>WELCOME</span></div>
      <div className="intro-main"><h1 className="page-title">{content?.title || <>Every journey has<br /><em>a purpose.</em></>}</h1><p style={{ whiteSpace: "pre-line" }}>{content?.body || "A well-planned journey begins with the details that matter to you. Sai Bhavani Tours & Travels welcomes enquiries for travel plans, whether you are organising a family trip, a pilgrimage or a journey between destinations."}</p><a className="text-link" href="#journey">How to plan your trip <ArrowRight size={18} /></a></div>
    </div></section>
    <section className="journey section-pad" id="journey"><div className="container journey-grid">
      <div className="journey-image"><img src={safePageImage(content?.image_url) || "/images/road.jpg"} alt={safePageImage(content?.image_url) ? "" : "An open road through a scenic landscape"} loading="lazy" /><div className="image-caption"><Sparkles size={19} strokeWidth={1.4} /><span>MADE FOR THE<br />MOMENTS IN BETWEEN</span></div></div>
      <div className="journey-content"><div className="section-kicker"><span>LET’S BEGIN</span></div><h2>A little planning.<br /><em>A lot to look forward to.</em></h2><p>Every good trip begins with an idea. Here’s how to start a conversation about yours.</p><div className="steps">{steps.map((step) => <div className="step" key={step.number}><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></div>)}</div><a className="text-link" href="/contact">Enquire about a trip <ArrowRight size={18} /></a></div>
    </div></section>
    <section className="section-pad"><div className="container">
      <div className="section-heading"><div><div className="section-kicker"><span>BEFORE YOU TRAVEL</span></div><h2>Make the details<br /><em>work for you.</em></h2></div><p>A useful enquiry includes more than a destination. Sharing the practical details helps you have a clearer conversation about your trip.</p></div>
      <div className="row g-4">
        <article className="col-md-4"><div className="service-card card rounded-4 shadow-sm h-100"><h3 className="card-title">Describe your journey</h3><p>Include your starting point, destination, travel dates and whether you need a one-way or return journey. Mention stops you would like to make along the way.</p></div></article>
        <article className="col-md-4"><div className="service-card card rounded-4 shadow-sm h-100"><h3 className="card-title">Share your needs</h3><p>Let the team know your group size, luggage and any accessibility requirements. This helps start a discussion about suitable arrangements.</p></div></article>
        <article className="col-md-4"><div className="service-card card rounded-4 shadow-sm h-100"><h3 className="card-title">Confirm before you go</h3><p>Check the itinerary, total price, what is included, payment terms and cancellation conditions directly before making a booking.</p></div></article>
      </div>
      <p className="section-note">An enquiry is a request for information, not a confirmed booking. Routes, services and availability must be confirmed directly.</p>
      <a className="text-link" href="/contact">Send an enquiry <ArrowRight size={18} /></a>
    </div></section>
  </main>;
}
