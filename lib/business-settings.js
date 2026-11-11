import { query } from "./db";
import { business } from "../app/business";

// Only approved, explicitly supported public keys can be read from settings.
export async function getBusinessSettings() {
  const result = { ...business, address: "" };
  try {
    const rows = await query("SELECT `key`, value FROM settings WHERE `key` IN ('phone', 'whatsapp', 'email', 'googleBusinessProfile', 'address')");
    for (const row of rows) if (row.value && Object.hasOwn(result, row.key)) result[row.key] = row.value;
  } catch { /* Initial setup and database outages must not crash the public site. */ }
  return result;
}
