import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import MobileMenu from "./mobile-menu";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/destinations", label: "Destinations" },
  { href: "/visitor-guide", label: "Visitor guide" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
];

function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Sai Bhavani Tours and Travels, home">
      <span className="brand-mark" aria-hidden="true"><Compass size={25} strokeWidth={1.4} /></span>
      <span className="brand-copy"><strong>Sai Bhavani</strong><span>TOURS &amp; TRAVELS</span></span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="nav-shell container">
        <Brand />
        <nav className="desktop-nav d-none d-xl-flex" aria-label="Main navigation">
          {navigation.map(({ href, label }) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <Link className="nav-cta btn d-none d-sm-inline-flex" href="/contact">Plan a journey <ArrowUpRight size={16} /></Link>
        <MobileMenu navigation={navigation} />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <Brand />
        <p className="footer-message">For meaningful places<br />and journeys together.</p>
        <nav className="footer-nav" aria-label="Footer navigation">
          {navigation.map(({ href, label }) => <Link href={href} key={href}>{label}</Link>)}
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Sai Bhavani Tours &amp; Travels</span><span>Made for journeys worth taking.</span></div>
    </footer>
  );
}
