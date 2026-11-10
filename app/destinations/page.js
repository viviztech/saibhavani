import { ArrowUpRight } from "lucide-react";

export const metadata = { title: "Destinations | Sai Bhavani Tours & Travels", description: "Find inspiration for pilgrimages, coastal escapes, hills and heritage journeys in South India." };

const experiences = [
  { number: "01", eyebrow: "Pilgrimage", title: "Sacred journeys", description: "Explore places of worship and make time for a journey with meaning.", image: "/images/temple.jpg", alt: "A temple in Hampi" },
  { number: "02", eyebrow: "South India", title: "Coastal escapes", description: "Consider the coast for a relaxed holiday, with time to explore along the way.", image: "/images/coast.jpg", alt: "A scenic coastline" },
  { number: "03", eyebrow: "South India", title: "Hills & heritage", description: "Find inspiration in green hills, historic towns and places of worship.", image: "/images/hills.jpg", alt: "Green hills in the distance" },
];

export default function DestinationsPage() {
  return <main><section className="experiences section-pad"><div className="container">
    <div className="section-heading"><div><div className="section-kicker"><span>FIND YOUR WAY</span></div><h1 className="page-title">A little inspiration<br /><em>for the road.</em></h1></div><p>Make a pilgrimage, enjoy a scenic escape or bring the family together. Explore a few ideas for your next journey.</p></div>
    <div className="experience-grid">{experiences.map((experience) => <article className="experience-card" key={experience.number}>
      <div className="experience-image"><img src={experience.image} alt={experience.alt} loading="lazy" /><span className="card-number">{experience.number}</span></div>
      <div className="experience-body"><div><span className="card-eyebrow">{experience.eyebrow}</span><h2 className="card-title">{experience.title}</h2><p>{experience.description}</p></div><a className="card-arrow" href="/contact" aria-label={`Enquire about ${experience.title}`}><ArrowUpRight size={20} /></a></div>
    </article>)}</div>
    <p className="section-note">Destinations and imagery are for inspiration; please enquire about available routes and arrangements.</p>
  </div></section></main>;
}
