import { siteOrigin } from "../lib/site-origin";

export const dynamic = "force-dynamic";

export default function robots() {
  const origin = siteOrigin();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
