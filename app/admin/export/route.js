import { getSession } from '../../../lib/auth';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';
function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\t\r\n]|^[\s\u0000-\u001f]*[=+\-@]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export async function GET() {
  if (!await getSession()) return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const fields = ['id', 'created_at', 'status', 'service_type', 'offering_title', 'name', 'phone', 'email', 'origin', 'destination', 'travel_date', 'travellers', 'message'];
  const rows = await query(`SELECT ${fields.map(field => `\`${field}\``).join(', ')} FROM enquiries ORDER BY created_at DESC`);
  const csv = [fields, ...rows.map(row => fields.map(field => row[field]))].map(row => row.map(csvCell).join(',')).join('\r\n');
  return new Response('\ufeff' + csv + '\r\n', { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="enquiries.csv"', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
