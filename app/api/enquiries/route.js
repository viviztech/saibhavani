import { query } from "../../../lib/db";
import { consumeRateLimit, verifyRequestOrigin } from "../../../lib/security";

export const runtime = "nodejs";
const services = new Set(["Local travel", "Airport or railway transfer", "Outstation trip", "Pilgrimage trip", "Other travel enquiry"]);
const result = (message, status) => Response.json({ message }, { status, headers: { "Cache-Control": "no-store" } });

async function readBody(request) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0, text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) { await reader.cancel(); throw new RangeError("body too large"); }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally { reader.releaseLock(); }
}

export async function POST(request) {
  if (!verifyRequestOrigin(request)) return result("Request could not be verified.", 403);
  try {
    let body;
    try { body = await readBody(request); } catch { return result("The enquiry is too long.", 413); }
    let data;
    try { data = JSON.parse(body); } catch { return result("Please check the enquiry details.", 400); }
    if (!data || typeof data !== "object" || Array.isArray(data)) return result("Please check the enquiry details.", 400);
    if (data.website) return result("Your enquiry has been received.", 200);
    const field = (key, max) => typeof data[key] === "string" ? data[key].trim().slice(0, max + 1) : "";
    const service = field("service", 120), name = field("name", 150), phone = field("telephone", 50);
    const email = field("email", 191), origin = field("origin", 255), destination = field("destination", 255);
    const date = field("date", 10), message = field("message", 1000), slug = field("offering", 191);
    const travellers = Number(data.passengers);
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`)) && new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date && date >= new Date().toISOString().slice(0, 10);
    if (!services.has(service) || !name || name.length > 150 || !/^\+?[\d\s()-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7 || phone.replace(/\D/g, "").length > 15 || phone.length > 50 || (email && (email.length > 191 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) || !origin || origin.length > 255 || !destination || destination.length > 255 || !validDate || !Number.isInteger(travellers) || travellers < 1 || travellers > 99 || message.length > 1000 || slug.length > 191 || (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) return result("Please check all fields and enter a valid future travel date.", 400);
    // A global limit provides a conservative fallback; production should also use
    // a trusted edge/WAF rate limit keyed by client IP, not client-supplied headers.
    if (!await consumeRateLimit("public-enquiries", { limit: 60, windowSeconds: 60 })) return result("Too many enquiries right now. Please try again shortly.", 429);
    let offering = null;
    if (slug) {
      const rows = await query("SELECT id, title FROM offerings WHERE slug = ? AND published = 1 LIMIT 1", [slug]);
      if (!rows.length) return result("This offering is no longer available. Please choose another or submit a general enquiry.", 400);
      offering = rows[0];
    }
    await query("INSERT INTO enquiries (offering_id, offering_title, service_type, name, phone, email, origin, destination, travel_date, travellers, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [offering?.id ?? null, offering?.title ?? null, service, name, phone, email || null, origin, destination, date, travellers, message || null]);
    return result("Your enquiry has been received. The team will follow up to discuss your plans.", 201);
  } catch {
    return result("We could not submit your enquiry right now. Please try again later.", 503);
  }
}
