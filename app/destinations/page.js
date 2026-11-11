import { ArrowUpRight } from "lucide-react";
import { getPageContent, pageMetadata } from "../../lib/site-content";

export const dynamic = "force-dynamic";
const defaultMetadata = {
  title: "Puttaparthi & South India Travel Ideas | Sai Bhavani Tours & Travels",
  description: "Plan a Puttaparthi visit or enquire about a South India journey. Explore Prasanthi Nilayam, local museums, heritage and pilgrimage ideas.",
};
export function generateMetadata() { return pageMetadata("destinations", defaultMetadata); }

const experiences = [
  { number: "01", eyebrow: "Puttaparthi", title: "Prasanthi Nilayam & local visits", description: "Plan time around Prasanthi Nilayam, the ashram of Sri Sathya Sai Baba. The Chaitanya Jyoti Museum and Sanathana Samskruti Museum are also places to consider; check visitor access and current hours before setting out." },
  { number: "02", eyebrow: "Andhra Pradesh & Karnataka", title: "Pilgrimage & heritage", description: "Ask about an itinerary that takes in places such as Lepakshi or Kadiri. Share the temples or heritage sites you want to visit and allow time for your chosen stops." },
  { number: "03", eyebrow: "Further afield", title: "Hills, coast & family journeys", description: "For a longer break, explore ideas across South India, from hill country to the coast. Let us know your interests, travel dates and group size when discussing a route." },
];

const questions = [
  { question: "What can I visit in Puttaparthi?", answer: "Prasanthi Nilayam is the main ashram associated with Sri Sathya Sai Baba. Visitors may also wish to check the Chaitanya Jyoti Museum, Sanathana Samskruti Museum and Sri Sathya Sai Space Theatre. Access and schedules can change, so verify them with the respective visitor information sources." },
  { question: "How should I plan a visit to Prasanthi Nilayam?", answer: "Check the current visitor guidance and programme schedule before travelling. Leave room in your itinerary for your arrival, local transport and any visits you want to make, and confirm accommodation directly with the provider." },
  { question: "Can I enquire about a customised itinerary?", answer: "Yes. Send your proposed destinations, dates, group size and pickup point. Routes, transport and other arrangements can be discussed and are subject to availability." },
];

export default async function DestinationsPage() {
  const content = await getPageContent("destinations");
  return <main><section className="experiences section-pad"><div className="container">
    <div className="section-heading"><div><div className="section-kicker"><span>FIND YOUR WAY</span></div><h1 className="page-title">{content?.title || <>Explore from<br /><em>Puttaparthi.</em></>}</h1></div><p style={{ whiteSpace: "pre-line" }}>{content?.body || "Visit Puttaparthi’s places of interest or start planning a longer South India journey around the places that matter to you."}</p></div>
    <div className="experience-grid">{experiences.map((experience) => <article className="service-card card rounded-4 shadow-sm" key={experience.number}>
      <span className="card-eyebrow">{experience.number} / {experience.eyebrow}</span><h2 className="card-title mt-3">{experience.title}</h2><p>{experience.description}</p><a className="service-link" href="/contact">Enquire <ArrowUpRight size={16} /><span className="sr-only"> about {experience.title}</span></a>
    </article>)}</div>
    <p className="section-note">These are travel ideas; routes and arrangements are subject to confirmation.</p>
    <div className="row g-4 mt-5"><div className="col-lg-4"><div className="section-kicker"><span>VISITOR GUIDE</span></div><h2 className="mt-3">Planning your visit</h2><p>Start with the places you want to see, then build a journey around your time and interests.</p></div><div className="col-lg-8">{questions.map(({ question, answer }) => <article className="border-bottom pb-3 mb-3" key={question}><h3 className="h5">{question}</h3><p className="mb-0">{answer}</p></article>)}<p>For information about local attractions and visitor access, see the <a href="https://www.srisathyasai.org/pages/sai-prasanthi-nilayam-poi.html" target="_blank" rel="noopener noreferrer">Sri Sathya Sai Central Trust’s places of interest</a>. To discuss transport, see our <a href="/services">travel services</a> or <a href="/contact">contact us</a>.</p></div></div>
  </div></section></main>;
}
