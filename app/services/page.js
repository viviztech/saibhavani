import { ArrowUpRight, BusFront, CarFront, MapPin, Plane } from "lucide-react";
import { getPageContent, pageMetadata } from "../../lib/site-content";

export const dynamic = "force-dynamic";
const defaultMetadata = {
  title: "Puttaparthi Taxi & Travel Services | Sai Bhavani Tours & Travels",
  description: "Enquire about Puttaparthi airport transfers, local taxis, outstation journeys and group travel. Share your route for a personalised quote.",
};
export function generateMetadata() { return pageMetadata("services", defaultMetadata); }

const services = [
  { icon: Plane, title: "Airport transfers", description: "Planning a journey between Bengaluru airport and Puttaparthi? Share your flight arrival or departure time, pickup point and luggage needs when you enquire." },
  { icon: CarFront, title: "Local journeys", description: "Ask about transport for visits around Puttaparthi, including Prasanthi Nilayam and local places of interest. Tell us where you would like to stop and how long you need." },
  { icon: MapPin, title: "Outstation travel", description: "Discuss a one-way or return journey from Puttaparthi. Your dates, stops and preferred pace help us understand the trip you have in mind." },
  { icon: BusFront, title: "Group travel", description: "Travelling with family, friends or a pilgrim group? Let us know your passenger count and luggage so that suitable transport options can be discussed." },
];

const questions = [
  { question: "How do I enquire about a Bengaluru airport to Puttaparthi transfer?", answer: "Send your travel date, flight time, pickup and drop-off locations, number of passengers and luggage details. Ask for the vehicle, total price and pickup arrangements to be confirmed before booking." },
  { question: "What should I check in a travel quote?", answer: "Confirm the route, vehicle, passenger capacity, waiting time and whether tolls, parking, driver allowances or additional stops are included. The terms depend on the journey you request." },
  { question: "Can I request a one-way or multi-day trip?", answer: "You can enquire about either. Share your itinerary, dates and any overnight stops; the team can confirm whether the arrangements are available and provide a quote." },
];

export default async function ServicesPage() {
  const content = await getPageContent("services");
  return <main><section className="services section-pad"><div className="container">
    <div className="section-heading"><div><div className="section-kicker"><span>TRAVEL YOUR WAY</span></div><h1 className="page-title">{content?.title || <>Travel services<br /><em>from Puttaparthi.</em></>}</h1></div><p style={{ whiteSpace: "pre-line" }}>{content?.body || "From an airport arrival to a local visit or a longer journey, tell us where you are going and what your trip needs."}</p></div>
    <div className="service-grid">{services.map(({ icon: Icon, title, description }) => <article className="service-card card rounded-4 shadow-sm" key={title}>
      <span className="service-icon"><Icon size={25} strokeWidth={1.4} aria-hidden="true" /></span><h2 className="card-title">{title}</h2><p>{description}</p><a className="service-link" href="/contact">Enquire <ArrowUpRight size={16} /><span className="sr-only"> about {title}</span></a>
    </article>)}</div>
    <p className="section-note">Routes, vehicles, prices and availability are confirmed for each enquiry.</p>
    <div className="row g-4 mt-5"><div className="col-lg-4"><div className="section-kicker"><span>PLAN WITH CONFIDENCE</span></div><h2 className="mt-3">Questions before you travel</h2><p>Every itinerary is different. These details help make your enquiry more useful.</p></div><div className="col-lg-8">{questions.map(({ question, answer }) => <article className="border-bottom pb-3 mb-3" key={question}><h3 className="h5">{question}</h3><p className="mb-0">{answer}</p></article>)}<p>Looking for ideas? Explore <a href="/destinations">destinations and local visits</a>, or <a href="/contact">send us your travel details</a>.</p></div></div>
  </div></section></main>;
}
