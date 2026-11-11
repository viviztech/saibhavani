"use client";

import { useState } from "react";
import { trackEnquirySubmitted } from "./analytics";

const initialValues = { service: "", name: "", telephone: "", email: "", origin: "", destination: "", date: "", passengers: "", message: "", website: "" };

export default function EnquiryForm({ offering = "", offeringTitle = "" }) {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  function update(event) { const { name, value } = event.target; setValues((current) => ({ ...current, [name]: value })); setStatus(""); }
  async function submit(event) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setSending(true); setStatus("");
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, offering }) });
      const result = await response.json();
      setStatus(result.message || "We could not submit your enquiry. Please try again.");
      if (response.ok) {
        setValues(initialValues);
        if (response.status === 201) trackEnquirySubmitted();
      }
    } catch { setStatus("We could not submit your enquiry right now. Please try again later."); }
    finally { setSending(false); }
  }
  return <form className="enquiry-form card rounded-4 shadow" onSubmit={submit}>
    {offeringTitle && <p className="form-hint">Enquiring about: <strong>{offeringTitle}</strong></p>}
    <div className="form-grid">
      <div className="form-field"><label htmlFor="enquiry-service">Travel service *</label><select className="form-select" id="enquiry-service" name="service" value={values.service} onChange={update} required><option value="">Select a service</option><option>Local travel</option><option>Airport or railway transfer</option><option>Outstation trip</option><option>Pilgrimage trip</option><option>Other travel enquiry</option></select></div>
      <div className="form-field"><label htmlFor="enquiry-name">Your name *</label><input className="form-control" id="enquiry-name" name="name" autoComplete="name" value={values.name} onChange={update} maxLength={150} required /></div>
      <div className="form-field"><label htmlFor="enquiry-phone">Phone number *</label><input className="form-control" id="enquiry-phone" name="telephone" type="tel" autoComplete="tel" value={values.telephone} onChange={update} maxLength={50} required /></div>
      <div className="form-field"><label htmlFor="enquiry-email">Email (optional)</label><input className="form-control" id="enquiry-email" name="email" type="email" autoComplete="email" value={values.email} onChange={update} maxLength={191} /></div>
      <div className="form-field"><label htmlFor="enquiry-origin">Starting point *</label><input className="form-control" id="enquiry-origin" name="origin" value={values.origin} onChange={update} maxLength={255} required /></div>
      <div className="form-field"><label htmlFor="enquiry-destination">Destination *</label><input className="form-control" id="enquiry-destination" name="destination" value={values.destination} onChange={update} maxLength={255} required /></div>
      <div className="form-field"><label htmlFor="enquiry-date">Travel date *</label><input className="form-control" id="enquiry-date" name="date" type="date" min={new Date().toISOString().slice(0, 10)} value={values.date} onChange={update} required /></div>
      <div className="form-field"><label htmlFor="enquiry-passengers">Number of passengers *</label><input className="form-control" id="enquiry-passengers" name="passengers" type="number" min="1" max="99" step="1" value={values.passengers} onChange={update} required /></div>
      <div className="form-field form-field-wide"><label htmlFor="enquiry-message">Additional details (optional)</label><textarea className="form-control" id="enquiry-message" name="message" rows="4" value={values.message} onChange={update} maxLength={1000} /></div>
      <div className="sr-only" aria-hidden="true"><label htmlFor="enquiry-website">Website</label><input className="form-control" id="enquiry-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={update} /></div>
    </div>
    <p className="form-hint">Fields marked * are required. Your enquiry will be saved for the team to review and follow up. It does not confirm a booking.</p>
    <div className="form-actions"><button className="button btn" type="submit" disabled={sending}>{sending ? "Sending…" : "Send enquiry"}</button></div>
    {status && <p className="form-status" role="status" aria-live="polite">{status}</p>}
  </form>;
}
