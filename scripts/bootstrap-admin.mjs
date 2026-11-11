// Run interactively after importing db/schema.sql: node scripts/bootstrap-admin.mjs
// The password is read without echo and is never passed on the command line.
import mysql from "mysql2/promise";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import { createInterface } from "node:readline/promises";

if (typeof process.loadEnvFile === "function") {
  for (const path of [".env.local", ".env"]) {
    try { process.loadEnvFile(path); } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
}

function connectionOptions() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    if (!["mysql:", "mysql2:"].includes(url.protocol)) throw new Error("DATABASE_URL must use mysql://");
    return { host: url.hostname, port: Number(url.port || 3306), user: decodeURIComponent(url.username), password: decodeURIComponent(url.password), database: decodeURIComponent(url.pathname.slice(1)) };
  }
  return { host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD || "", database: process.env.DB_NAME };
}

async function readSecret(prompt) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error("Admin setup requires an interactive terminal");
  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  return new Promise((resolve, reject) => {
    let value = "";
    function finish(error) {
      process.stdin.removeListener("data", onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
      if (error) reject(error); else resolve(value);
    }
    function onData(chunk) {
      for (const character of chunk) {
        if (character === "\u0003") return finish(new Error("Setup cancelled"));
        if (character === "\r" || character === "\n") return finish();
        if (character === "\u007f" || character === "\b") value = value.slice(0, -1);
        else if (character >= " " && Buffer.byteLength(value + character, "utf8") <= 1024) value += character;
      }
    }
    process.stdin.on("data", onData);
  });
}

async function main() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error("Admin setup requires an interactive terminal");
  const options = connectionOptions();
  if (!options.host || !options.user || !options.database) throw new Error("Configure DATABASE_URL or DB_HOST, DB_USER and DB_NAME first");
  const tlsEnabled = process.env.DB_SSL === "true" || Boolean(process.env.DB_SSL_CA);
  if (process.env.NODE_ENV === "production" && !tlsEnabled) throw new Error("Production database connections require DB_SSL=true or DB_SSL_CA");
  if (tlsEnabled) options.ssl = { rejectUnauthorized: true, verifyIdentity: true, ...(process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, "\n") } : {}) };
  const connection = await mysql.createConnection(options);
  try {
    const [existing] = await connection.execute("SELECT COUNT(*) AS total FROM users");
    if (Number(existing[0].total) > 0) throw new Error("Users already exist; bootstrap is only for the first administrator");
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const name = (await rl.question("Administrator name: ")).trim();
    const email = (await rl.question("Administrator email: ")).trim().toLowerCase();
    rl.close();
    if (!name || name.length > 150 || email.length > 191 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid name and email address");
    const password = await readSecret("Password (at least 12 characters): ");
    const confirmation = await readSecret("Confirm password: ");
    if (password.length < 12 || password !== confirmation) throw new Error("Passwords must match and contain at least 12 characters");
    const salt = randomBytes(16).toString("hex");
    const hash = (await promisify(scryptCallback)(password, salt, 64)).toString("hex");
    await connection.execute("INSERT INTO users (name, email, password_hash, role, active) VALUES (?, ?, ?, 'admin', 1)", [name, email, `scrypt$${salt}$${hash}`]);
    process.stdout.write("Administrator created.\n");
  } finally {
    await connection.end();
  }
}

main().catch((error) => { console.error(`Setup failed: ${error.message}`); process.exitCode = 1; });
