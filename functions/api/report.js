import { json, ipHash } from '../../lib/omocha.js';

// POST /api/report {id}  … 通報。3人から通報されたら自動で非表示
export async function onRequestPost({ request, env }) {
  let b;
  try { b = await request.json(); } catch { return json({ error: 'json' }, 400); }
  const id = parseInt(b.id, 10);
  if (!(id > 0)) return json({ error: 'id' }, 400);
  const ip = await ipHash(env, request);
  const r = await env.DB.prepare('INSERT OR IGNORE INTO reports (review_id, ip_hash, created_at) VALUES (?,?,?)').bind(id, ip, Date.now()).run();
  if (r.meta.changes) {
    await env.DB.prepare('UPDATE reviews SET reports = reports + 1, hidden = CASE WHEN reports + 1 >= 3 THEN 1 ELSE hidden END WHERE id=?').bind(id).run();
  }
  return json({ ok: true });
}
