// Canonical addresses are only emitted when an explicit origin is configured.
export function siteOrigin() {
  const raw = process.env.APP_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    const allowedProtocol = url.protocol === "https:" || (process.env.NODE_ENV === "development" && local && url.protocol === "http:");
    if ((local && process.env.NODE_ENV !== "development") || !allowedProtocol || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return null;
    return url.origin;
  } catch {
    return null;
  }
}
