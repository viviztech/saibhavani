import { query } from "../../lib/db";
import { publicMetadata } from "../../lib/site-content";
import "./gallery.css";

export const dynamic = "force-dynamic";
export async function generateMetadata() {
  let hasContent = false;
  try {
    const rows = await query("SELECT EXISTS(SELECT 1 FROM gallery WHERE published = 1) OR EXISTS(SELECT 1 FROM testimonials WHERE published = 1) AS has_content");
    hasContent = Boolean(Number(rows[0]?.has_content));
  } catch { /* Avoid indexing an empty or unavailable gallery. */ }
  return { ...publicMetadata("/gallery", { title: "Gallery & Testimonials | Sai Bhavani Tours & Travels", description: "Explore the Sai Bhavani Tours & Travels gallery and customer testimonials." }), ...(!hasContent ? { robots: { index: false, follow: true } } : {}) };
}

function imageSource(value) {
  if (typeof value !== "string") return null;
  const source = value.trim();
  if (source.startsWith("/") && !source.startsWith("//")) return source;
  try { const url = new URL(source); return url.protocol === "https:" ? url.href : null; } catch { return null; }
}

export default async function GalleryPage() {
  const [gallery, testimonials] = await Promise.allSettled([
    query("SELECT id, title, image_url, alt_text FROM gallery WHERE published = 1 ORDER BY sort_order ASC, id ASC"),
    query("SELECT id, author, quote FROM testimonials WHERE published = 1 ORDER BY sort_order ASC, id ASC"),
  ]);
  const images = gallery.status === "fulfilled" ? gallery.value.filter((item) => imageSource(item.image_url)) : [];
  const quotes = testimonials.status === "fulfilled" ? testimonials.value : [];

  return <main><section className="gallery-section section-pad"><div className="container">
    <div className="section-heading"><div><div className="section-kicker"><span>JOURNEYS TOGETHER</span></div><h1 className="page-title">Moments along<br /><em>the way.</em></h1></div><p>Explore photographs and experiences shared with Sai Bhavani Tours &amp; Travels.</p></div>
    {gallery.status === "rejected" ? <p className="gallery-empty">The gallery is temporarily unavailable. Please check back later.</p> : images.length ? <div className="gallery-grid">{images.map((item) => <figure className="gallery-item card rounded-4 overflow-hidden" key={item.id}><img src={imageSource(item.image_url)} alt={item.alt_text} loading="lazy" /><figcaption>{item.title}</figcaption></figure>)}</div> : <p className="gallery-empty">No photographs are available yet.</p>}
    <section className="gallery-testimonials"><div className="section-kicker"><span>SHARED EXPERIENCES</span></div><h2>Words from our travellers.</h2>
      {testimonials.status === "rejected" ? <p className="gallery-empty">Testimonials are temporarily unavailable. Please check back later.</p> : quotes.length ? <div className="testimonial-grid">{quotes.map((item) => <figure className="testimonial-card card rounded-4" key={item.id}><blockquote>{item.quote}</blockquote><figcaption>{item.author}</figcaption></figure>)}</div> : <p className="gallery-empty">No testimonials are available yet.</p>}
    </section>
  </div></section></main>;
}
