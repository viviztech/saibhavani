import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = { title: "About | Sai Bhavani Tours & Travels", description: "Learn how to begin planning a journey with Sai Bhavani Tours & Travels in Puttaparthi." };

const steps = [
  { number: "01", title: "Tell us your plans", description: "Share your travel dates, pickup and drop locations, and the number of travellers." },
  { number: "02", title: "Discuss the options", description: "The team can discuss your requirements, availability and a personalised quotation." },
  { number: "03", title: "Confirm your journey", description: "Agree on the route, price and other arrangements directly before you travel." },
];

export default function AboutPage() {
  return <main>
    <section className="intro section-pad"><div className="container intro-grid">
      <div className="section-kicker"><span>WELCOME</span></div>
      <div className="intro-main"><h1 className="page-title">Every journey has<br /><em>a purpose.</em></h1><p>Whether you are visiting Puttaparthi, spending time with family or discovering somewhere new, thoughtful planning makes the journey easier. Sai Bhavani Tours &amp; Travels welcomes your travel enquiries and the opportunity to discuss your plans.</p><a className="text-link" href="#journey">How to plan your trip <ArrowRight size={18} /></a></div>
    </div></section>
    <section className="journey section-pad" id="journey"><div className="container journey-grid">
      <div className="journey-image"><img src="/images/road.jpg" alt="An open road through a scenic landscape" loading="lazy" /><div className="image-caption"><Sparkles size={19} strokeWidth={1.4} /><span>MADE FOR THE<br />MOMENTS IN BETWEEN</span></div></div>
      <div className="journey-content"><div className="section-kicker"><span>LET’S BEGIN</span></div><h2>A little planning.<br /><em>A lot to look forward to.</em></h2><p>Every good trip begins with an idea. Here’s how to start a conversation about yours.</p><div className="steps">{steps.map((step) => <div className="step" key={step.number}><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></div>)}</div><a className="text-link" href="/contact">Enquire about a trip <ArrowRight size={18} /></a></div>
    </div></section>
  </main>;
}
