import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { query } from "./db";
import { consumeRateLimit } from "./security";

const scrypt = promisify(scryptCallback);
const COOKIE = "sb_session";
const SESSION_SECONDS = 12 * 60 * 60;
const MAX_FAILURES = 5;
const FAILURE_WINDOW_SECONDS = 15 * 60;
const DUMMY_SALT = "9f017310b134787941dfe30f4415f016";
const DUMMY_HASH = "0".repeat(128);

export async function hashPassword(password) {
  if (typeof password !== "string" || password.length < 12 || Buffer.byteLength(password, "utf8") > 1024) throw new Error("Password must be at least 12 characters and at most 1024 bytes");
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

async function verifyPassword(password, encoded) {
  const parts = typeof encoded === "string" ? encoded.split("$") : [];
  const valid = parts.length === 3 && parts[0] === "scrypt" && /^[a-f0-9]{32}$/.test(parts[1]) && /^[a-f0-9]{128}$/.test(parts[2]);
  const salt = valid ? parts[1] : DUMMY_SALT;
  const expected = Buffer.from(valid ? parts[2] : DUMMY_HASH, "hex");
  const actual = await scrypt(password, salt, 64);
  return timingSafeEqual(expected, actual) && valid;
}

function tokenHash(token) { return createHash("sha256").update(token).digest("hex"); }
function cookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS };
}

// Sets the cookie in a Route Handler or Server Action. Failure is intentionally
// generic. Login attempts (including successful attempts and unknown emails)
// are limited per address to reduce credential guessing.
export async function login(email, password) {
  const normalized = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalized || normalized.length > 191 || typeof password !== "string" || Buffer.byteLength(password, "utf8") > 1024) return { ok: false, reason: "invalid" };
  if (!(await consumeRateLimit(`login:${normalized}`, { limit: MAX_FAILURES, windowSeconds: FAILURE_WINDOW_SECONDS }))) return { ok: false, reason: "rate_limited" };
  const users = await query("SELECT id, name, email, role, active, password_hash FROM users WHERE email = ? LIMIT 1", [normalized]);
  const user = users[0];
  const matches = await verifyPassword(password, user?.password_hash);
  if (!user || !user.active || !matches) {
    await query("INSERT INTO login_attempts (email, attempted_at) VALUES (?, UTC_TIMESTAMP())", [normalized]);
    return { ok: false, reason: "invalid" };
  }
  const token = randomBytes(32).toString("hex");
  await query("INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? SECOND), UTC_TIMESTAMP())", [tokenHash(token), user.id, SESSION_SECONDS]);
  (await cookies()).set(COOKIE, token, cookieOptions());
  return { ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

// Reads the user afresh so disabling an account immediately revokes its access.
export async function getSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const rows = await query("SELECT u.id, u.name, u.email, u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ? AND s.expires_at > UTC_TIMESTAMP() AND u.active = 1 LIMIT 1", [tokenHash(token)]);
  return rows[0] ? { user: rows[0] } : null;
}

export async function logout() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token && /^[a-f0-9]{64}$/.test(token)) await query("DELETE FROM sessions WHERE id = ?", [tokenHash(token)]);
  store.set(COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}
