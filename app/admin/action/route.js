import { NextResponse } from 'next/server';
import { getSession, hashPassword, login, logout } from '../../../lib/auth';
import { query, withTransaction } from '../../../lib/db';
import { verifyRequestOrigin } from '../../../lib/security';

const tables = {
  offerings: { fields: ['slug', 'type', 'title', 'summary', 'description', 'destination', 'image_url', 'inclusions', 'exclusions', 'price_text', 'seo_title', 'seo_description', 'published'], required: ['slug', 'type', 'title'] },
  itinerary_days: { fields: ['offering_id', 'day_number', 'title', 'description'], required: ['offering_id', 'day_number', 'title'] },
  pages: { fields: ['slug', 'title', 'body', 'image_url', 'seo_title', 'seo_description', 'published'], required: ['slug', 'title'] },
  gallery: { fields: ['title', 'image_url', 'alt_text', 'published', 'sort_order'], required: ['title', 'image_url', 'alt_text'] },
  testimonials: { fields: ['author', 'quote', 'published', 'sort_order'], required: ['author', 'quote'] },
};
const lengths = { slug: 191, type: 50, title: 255, destination: 255, image_url: 2048, price_text: 255, seo_title: 255, alt_text: 255, author: 255, summary: 65535, description: 65535, inclusions: 65535, exclusions: 65535, seo_description: 65535, body: 65535, quote: 65535 };
const positiveId = value => /^\d+$/.test(String(value || '')) && Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : null;
function back(request, tab, error = '') {
  const url = new URL('/admin', request.url);
  if (tab) url.searchParams.set('tab', tab);
  if (error) url.searchParams.set('error', error);
  return NextResponse.redirect(url, 303);
}
function contentValues(form, config) {
  const values = {};
  for (const field of config.fields) {
    let value = String(form.get(field) || '').trim();
    if (field === 'published') { values[field] = form.get(field) === '1' ? 1 : 0; continue; }
    if (field === 'offering_id' || field === 'day_number') { value = positiveId(value); if (!value) throw new Error('invalid'); }
    else if (field === 'sort_order') { if (!/^-?\d{1,9}$/.test(value || '0')) throw new Error('invalid'); value = Number(value || 0); }
    else if (value.length > lengths[field]) throw new Error('invalid');
    if (config.required.includes(field) && !value) throw new Error('invalid');
    if (field === 'slug' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new Error('invalid');
    if (field === 'image_url' && value) {
      if (/[\\\s]/.test(value)) throw new Error('invalid');
      if (!value.startsWith('/') || value.startsWith('//')) {
        let url;
        try { url = new URL(value); } catch { throw new Error('invalid'); }
        if (url.protocol !== 'https:' || url.username || url.password) throw new Error('invalid');
      }
    }
    values[field] = value;
  }
  return values;
}

const MAX_FORM_BYTES = 512 * 1024;
async function readForm(request) {
  if (!/^application\/x-www-form-urlencoded(?:\s*;\s*charset=utf-8)?\s*$/i.test(request.headers.get('content-type') || '')) throw Object.assign(new Error('Unsupported form encoding'), { status: 415 });
  const length = request.headers.get('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_FORM_BYTES)) throw Object.assign(new Error('Form too large'), { status: 413 });
  if (!request.body) throw Object.assign(new Error('Missing form'), { status: 400 });
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let size = 0;
  let encoded = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FORM_BYTES) { await reader.cancel(); throw Object.assign(new Error('Form too large'), { status: 413 }); }
      encoded += decoder.decode(value, { stream: true });
    }
    encoded += decoder.decode();
    // URLSearchParams is permissive about malformed escapes; reject them first.
    for (const pair of encoded.split('&')) for (const part of pair.split('=')) decodeURIComponent(part.replaceAll('+', ' '));
  } catch (error) {
    if (error.status) throw error;
    throw Object.assign(new Error('Malformed form'), { status: 400 });
  } finally { reader.releaseLock(); }
  const form = new URLSearchParams(encoded);
  const seen = new Set();
  for (const key of form.keys()) {
    if (seen.has(key)) throw Object.assign(new Error('Duplicate form field'), { status: 400 });
    seen.add(key);
  }
  return form;
}

export async function POST(request) {
  if (!verifyRequestOrigin(request)) return new NextResponse('Forbidden', { status: 403 });
  let session;
  try { session = await getSession(); } catch { return new NextResponse('Service unavailable', { status: 503 }); }
  let form;
  try { form = await readForm(request); } catch (error) { return new NextResponse(error.message, { status: error.status || 400 }); }
  const action = String(form.get('action') || '');
  const tab = String(form.get('tab') || '');
  try {
    if (action === 'login') {
      const result = await login(String(form.get('email') || ''), String(form.get('password') || ''));
      return back(request, '', result.ok ? '' : 'login');
    }
    if (!session) return back(request, '', 'login');
    if (action === 'logout') { await logout(); return back(request); }
    if (action === 'status') {
      const id = positiveId(form.get('id'));
      const status = String(form.get('status') || '');
      if (!id || !['new', 'contacted', 'in_progress', 'closed'].includes(status)) throw new Error('invalid');
      await query('UPDATE enquiries SET status = ? WHERE id = ?', [status, id]);
      return back(request, 'enquiries');
    }
    if (action === 'note') {
      const id = positiveId(form.get('id'));
      const body = String(form.get('body') || '').trim();
      if (!id || !body || body.length > 5000) throw new Error('invalid');
      await query('INSERT INTO enquiry_notes (enquiry_id, user_id, body) VALUES (?, ?, ?)', [id, session.user.id, body]);
      return back(request, 'enquiries');
    }
    if (action === 'user') {
      if (session.user.role !== 'admin') return new NextResponse('Forbidden', { status: 403 });
      const rawId = String(form.get('id') || '');
      const id = rawId ? positiveId(rawId) : null;
      const name = String(form.get('name') || '').trim();
      const email = String(form.get('email') || '').trim().toLowerCase();
      const role = String(form.get('role') || '');
      const active = form.get('active') === '1' ? 1 : 0;
      const password = String(form.get('password') || '');
      if ((rawId && !id) || !name || name.length > 150 || email.length > 191 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['admin', 'staff'].includes(role) || (!id && !password)) throw new Error('invalid');
      const passwordHash = password ? await hashPassword(password) : null;
      await withTransaction(async connection => {
        const [users] = await connection.execute('SELECT id, role, active FROM users FOR UPDATE');
        const current = id && users.find(user => Number(user.id) === id);
        if (id && !current) throw new Error('invalid');
        const activeCount = users.filter(user => Number(user.active)).length;
        const adminCount = users.filter(user => Number(user.active) && user.role === 'admin').length;
        if (active && (!current || !Number(current.active)) && activeCount >= 3) throw new Error('limit');
        if (current && Number(current.active) && current.role === 'admin' && (!active || role !== 'admin') && adminCount <= 1) throw new Error('lastadmin');
        if (id) {
          await connection.execute(`UPDATE users SET name = ?, email = ?, role = ?, active = ?${passwordHash ? ', password_hash = ?' : ''} WHERE id = ?`, passwordHash ? [name, email, role, active, passwordHash, id] : [name, email, role, active, id]);
          if (!active || passwordHash || current.role !== role) await connection.execute('DELETE FROM sessions WHERE user_id = ?', [id]);
        } else await connection.execute('INSERT INTO users (name, email, password_hash, role, active) VALUES (?, ?, ?, ?, ?)', [name, email, passwordHash, role, active]);
      });
      return back(request, 'users');
    }
    if (action === 'setting') {
      if (session.user.role !== 'admin') return new NextResponse('Forbidden', { status: 403 });
      const key = String(form.get('key') || '').trim();
      const value = String(form.get('value') || '').trim();
      if (!['phone', 'whatsapp', 'email', 'googleBusinessProfile', 'address'].includes(key) || value.length > 2048) throw new Error('invalid');
      if (key === 'googleBusinessProfile' && value && !/^https?:\/\/[^\s]+$/i.test(value)) throw new Error('invalid');
      if (key === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('invalid');
      if (['phone', 'whatsapp'].includes(key) && value && !/^[+\d ()-]+$/.test(value)) throw new Error('invalid');
      await query('INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)', [key, value]);
      return back(request, 'settings');
    }
    if (action === 'delete') {
      if ((!Object.hasOwn(tables, tab) && tab !== 'enquiries') || !positiveId(form.get('id')) || form.get('confirm') !== '1') throw new Error('invalid');
      await query(`DELETE FROM \`${tab}\` WHERE id = ?`, [positiveId(form.get('id'))]);
      return back(request, tab);
    }
    if (action === 'save') {
      if (!Object.hasOwn(tables, tab)) throw new Error('invalid');
      const config = tables[tab];
      const rawId = String(form.get('id') || '');
      const id = rawId ? positiveId(rawId) : null;
      if (rawId && !id) throw new Error('invalid');
      const values = contentValues(form, config);
      if (id) await query(`UPDATE \`${tab}\` SET ${config.fields.map(field => `\`${field}\` = ?`).join(', ')} WHERE id = ?`, [...Object.values(values), id]);
      else await query(`INSERT INTO \`${tab}\` (${config.fields.map(field => `\`${field}\``).join(', ')}) VALUES (${config.fields.map(() => '?').join(', ')})`, Object.values(values));
      return back(request, tab);
    }
    throw new Error('invalid');
  } catch (error) {
    console.error('Admin operation failed:', error.code || error.message);
    return back(request, tab, ['limit', 'lastadmin', 'invalid'].includes(error.message) ? error.message : 'failed');
  }
}
