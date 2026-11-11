import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getOffering, imageSource } from "../data";
import { publicMetadata } from "../../../lib/site-content";
import "../catalogue.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { offering } = await getOffering(slug);
  if (!offering) return { title: "Travel Catalogue | Sai Bhavani Tours & Travels" };
  return publicMetadata(`/catalogue/${encodeURIComponent(offering.slug)}`, {
    title: offering.seo_title?.trim() || `${offering.title} | Sai Bhavani Tours & Travels`,
    description: offering.seo_description?.trim() || offering.summary || "Enquire about a journey with Sai Bhavani Tours & Travels.",
  });
}

export default async function OfferingPage({ params }) {
  const { slug } = await params;
  const { offering, days, unavailable } = await getOffering(slug);
  if (unavailable) return <main><section className="catalogue-section section-pad"><div className="container"><div className="catalogue-empty"><h1 className="page-title">Travel details are temporarily unavailable.</h1><p>Please try again later, or contact us to discuss your plans.</p><Link className="text-link" href="/contact">Contact us <ArrowUpRight size={16} /></Link></div></div></section></main>;
  if (!offering) notFound();
  const image = imageSource(offering.image_url);

  return <main><section className="catalogue-section section-pad"><div className="container">
    <Link className="catalogue-back" href="/catalogue"><ArrowLeft size={16} /> All travel offerings</Link>
    <div className="catalogue-detail-heading"><div><div className="section-kicker"><span>{[offering.type, offering.destination].filter(Boolean).join(" / ") || "TRAVEL OFFERING"}</span></div><h1 className="page-title">{offering.title}</h1>{offering.summary && <p>{offering.summary}</p>}</div><Link className="button catalogue-button" href={`/contact?offering=${encodeURIComponent(offering.slug)}`}>Enquire about this trip <ArrowUpRight size={16} /></Link></div>
    {image && <div className="catalogue-detail-image"><img src={image} alt="" /></div>}
    <div className="catalogue-detail-grid"><div className="catalogue-detail-main">
      {offering.description && <section className="catalogue-detail-block"><h2>About this journey</h2><p>{offering.description}</p></section>}
      {days.length > 0 && <section className="catalogue-detail-block"><h2>Itinerary</h2><div className="catalogue-days">{days.map((day) => <article className="catalogue-day" key={day.day_number}><span className="catalogue-day-number">Day {day.day_number}</span><div><h3>{day.title}</h3>{day.description && <p>{day.description}</p>}</div></article>)}</div></section>}
      {(offering.inclusions || offering.exclusions) && <section className="catalogue-detail-block"><h2>Trip details</h2><div className="catalogue-inclusions">{offering.inclusions && <div><h3>Inclusions</h3><p>{offering.inclusions}</p></div>}{offering.exclusions && <div><h3>Exclusions</h3><p>{offering.exclusions}</p></div>}</div></section>}
    </div><aside className="catalogue-detail-aside"><h2>Plan your journey</h2>{offering.price_text && <p className="catalogue-price">{offering.price_text}</p>}<p>Share your preferred date and travel details. Availability, pricing and arrangements are confirmed separately.</p><Link className="text-link" href={`/contact?offering=${encodeURIComponent(offering.slug)}`}>Send an enquiry <ArrowUpRight size={16} /></Link></aside></div>
  </div></section></main>;
}
