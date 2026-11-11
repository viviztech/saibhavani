import { ArrowUpRight, Sparkles } from "lucide-react";
import { getPageContent, pageMetadata } from "../../lib/site-content";

export const dynamic = "force-dynamic";
const defaultMetadata = { title: "Puttaparthi & Prasanthi Nilayam Visitor Guide", description: "Plan a visit to Puttaparthi with guidance on reaching Prasanthi Nilayam, ashram etiquette and preparing for your journey." };
export function generateMetadata() { return pageMetadata("visitor-guide", defaultMetadata); }

export default async function VisitorGuidePage() {
  const content = await getPageContent("visitor-guide");
  return <main><section className="visitor section-pad"><div className="container visitor-grid">
    <div className="visitor-copy"><div className="section-kicker"><span>VISITING PUTTAPARTHI</span></div><h1 className="page-title">{content?.title || <>A place of<br /><em>quiet reflection.</em></>}</h1>
      {content?.body ? <p style={{ whiteSpace: "pre-line" }}>{content.body}</p> : <><p>Prasanthi Nilayam, in Puttaparthi, Andhra Pradesh, is the main ashram of Sri Sathya Sai Baba. Its Sai Kulwant Hall is a place of prayer and reflection for visitors from around the world.</p><p>Use this guide to prepare for the journey, then check the Sri Sathya Sai Central Trust’s official information for current arrangements before you leave.</p></>}
      <div className="visitor-links"><a className="text-link" href="https://www.srisathyasai.org/pages/sai-prasanthi-nilayam.html" target="_blank" rel="noopener noreferrer">Ashram visitor guide <ArrowUpRight size={16} /></a><a className="text-link" href="https://srisathyasai.org/pages/sai-prasanthi-nilayam-travel.html" target="_blank" rel="noopener noreferrer">Getting there <ArrowUpRight size={16} /></a></div>
    </div>
    <aside className="visitor-aside"><span className="service-icon"><Sparkles size={24} strokeWidth={1.4} aria-hidden="true" /></span><h2 className="card-title">Plan a thoughtful visit</h2><p>Check official guidance before travelling, as arrangements can change.</p><ul><li>Review the current visitor guidelines.</li><li>Allow time for your journey and local travel.</li><li>Confirm any accommodation separately.</li></ul><p>Sai Bhavani Tours &amp; Travels is an independent travel business.</p></aside>
  </div></section>
  <section className="section-pad"><div className="container">
    <div className="section-heading"><div><div className="section-kicker"><span>PLAN YOUR JOURNEY</span></div><h2>Getting to<br /><em>Puttaparthi.</em></h2></div><p>Choose your arrival point first, then plan the onward journey to your accommodation or destination.</p></div>
    <div className="row g-4">
      <article className="col-md-4"><div className="service-card card rounded-4 shadow-sm h-100"><h3 className="card-title">By train</h3><p>The Trust lists Sri Sathya Sai Prasanthi Nilayam station (SSPN) and Dharmavaram (DMM) as rail options. Check current train schedules and arrange onward transport before travelling.</p></div></article>
      <article className="col-md-4"><div className="service-card card rounded-4 shadow-sm h-100"><h3 className="card-title">By air</h3><p>The Trust’s travel guide describes Bengaluru airport as an arrival option for Prasanthi Nilayam, followed by a road journey. Check your flight and onward transport together.</p></div></article>
      <article className="col-md-4"><div className="service-card card rounded-4 shadow-sm h-100"><h3 className="card-title">By road</h3><p>Bus and taxi options are described in the Trust’s travel guide. Allow time for traffic, breaks and changes to your arrival schedule, especially when connecting with a train or flight.</p></div></article>
    </div>
    <p className="section-note">Schedules and journey times can change. Consult the <a href="https://srisathyasai.org/pages/sai-prasanthi-nilayam-travel.html" target="_blank" rel="noopener noreferrer">Trust’s travel information</a> and your transport provider for the latest details.</p>
  </div></section>
  <section className="visitor section-pad"><div className="container">
    <div className="section-heading"><div><div className="section-kicker"><span>VISITOR QUESTIONS</span></div><h2>Before visiting<br /><em>the ashram.</em></h2></div></div>
    <div className="row g-4">
      <article className="col-md-4"><div className="visitor-aside h-100"><h3>What should I wear?</h3><p>The Trust asks visitors to dress modestly and sets out a dress code for the ashram. Review its guidance when packing.</p></div></article>
      <article className="col-md-4"><div className="visitor-aside h-100"><h3>Can I bring my phone into Sai Kulwant Hall?</h3><p>The Trust lists mobile phones and cameras among items not permitted inside the hall. Check its current rules for other belongings before your visit.</p></div></article>
      <article className="col-md-4"><div className="visitor-aside h-100"><h3>Where can I check timings?</h3><p>The Trust publishes a daily schedule and visitor guidance. Check directly for current timings and any changes for special occasions.</p></div></article>
    </div>
    <div className="visitor-links"><a className="text-link" href="https://www.srisathyasai.org/pages/sai-prasanthi-nilayam.html" target="_blank" rel="noopener noreferrer">Read official visitor guidance <ArrowUpRight size={16} /></a><a className="text-link" href="/contact">Discuss your travel plans <ArrowUpRight size={16} /></a></div>
    <p className="section-note">Sai Bhavani Tours &amp; Travels is an independent travel business and is not affiliated with the Sri Sathya Sai Central Trust. Travel arrangements are subject to confirmation.</p>
  </div></section></main>;
}
