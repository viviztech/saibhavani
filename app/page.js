import { ArrowRight, ArrowUpRight, BusFront, CarFront, MapPin, Plane } from "lucide-react";

const services = [
  { icon: Plane, title: "Airport transfers", description: "Discuss pickup or drop-off for your journey, including travel to Puttaparthi." },
  { icon: CarFront, title: "Local journeys", description: "Explore local visits, errands or a day out at your own pace." },
  { icon: MapPin, title: "Outstation travel", description: "Share your plans for a one-way journey or a round trip further afield." },
  { icon: BusFront, title: "Group travel", description: "Discuss transport for your group and its luggage needs." },
];
const experiences = [
  { number: "01", eyebrow: "Pilgrimage", title: "Sacred journeys", description: "Make time for a journey with meaning.", image: "/images/temple.jpg", alt: "A temple in Hampi" },
  { number: "02", eyebrow: "South India", title: "Coastal escapes", description: "Find inspiration for a relaxed holiday by the coast.", image: "/images/coast.jpg", alt: "A scenic coastline" },
  { number: "03", eyebrow: "South India", title: "Hills & heritage", description: "Discover green hills, historic towns and places of worship.", image: "/images/hills.jpg", alt: "Green hills in the distance" },
];

export default function Home() {
  return <main>
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-image" src="/images/hero.jpg" alt="A scenic road through a mountain landscape" />
      <div className="hero-shade" />
      <div className="hero-content container">
        <div className="eyebrow light"><span className="line" /> JOURNEYS BEGIN IN PUTTAPARTHI</div>
        <h1 id="hero-title">Travel with<br /><em>peace of mind.</em></h1>
        <p className="hero-description">From a visit to Prasanthi Nilayam to a journey further afield, let’s talk about a trip that feels right for you.</p>
        <div className="hero-actions"><a className="button button-light" href="/contact">Enquire about a trip <ArrowUpRight size={18} /></a><a className="hero-link" href="/services">Explore travel options <ArrowRight size={16} /></a></div>
      </div>
      <div className="hero-bottom container"><span className="hero-index">SAI BHAVANI <span>/</span> TOURS &amp; TRAVELS</span><span className="hero-caption">Your journey starts with a conversation.</span></div>
    </section>
    <section className="intro section-pad"><div className="container intro-grid">
      <div className="section-kicker"><span>01 / WELCOME</span></div>
      <div className="intro-main"><h2>Every journey has<br /><em>a purpose.</em></h2><p>Whether you are visiting Puttaparthi, spending time with family or discovering somewhere new, thoughtful planning makes the journey easier. Sai Bhavani Tours &amp; Travels welcomes your travel enquiries and the opportunity to discuss your plans.</p><a className="text-link" href="/about">Get to know us <ArrowRight size={18} /></a></div>
    </div></section>
    <section className="services section-pad"><div className="container">
      <div className="section-heading"><div><div className="section-kicker"><span>02 / TRAVEL YOUR WAY</span></div><h2>Wherever you’re<br /><em>headed.</em></h2></div><p>From arriving in town to exploring further, start by telling us what kind of journey you have in mind.</p></div>
      <div className="service-grid">{services.map(({ icon: Icon, title, description }) => <article className="service-card" key={title}><span className="service-icon"><Icon size={25} strokeWidth={1.4} aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p><a className="service-link" href="/services">Explore services <ArrowUpRight size={16} /><span className="sr-only">, including {title}</span></a></article>)}</div>
      <p className="section-note">Travel options are illustrative. Services, routes, vehicles and availability are subject to confirmation.</p>
    </div></section>
    <section className="experiences section-pad"><div className="container">
      <div className="section-heading"><div><div className="section-kicker"><span>03 / FIND YOUR WAY</span></div><h2>A little inspiration<br /><em>for the road.</em></h2></div><p>Make a pilgrimage, enjoy a scenic escape or bring the family together. Explore a few ideas for your next journey.</p></div>
      <div className="experience-grid">{experiences.map((experience) => <article className="experience-card" key={experience.number}><div className="experience-image"><img src={experience.image} alt={experience.alt} loading="lazy" /><span className="card-number">{experience.number}</span></div><div className="experience-body"><div><span className="card-eyebrow">{experience.eyebrow}</span><h3>{experience.title}</h3><p>{experience.description}</p></div><a className="card-arrow" href="/destinations" aria-label={`Explore ${experience.title}`}><ArrowUpRight size={20} /></a></div></article>)}</div>
      <p className="section-note">Destinations and imagery are for inspiration; please enquire about available routes and arrangements.</p>
    </div></section>
    <section className="visitor section-pad"><div className="container intro-grid"><div className="section-kicker"><span>04 / VISITING PUTTAPARTHI</span></div><div className="intro-main"><h2>A place of<br /><em>quiet reflection.</em></h2><p>Planning a visit to Prasanthi Nilayam? Find a starting point for official visitor information and guidance on reaching the ashram.</p><a className="text-link" href="/visitor-guide">Explore the visitor guide <ArrowRight size={18} /></a></div></div></section>
    <section className="contact-section"><div className="container contact-copy"><div className="section-kicker"><span>YOUR NEXT JOURNEY</span></div><h2>Tell us where you’d<br /><em>like to go.</em></h2><p>Share the details you know so far. An enquiry is the first step; dates, availability and price are confirmed separately.</p><div className="hero-actions"><a className="button button-light" href="/contact">Plan a journey <ArrowUpRight size={18} /></a></div></div></section>
  </main>;
}
