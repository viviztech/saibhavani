import { ArrowUpRight, Sparkles } from "lucide-react";

export const metadata = { title: "Puttaparthi Visitor Guide | Sai Bhavani Tours & Travels", description: "Find official visitor information for Prasanthi Nilayam and plan your journey to Puttaparthi." };

export default function VisitorGuidePage() {
  return <main><section className="visitor section-pad"><div className="container visitor-grid">
    <div className="visitor-copy"><div className="section-kicker"><span>VISITING PUTTAPARTHI</span></div><h1 className="page-title">A place of<br /><em>quiet reflection.</em></h1>
      <p>Prasanthi Nilayam in Puttaparthi is the main ashram of Sri Sathya Sai Baba. Visitors from around the world come to this place of prayer and reflection.</p>
      <p>Before your visit, check the Sri Sathya Sai Central Trust’s official information for the latest guidance on visiting and reaching the ashram.</p>
      <div className="visitor-links"><a className="text-link" href="https://www.srisathyasai.org/pages/sai-prasanthi-nilayam.html" target="_blank" rel="noopener noreferrer">Ashram visitor guide <ArrowUpRight size={16} /></a><a className="text-link" href="https://srisathyasai.org/pages/sai-prasanthi-nilayam-travel.html" target="_blank" rel="noopener noreferrer">Getting there <ArrowUpRight size={16} /></a></div>
    </div>
    <aside className="visitor-aside"><span className="service-icon"><Sparkles size={24} strokeWidth={1.4} aria-hidden="true" /></span><h2 className="card-title">Plan a thoughtful visit</h2><p>Check official guidance before travelling, as arrangements can change.</p><ul><li>Review the current visitor guidelines.</li><li>Allow time for your journey and local travel.</li><li>Confirm any accommodation separately.</li></ul><p>Sai Bhavani Tours &amp; Travels is an independent travel business.</p></aside>
  </div></section></main>;
}
