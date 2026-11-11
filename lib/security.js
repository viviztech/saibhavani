import { createHash } from "node:crypto";
import { withTransaction } from "./db";

// For browser POST/PATCH/DELETE requests. In production APP_URL must be the
// canonical public origin, e.g. https://example.com; missing Origin is denied.
export function verifyRequestOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;
  try {
    const expected = process.env.APP_URL || (process.env.NODE_ENV === "production" ? "" : request.url);
    if (!expected) return false;
    const actualUrl = new URL(origin);
    const expectedUrl = new URL(expected);
    return actualUrl.origin === origin && actualUrl.origin === expectedUrl.origin &&
      (process.env.NODE_ENV !== "production" || expectedUrl.protocol === "https:");
  } catch {
    return false;
  }
}

// The caller supplies an identity obtained from a trusted proxy or edge.
// Atomic fixed-window DB counter; returns false once the limit is exceeded.
export async function consumeRateLimit(key, { limit, windowSeconds }) {
  if (typeof key !== "string" || !key || !Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(windowSeconds) || windowSeconds < 1) throw new Error("Invalid rate limit parameters");
  const bucket = createHash("sha256").update(key).digest("hex");
  return withTransaction(async (connection) => {
    await connection.execute(
      "INSERT INTO rate_limits (bucket, window_start, `count`) VALUES (?, UTC_TIMESTAMP(), 1) " +
      "ON DUPLICATE KEY UPDATE `count` = IF(window_start <= DATE_SUB(UTC_TIMESTAMP(), INTERVAL ? SECOND), 1, `count` + 1), " +
      "window_start = IF(window_start <= DATE_SUB(UTC_TIMESTAMP(), INTERVAL ? SECOND), UTC_TIMESTAMP(), window_start)",
      [bucket, windowSeconds, windowSeconds],
    );
    const [rows] = await connection.execute("SELECT `count` FROM rate_limits WHERE bucket = ?", [bucket]);
    return rows[0].count <= limit;
  });
}
