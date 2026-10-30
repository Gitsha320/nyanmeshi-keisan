import { json, ipHash } from '../../lib/omocha.js';

// POST /api/helpful {id} … 口コミに「参考になった」。同じ人は1つの口コミに1回だけ
export async function onRequestPost({ request, env }) {
  let b;
  try { b = await request.json(); } catch { return json({ error: 'json' }, 400); }
  const id = parseInt(b.id, 10);
  if (!(id > 0)) return json({ error: 'id' }, 400);
  const ip = await ipHash(env, request);
  const r = await env.DB.prepare('INSERT OR IGNORE INTO helpful_votes (review_id, ip_hash, created_at) VALUES (?,?,?)').bind(id, ip, Date.now()).run();
  if (r.meta.changes) await env.DB.prepare('UPDATE reviews SET helpful = helpful + 1 WHERE id=?').bind(id).run();
  const row = await env.DB.prepare('SELECT helpful FROM reviews WHERE id=?').bind(id).first();
  return json({ ok: true, already: !r.meta.changes, helpful: row ? row.helpful : 0 });
}
