import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getOfferings, imageSource } from "./data";
import { publicMetadata } from "../../lib/site-content";
import "./catalogue.css";

export const dynamic = "force-dynamic";
export async function generateMetadata() { const { offerings, unavailable } = await getOfferings(); return { ...publicMetadata("/catalogue", {
  title: "Travel Catalogue | Sai Bhavani Tours & Travels",
  description: "Explore available travel offerings and enquire about a journey with Sai Bhavani Tours & Travels.",
}), ...((unavailable || !offerings.length) ? { robots: { index: false, follow: true } } : {}) }; }

function singleValue(value) {
  return typeof value === "string" ? value.trim().slice(0, 100) : "";
}

export default async function CataloguePage({ searchParams }) {
  const params = await searchParams;
  const search = singleValue(params?.q);
  const selectedType = singleValue(params?.type);
  const { offerings, unavailable } = await getOfferings();
  const types = [...new Set(offerings.map((item) => item.type).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const term = search.toLocaleLowerCase();
  const results = offerings.filter((item) => {
    const matchesType = !selectedType || item.type === selectedType;
    const matchesSearch = !term || [item.title, item.summary, item.destination, item.type].some((value) => value?.toLocaleLowerCase().includes(term));
    return matchesType && matchesSearch;
  });

  return <main><section className="catalogue-section section-pad"><div className="container">
    <div className="section-heading"><div><div className="section-kicker"><span>EXPLORE YOUR OPTIONS</span></div><h1 className="page-title">Find your next<br /><em>journey.</em></h1></div><p>Explore travel offerings and share the details of the journey you have in mind.</p></div>
    {!unavailable && <form className="catalogue-filters rounded-4" action="/catalogue" method="get">
      <div><label htmlFor="catalogue-search">Search</label><input className="form-control" id="catalogue-search" name="q" type="search" defaultValue={search} maxLength={100} placeholder="Search by name or destination" /></div>
      <div><label htmlFor="catalogue-type">Type</label><select className="form-select" id="catalogue-type" name="type" defaultValue={selectedType}><option value="">All types</option>{types.map((type) => <option key={type} value={type}>{type}</option>)}</select></div>
      <button className="button btn" type="submit">Search</button>
      {(search || selectedType) && <Link className="catalogue-reset" href="/catalogue">Clear filters</Link>}
    </form>}
    {unavailable ? <div className="catalogue-empty"><h2>Travel offerings are temporarily unavailable.</h2><p>Please try again later, or contact us to discuss your plans.</p><Link className="text-link" href="/contact">Contact us <ArrowRight size={16} /></Link></div> : results.length ? <>
      <p className="catalogue-count" aria-live="polite">{results.length} {results.length === 1 ? "offering" : "offerings"} found</p>
      <div className="catalogue-grid">{results.map((item) => {
        const image = imageSource(item.image_url);
        return <article className="catalogue-card card rounded-4 shadow-sm" key={item.id}>
          {image && <div className="catalogue-image"><img src={image} alt="" loading="lazy" /></div>}
          <div className="catalogue-card-body"><span className="card-eyebrow">{[item.type, item.destination].filter(Boolean).join(" / ")}</span><h2>{item.title}</h2>{item.summary && <p>{item.summary}</p>}{item.price_text && <p className="catalogue-price">{item.price_text}</p>}<Link className="service-link" href={`/catalogue/${encodeURIComponent(item.slug)}`}>View details <ArrowUpRight size={16} /><span className="sr-only"> for {item.title}</span></Link></div>
        </article>;
      })}</div>
      <p className="section-note">Availability, routes, vehicles and prices are subject to confirmation.</p>
    </> : <div className="catalogue-empty"><h2>{search || selectedType ? "No offerings match your search." : "No travel offerings are listed yet."}</h2><p>{search || selectedType ? "Try a different search or clear the filters." : "Please contact us to discuss your travel plans."}</p><Link className="text-link" href={search || selectedType ? "/catalogue" : "/contact"}>{search || selectedType ? "See all offerings" : "Contact us"} <ArrowRight size={16} /></Link></div>}
  </div></section></main>;
}
