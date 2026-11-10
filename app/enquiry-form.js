"use client";

import { useRef, useState } from "react";
import { business } from "./business";

const initialValues = {
  service: "",
  name: "",
  telephone: "",
  origin: "",
  destination: "",
  date: "",
  passengers: "",
  message: "",
};

function createSummary(values) {
  return [
    "Hello, I would like to enquire about a trip with Sai Bhavani Tours & Travels.",
    `Service: ${values.service}`,
    `Name: ${values.name.trim()}`,
    `Phone: ${values.telephone.trim()}`,
    `From: ${values.origin.trim()}`,
    `To: ${values.destination.trim()}`,
    `Travel date: ${values.date}`,
    `Passengers: ${values.passengers}`,
    values.message.trim() ? `Additional details: ${values.message.trim()}` : null,
  ].filter(Boolean).join("\n");
}

export default function EnquiryForm() {
  const [values, setValues] = useState(initialValues);
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("");
  const summaryRef = useRef(null);
  const whatsappNumber = business.whatsapp.replace(/\D/g, "");
  const hasWhatsApp = /^\d{8,15}$/.test(whatsappNumber);
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email);

  function update(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setSummary("");
    setStatus("");
  }

  function prepare(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!/^\+?[\d\s()-]+$/.test(values.telephone.trim()) || values.telephone.replace(/\D/g, "").length < 7) {
      setStatus("Please enter a valid phone number with at least 7 digits.");
      form.elements.telephone.focus();
      return;
    }
    if (![values.name, values.origin, values.destination].every((value) => value.trim())) {
      setStatus("Please complete your name, starting point and destination.");
      return;
    }
    setSummary(createSummary(values));
    setStatus("Your enquiry is ready. Review it below before sharing.");
  }

  async function copySummary() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(summary);
      setStatus("Enquiry copied. You can paste it into a message to the travel team.");
    } catch {
      summaryRef.current?.focus();
      summaryRef.current?.select();
      setStatus("Your enquiry is selected below. Copy it using your device's copy command.");
    }
  }

  return (
    <form className="enquiry-form" onSubmit={prepare}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="enquiry-service">Travel service <span aria-hidden="true">*</span></label>
          <select id="enquiry-service" name="service" value={values.service} onChange={update} required>
            <option value="">Select a service</option>
            <option value="Local travel">Local travel</option>
            <option value="Airport or railway transfer">Airport or railway transfer</option>
            <option value="Outstation trip">Outstation trip</option>
            <option value="Pilgrimage trip">Pilgrimage trip</option>
            <option value="Other travel enquiry">Other travel enquiry</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="enquiry-name">Your name <span aria-hidden="true">*</span></label>
          <input id="enquiry-name" name="name" autoComplete="name" value={values.name} onChange={update} maxLength={100} required />
        </div>
        <div className="form-field">
          <label htmlFor="enquiry-phone">Phone number <span aria-hidden="true">*</span></label>
          <input id="enquiry-phone" name="telephone" type="tel" autoComplete="tel" value={values.telephone} onChange={update} maxLength={25} required />
        </div>
        <div className="form-field">
          <label htmlFor="enquiry-origin">Starting point <span aria-hidden="true">*</span></label>
          <input id="enquiry-origin" name="origin" value={values.origin} onChange={update} maxLength={120} required />
        </div>
        <div className="form-field">
          <label htmlFor="enquiry-destination">Destination <span aria-hidden="true">*</span></label>
          <input id="enquiry-destination" name="destination" value={values.destination} onChange={update} maxLength={120} required />
        </div>
        <div className="form-field">
          <label htmlFor="enquiry-date">Travel date <span aria-hidden="true">*</span></label>
          <input id="enquiry-date" name="date" type="date" value={values.date} onChange={update} required />
        </div>
        <div className="form-field">
          <label htmlFor="enquiry-passengers">Number of passengers <span aria-hidden="true">*</span></label>
          <input id="enquiry-passengers" name="passengers" type="number" min="1" max="99" step="1" value={values.passengers} onChange={update} required />
        </div>
        <div className="form-field form-field-wide">
          <label htmlFor="enquiry-message">Additional details <span>(optional)</span></label>
          <textarea id="enquiry-message" name="message" rows="4" value={values.message} onChange={update} maxLength={1000} placeholder="Tell us anything else that would help plan your journey." />
        </div>
      </div>
      <p className="form-hint form-note">Fields marked * are required. Preparing this enquiry does not send or store your information.</p>
      <div className="form-actions"><button className="button" type="submit">Prepare enquiry</button></div>
      {status && <p className="form-status form-message" role="status" aria-live="polite">{status}</p>}
      {summary && (
        <div className="summary-box">
          <label htmlFor="enquiry-summary">Your prepared enquiry</label>
          <textarea ref={summaryRef} id="enquiry-summary" className="summary-text" rows="9" readOnly value={summary} />
          <div className="form-actions">
            <button type="button" className="button button-secondary" onClick={copySummary}>Copy enquiry</button>
            {hasWhatsApp && <a className="button" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}`} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>}
            {hasEmail && <a className="button button-secondary" href={`mailto:${business.email}?subject=${encodeURIComponent("Travel enquiry")}&body=${encodeURIComponent(summary)}`}>Open email</a>}
          </div>
          <p className="form-hint form-note">Your enquiry is shared only when you choose to send it through your messaging or email app.</p>
        </div>
      )}
    </form>
  );
}
