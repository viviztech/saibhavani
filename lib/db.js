import mysql from "mysql2/promise";

// DATABASE_URL takes precedence. Otherwise set DB_HOST, DB_USER and DB_NAME;
// DB_PORT defaults to 3306 and DB_PASSWORD may be empty for local development.
// DB_SSL=true enables verified TLS; DB_SSL_CA may contain a PEM CA certificate.
// Production connections require one of these TLS settings.
export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL || (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME));
}

function pool() {
  if (!isDatabaseConfigured()) throw new Error("Database is not configured");
  if (!globalThis.__saiBhavaniPool) {
    let options;
    if (process.env.DATABASE_URL) {
      const url = new URL(process.env.DATABASE_URL);
      if (!["mysql:", "mysql2:"].includes(url.protocol)) throw new Error("DATABASE_URL must use mysql://");
      options = { host: url.hostname, port: Number(url.port || 3306), user: decodeURIComponent(url.username), password: decodeURIComponent(url.password), database: decodeURIComponent(url.pathname.slice(1)) };
    } else {
      options = { host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD || "", database: process.env.DB_NAME };
    }
    if (!options.host || !options.user || !options.database || !Number.isInteger(options.port) || options.port < 1 || options.port > 65535) throw new Error("Invalid database configuration");
    const tlsEnabled = process.env.DB_SSL === "true" || Boolean(process.env.DB_SSL_CA);
    if (process.env.NODE_ENV === "production" && !tlsEnabled) throw new Error("Production database connections require DB_SSL=true or DB_SSL_CA");
    if (tlsEnabled) options.ssl = { rejectUnauthorized: true, verifyIdentity: true, ...(process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, "\n") } : {}) };
    globalThis.__saiBhavaniPool = mysql.createPool({ ...options, waitForConnections: true, connectionLimit: 10, timezone: "Z", dateStrings: true });
  }
  return globalThis.__saiBhavaniPool;
}

// Returns rows for SELECT and a result header for INSERT/UPDATE/DELETE.
export async function query(sql, params = []) {
  const [rows] = await pool().execute(sql, params);
  return rows;
}

// The callback receives a mysql2 connection; it must use that connection for
// every statement in the transaction. Errors roll the transaction back.
export async function withTransaction(callback) {
  const connection = await pool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
