import { query } from "../../lib/db";

const columns = "id, slug, type, title, summary, description, destination, image_url, inclusions, exclusions, price_text, seo_title, seo_description";

// Public pages deliberately treat missing configuration and database failures the
// same way, without exposing connection details to visitors.
export async function getOfferings() {
  try {
    const offerings = await query(`SELECT ${columns} FROM offerings WHERE published = 1 ORDER BY title ASC, id ASC`);
    return { offerings, unavailable: false };
  } catch {
    return { offerings: [], unavailable: true };
  }
}

export async function getOffering(slug) {
  try {
    const offerings = await query(`SELECT ${columns} FROM offerings WHERE slug = ? AND published = 1 LIMIT 1`, [slug]);
    if (!offerings.length) return { offering: null, days: [], unavailable: false };
    const days = await query("SELECT day_number, title, description FROM itinerary_days WHERE offering_id = ? ORDER BY day_number ASC, id ASC", [offerings[0].id]);
    return { offering: offerings[0], days, unavailable: false };
  } catch {
    return { offering: null, days: [], unavailable: true };
  }
}

export function imageSource(value) {
  if (typeof value !== "string") return null;
  const source = value.trim();
  if (source.startsWith("/") && !source.startsWith("//")) return source;
  try {
    const url = new URL(source);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
