import { ArrowUpRight, BusFront, CarFront, MapPin, Plane } from "lucide-react";

export const metadata = { title: "Travel Services | Sai Bhavani Tours & Travels", description: "Discuss airport transfers, local journeys, outstation travel and group travel from Puttaparthi." };

const services = [
  { icon: Plane, title: "Airport transfers", description: "Ask about pickup or drop-off between the airport and your destination, including Puttaparthi." },
  { icon: CarFront, title: "Local journeys", description: "Discuss a car for local visits, errands or a day exploring at your own pace." },
  { icon: MapPin, title: "Outstation travel", description: "Share your route and dates for a journey beyond the city, whether it is one way or a round trip." },
  { icon: BusFront, title: "Group travel", description: "Tell us your group size and luggage needs when enquiring about suitable transport." },
];

export default function ServicesPage() {
  return <main><section className="services section-pad"><div className="container">
    <div className="section-heading"><div><div className="section-kicker"><span>TRAVEL YOUR WAY</span></div><h1 className="page-title">Wherever you’re<br /><em>headed.</em></h1></div><p>From arriving in town to exploring further, start by telling us what kind of journey you have in mind.</p></div>
    <div className="service-grid">{services.map(({ icon: Icon, title, description }) => <article className="service-card" key={title}>
      <span className="service-icon"><Icon size={25} strokeWidth={1.4} aria-hidden="true" /></span><h2 className="card-title">{title}</h2><p>{description}</p><a className="service-link" href="/contact">Enquire <ArrowUpRight size={16} /><span className="sr-only"> about {title}</span></a>
    </article>)}</div>
    <p className="section-note">Travel options are illustrative. Services, routes, vehicles and availability are subject to confirmation.</p>
  </div></section></main>;
}
