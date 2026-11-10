import { ArrowDown, ArrowRight, ArrowUpRight, Compass, MessageCircle, Sparkles } from "lucide-react";

const experiences = [
  {
    number: "01",
    eyebrow: "For the soul",
    title: "Sacred journeys",
    description: "Take time for the places and moments that matter to you.",
    image: "/images/temple.jpg",
    alt: "A temple in a sunlit landscape",
  },
  {
    number: "02",
    eyebrow: "For the curious",
    title: "Coastal escapes",
    description: "Follow the open road towards slower days by the water.",
    image: "/images/coast.jpg",
    alt: "A scenic coastline",
  },
  {
    number: "03",
    eyebrow: "For the explorers",
    title: "Hillside getaways",
    description: "Find a little perspective among winding roads and green hills.",
    image: "/images/hills.jpg",
    alt: "Green hills in the distance",
  },
];

const steps = [
  { number: "01", title: "Dream up the journey", description: "Think about where you would like to go, who is coming along and when you would like to travel." },
  { number: "02", title: "Share the details", description: "Tell us what you have in mind, from your preferred dates to the little things that matter." },
  { number: "03", title: "Plan your way forward", description: "Discuss the options and confirm the details directly with the travel team." },
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
  return (
    <>
      <header className="site-header">
        <div className="nav-shell container">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#about">Our story</a>
            <a href="#experiences">Explore</a>
            <a href="#journey">How it works</a>
          </nav>
          <a className="nav-cta" href="#contact">Plan a journey <ArrowUpRight size={16} /></a>
        </div>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <img className="hero-image" src="/images/hero.jpg" alt="A scenic road through a mountain landscape" />
          <div className="hero-shade" />
          <div className="hero-content container">
            <div className="eyebrow light"><span className="line" /> THE JOY IS IN THE JOURNEY</div>
            <h1 id="hero-title">Go somewhere<br /><em>beautiful.</em></h1>
            <p className="hero-description">A new place, a familiar path, a moment worth remembering. Wherever you’re headed, let’s begin the journey together.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#contact">Plan your journey <ArrowUpRight size={18} /></a>
              <a className="hero-link" href="#experiences">Explore the possibilities <ArrowDown size={16} /></a>
            </div>
          </div>
          <div className="hero-bottom container"><span className="hero-index">SAI BHAVANI <span>/</span> TOURS &amp; TRAVELS</span><span className="hero-caption">A little further. A little closer.</span></div>
        </section>

        <section className="intro section-pad" id="about">
          <div className="container intro-grid">
            <div className="section-kicker"><span>01 / THE JOURNEY</span></div>
            <div className="intro-main">
              <h2>Travel is more than<br /><em>getting there.</em></h2>
              <p>It’s the anticipation before you leave, the conversations along the way, and the memories you bring home. At Sai Bhavani Tours &amp; Travels, every journey starts with a conversation about what matters to you.</p>
              <a className="text-link" href="#journey">A thoughtful way to travel <ArrowRight size={18} /></a>
            </div>
          </div>
        </section>

        <section className="experiences section-pad" id="experiences">
          <div className="container">
            <div className="section-heading">
              <div><div className="section-kicker"><span>02 / FIND YOUR WAY</span></div><h2>Where will the road<br /><em>take you?</em></h2></div>
              <p>Some journeys bring us closer to ourselves. Others bring us closer together. Here are a few ideas to inspire your next one.</p>
            </div>
            <div className="experience-grid">
              {experiences.map((experience) => (
                <article className="experience-card" key={experience.number}>
                  <div className="experience-image"><img src={experience.image} alt={experience.alt} loading="lazy" /><span className="card-number">{experience.number}</span></div>
                  <div className="experience-body"><div><span className="card-eyebrow">{experience.eyebrow}</span><h3>{experience.title}</h3><p>{experience.description}</p></div><span className="card-arrow" aria-hidden="true"><ArrowUpRight size={20} /></span></div>
                </article>
              ))}
            </div>
            <p className="section-note">Journey ideas shown for inspiration. Available services and destinations are subject to confirmation.</p>
          </div>
        </section>

        <section className="journey section-pad" id="journey">
          <div className="container journey-grid">
            <div className="journey-image"><img src="/images/road.jpg" alt="An open road through a scenic landscape" loading="lazy" /><div className="image-caption"><Sparkles size={19} strokeWidth={1.4} /><span>MADE FOR THE<br />MOMENTS IN BETWEEN</span></div></div>
            <div className="journey-content">
              <div className="section-kicker"><span>03 / LET’S BEGIN</span></div>
              <h2>A little planning.<br /><em>A lot to look forward to.</em></h2>
              <p>Every good trip begins with an idea. Here’s a simple way to take it from someday to the open road.</p>
              <div className="steps">
                {steps.map((step) => <div className="step" key={step.number}><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container contact-inner">
            <div className="contact-copy"><div className="section-kicker"><span>04 / YOUR NEXT CHAPTER</span></div><h2>Have a journey<br /><em>in mind?</em></h2><p>Big plans or a simple idea, we’d love to hear about where you want to go.</p></div>
            <div className="contact-detail"><span className="contact-icon"><MessageCircle size={25} strokeWidth={1.4} /></span><div><h3>Let’s talk travel.</h3><p>Contact details will be shared here once confirmed by Sai Bhavani Tours &amp; Travels.</p><a className="text-link" href="#home">Back to the beginning <ArrowUpRight size={17} /></a></div></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-top"><Brand /><p className="footer-message">For the places you’ll go<br />and the memories you’ll make.</p><nav className="footer-nav" aria-label="Footer navigation"><a href="#about">Our story</a><a href="#experiences">Explore</a><a href="#journey">How it works</a><a href="#contact">Contact</a></nav></div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} Sai Bhavani Tours &amp; Travels</span><span>Made for journeys worth taking.</span></div>
      </footer>
    </>
  );
}
