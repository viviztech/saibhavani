import { cache } from "react";
import { query } from "./db";
import { siteOrigin } from "./site-origin";

// Only published content is public. If no record or database is available,
// public pages retain their built-in copy rather than failing to render.
export const getPageContent = cache(async (slug) => {
  try {
    const pages = await query("SELECT title, body, image_url, seo_title, seo_description FROM pages WHERE slug = ? AND published = 1 LIMIT 1", [slug]);
    return pages[0] || null;
  } catch {
    return null;
  }
});

export async function pageMetadata(slug, defaults) {
  const page = await getPageContent(slug);
  return publicMetadata(slug === "home" ? "/" : `/${slug}`, {
    title: page?.seo_title?.trim() || defaults.title,
    description: page?.seo_description?.trim() || defaults.description,
  });
}

// Emit absolute URLs only when the canonical origin has been explicitly configured.
export function publicMetadata(path, { title, description }) {
  const origin = siteOrigin();
  const url = origin ? `${origin}${path}` : null;
  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      type: "website",
      siteName: "Sai Bhavani Tours & Travels",
      title,
      description,
      ...(url ? { url } : {}),
    },
  };
}

// Images may be local paths or absolute HTTPS URLs. Ignore unsafe or malformed values.
export function safePageImage(value) {
  if (typeof value !== "string") return null;
  const source = value.trim();
  if (!source || /[\\\s]/.test(source)) return null;
  if (source.startsWith("/") && !source.startsWith("//")) return source;
  try {
    const url = new URL(source);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
