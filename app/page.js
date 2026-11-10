import { ArrowDown, ArrowRight, ArrowUpRight, BusFront, CarFront, Compass, MapPin, Plane, Sparkles } from "lucide-react";
import EnquiryForm from "./enquiry-form";
import { business } from "./business";

const services = [
  { icon: Plane, title: "Airport transfers", description: "Ask about pickup or drop-off between the airport and your destination, including Puttaparthi." },
  { icon: CarFront, title: "Local journeys", description: "Discuss a car for local visits, errands or a day exploring at your own pace." },
  { icon: MapPin, title: "Outstation travel", description: "Share your route and dates for a journey beyond the city, whether it is one way or a round trip." },
  { icon: BusFront, title: "Group travel", description: "Tell us your group size and luggage needs when enquiring about suitable transport." },
];

const experiences = [
  { number: "01", eyebrow: "Pilgrimage", title: "Sacred journeys", description: "Explore places of worship and make time for a journey with meaning.", image: "/images/temple.jpg", alt: "A temple in Hampi" },
  { number: "02", eyebrow: "South India", title: "Coastal escapes", description: "Consider the coast for a relaxed holiday, with time to explore along the way.", image: "/images/coast.jpg", alt: "A scenic coastline" },
  { number: "03", eyebrow: "South India", title: "Hills & heritage", description: "Find inspiration in green hills, historic towns and places of worship.", image: "/images/hills.jpg", alt: "Green hills in the distance" },
];

const steps = [
  { number: "01", title: "Tell us your plans", description: "Share your travel dates, pickup and drop locations, and the number of travellers." },
  { number: "02", title: "Discuss the options", description: "The team can discuss your requirements, availability and a personalised quotation." },
  { number: "03", title: "Confirm your journey", description: "Agree on the route, price and other arrangements directly before you travel." },
];

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Sai Bhavani Tours and Travels, home">
      <span className="brand-mark" aria-hidden="true"><Compass size={25} strokeWidth={1.4} /></span>
      <span className="brand-copy"><strong>Sai Bhavani</strong><span>TOURS &amp; TRAVELS</span></span>
    </a>
  );
}

export default function Home() {
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

  return (
    <>
      <header className="site-header">
        <div className="nav-shell container">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#services">Services</a>
            <a href="#experiences">Destinations</a>
            <a href="#visitor-guide">Visitor guide</a>
            <a href="#about">About</a>
          </nav>
          <a className="nav-cta" href="#contact">Plan a journey <ArrowUpRight size={16} /></a>
        </div>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <img className="hero-image" src="/images/hero.jpg" alt="A scenic road through a mountain landscape" />
          <div className="hero-shade" />
          <div className="hero-content container">
            <div className="eyebrow light"><span className="line" /> JOURNEYS BEGIN IN PUTTAPARTHI</div>
            <h1 id="hero-title">Travel with<br /><em>peace of mind.</em></h1>
            <p className="hero-description">From a visit to Prasanthi Nilayam to a journey further afield, let’s talk about a trip that feels right for you.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#contact">Enquire about a trip <ArrowUpRight size={18} /></a>
              <a className="hero-link" href="#services">Explore travel options <ArrowDown size={16} /></a>
            </div>
          </div>
          <div className="hero-bottom container"><span className="hero-index">SAI BHAVANI <span>/</span> TOURS &amp; TRAVELS</span><span className="hero-caption">Your journey starts with a conversation.</span></div>
        </section>

        <section className="intro section-pad" id="about">
          <div className="container intro-grid">
            <div className="section-kicker"><span>01 / WELCOME</span></div>
            <div className="intro-main">
              <h2>Every journey has<br /><em>a purpose.</em></h2>
              <p>Whether you are visiting Puttaparthi, spending time with family or discovering somewhere new, thoughtful planning makes the journey easier. Sai Bhavani Tours &amp; Travels welcomes your travel enquiries and the opportunity to discuss your plans.</p>
              <a className="text-link" href="#journey">How to plan your trip <ArrowRight size={18} /></a>
            </div>
          </div>
        </section>

        <section className="services section-pad" id="services">
          <div className="container">
            <div className="section-heading">
              <div><div className="section-kicker"><span>02 / TRAVEL YOUR WAY</span></div><h2>Wherever you’re<br /><em>headed.</em></h2></div>
              <p>From arriving in town to exploring further, start by telling us what kind of journey you have in mind.</p>
            </div>
            <div className="service-grid">
              {services.map(({ icon: Icon, title, description }) => (
                <article className="service-card" key={title}>
                  <span className="service-icon"><Icon size={25} strokeWidth={1.4} aria-hidden="true" /></span>
                  <h3>{title}</h3><p>{description}</p>
                  <a className="service-link" href="#contact">Enquire <ArrowUpRight size={16} /><span className="sr-only"> about {title}</span></a>
                </article>
              ))}
            </div>
            <p className="section-note">Travel options are illustrative. Services, routes, vehicles and availability are subject to confirmation.</p>
          </div>
        </section>

        <section className="experiences section-pad" id="experiences">
          <div className="container">
            <div className="section-heading">
              <div><div className="section-kicker"><span>03 / FIND YOUR WAY</span></div><h2>A little inspiration<br /><em>for the road.</em></h2></div>
              <p>Make a pilgrimage, enjoy a scenic escape or bring the family together. Explore a few ideas for your next journey.</p>
            </div>
            <div className="experience-grid">
              {experiences.map((experience) => (
                <article className="experience-card" key={experience.number}>
                  <div className="experience-image"><img src={experience.image} alt={experience.alt} loading="lazy" /><span className="card-number">{experience.number}</span></div>
                  <div className="experience-body"><div><span className="card-eyebrow">{experience.eyebrow}</span><h3>{experience.title}</h3><p>{experience.description}</p></div><a className="card-arrow" href="#contact" aria-label={`Enquire about ${experience.title}`}><ArrowUpRight size={20} /></a></div>
                </article>
              ))}
            </div>
            <p className="section-note">Destinations and imagery are for inspiration; please enquire about available routes and arrangements.</p>
          </div>
        </section>

        <section className="visitor section-pad" id="visitor-guide">
          <div className="container visitor-grid">
            <div className="visitor-copy">
              <div className="section-kicker"><span>04 / VISITING PUTTAPARTHI</span></div>
              <h2>A place of<br /><em>quiet reflection.</em></h2>
              <p>Prasanthi Nilayam in Puttaparthi is the main ashram of Sri Sathya Sai Baba. Visitors from around the world come to this place of prayer and reflection.</p>
              <p>Before your visit, check the Sri Sathya Sai Central Trust’s official information for the latest guidance on visiting and reaching the ashram.</p>
              <div className="visitor-links"><a className="text-link" href="https://www.srisathyasai.org/pages/sai-prasanthi-nilayam.html" target="_blank" rel="noopener noreferrer">Ashram visitor guide <ArrowUpRight size={16} /></a><a className="text-link" href="https://srisathyasai.org/pages/sai-prasanthi-nilayam-travel.html" target="_blank" rel="noopener noreferrer">Getting there <ArrowUpRight size={16} /></a></div>
            </div>
            <aside className="visitor-aside"><span className="service-icon"><Sparkles size={24} strokeWidth={1.4} aria-hidden="true" /></span><h3>Plan a thoughtful visit</h3><p>Check official guidance before travelling, as arrangements can change.</p><ul><li>Review the current visitor guidelines.</li><li>Allow time for your journey and local travel.</li><li>Confirm any accommodation separately.</li></ul><p>Sai Bhavani Tours &amp; Travels is an independent travel business.</p></aside>
          </div>
        </section>

        <section className="journey section-pad" id="journey">
          <div className="container journey-grid">
            <div className="journey-image"><img src="/images/road.jpg" alt="An open road through a scenic landscape" loading="lazy" /><div className="image-caption"><Sparkles size={19} strokeWidth={1.4} /><span>MADE FOR THE<br />MOMENTS IN BETWEEN</span></div></div>
            <div className="journey-content">
              <div className="section-kicker"><span>05 / LET’S BEGIN</span></div>
              <h2>A little planning.<br /><em>A lot to look forward to.</em></h2>
              <p>Every good trip begins with an idea. Here’s how to start a conversation about yours.</p>
              <div className="steps">{steps.map((step) => <div className="step" key={step.number}><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></div>)}</div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container contact-inner">
            <div className="contact-copy"><div className="section-kicker"><span>06 / YOUR NEXT JOURNEY</span></div><h2>Tell us where you’d<br /><em>like to go.</em></h2><p>Share the details you know so far. An enquiry is the first step; dates, availability and price are confirmed separately.</p>
              <div className="contact-channels">
                {hasPhone ? <a href={`tel:${phone.startsWith("+") ? "+" : ""}${phoneDigits}`}>Call {phone}</a> : <p>Phone number pending confirmation.</p>}
                {googleProfile ? <a href={googleProfile} target="_blank" rel="noopener noreferrer">View our Google Business Profile <ArrowUpRight size={15} /></a> : <p>Google Business Profile link pending confirmation.</p>}
              </div>
            </div>
            <EnquiryForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-top"><Brand /><p className="footer-message">For meaningful places<br />and journeys together.</p><nav className="footer-nav" aria-label="Footer navigation"><a href="#services">Services</a><a href="#experiences">Destinations</a><a href="#visitor-guide">Visitor guide</a><a href="#about">About</a><a href="#contact">Contact</a></nav></div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} Sai Bhavani Tours &amp; Travels</span><span>Made for journeys worth taking.</span></div>
      </footer>
    </>
  );
}
