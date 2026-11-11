import { query } from "../lib/db";
import { siteOrigin } from "../lib/site-origin";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const origin = siteOrigin();
  if (!origin) return [];
  const paths = ["/", "/services", "/destinations", "/visitor-guide", "/about", "/contact"];
  let offerings = [];
  try {
    offerings = await query("SELECT slug FROM offerings WHERE published = 1 ORDER BY slug ASC");
    if (offerings.length) paths.push("/catalogue");
  } catch {
    // Keep the public pages in the sitemap while the catalogue is unavailable.
  }
  try {
    const rows = await query("SELECT EXISTS(SELECT 1 FROM gallery WHERE published = 1) OR EXISTS(SELECT 1 FROM testimonials WHERE published = 1) AS has_content");
    if (Number(rows[0]?.has_content)) paths.push("/gallery");
  } catch {
    // Omit the gallery until its content is available.
  }
  return [...paths.map((path) => ({ url: `${origin}${path}` })), ...offerings.map(({ slug }) => ({ url: `${origin}/catalogue/${encodeURIComponent(slug)}` }))];
}
