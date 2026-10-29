import { json, isAdmin, notifyMail } from '../../lib/omocha.js';

// 管理用：通報された口コミの確認・非表示・削除
// GET  /api/admin   （ヘッダー x-admin-token）
// POST /api/admin {id, action: 'hide'|'show'|'delete'}
export async function onRequestGet({ request, env }) {
  if (!await isAdmin(env, request.headers.get('x-admin-token'))) return json({ error: 'auth' }, 401);
  const { results } = await env.DB.prepare(
    'SELECT id, toy, age, traits, stars, days, comment, created_at, reports, hidden FROM reviews ORDER BY (reports > 0 OR hidden = 1) DESC, created_at DESC LIMIT 200'
  ).all();
  const req = await env.DB.prepare(
    "SELECT id, name, url, comment, created_at, status, mailed FROM toy_requests ORDER BY (status = 'new') DESC, created_at DESC LIMIT 200"
  ).all();
  return json({ reviews: results, requests: req.results, mail: !!(env.EMAIL_API_TOKEN && env.NOTIFY_TO) });
}
export async function onRequestPost({ request, env }) {
  if (!await isAdmin(env, request.headers.get('x-admin-token'))) return json({ error: 'auth' }, 401);
  let b;
  try { b = await request.json(); } catch { return json({ error: 'json' }, 400); }
  if (b.action === 'test-mail') {
    return json(await notifyMail(env, '【ねこまわり】メール通知のテスト', 'ねこまわりからのテストメールです。届いていれば、おもちゃのリクエストの通知も届きます。'));
  }
  const id = parseInt(b.id, 10);
  if (!(id > 0)) return json({ error: 'id' }, 400);
  if (b.kind === 'request') {
    if (b.action === 'delete') await env.DB.prepare('DELETE FROM toy_requests WHERE id=?').bind(id).run();
    else if (['new', 'done', 'skip'].includes(b.action)) await env.DB.prepare('UPDATE toy_requests SET status=? WHERE id=?').bind(b.action, id).run();
    else return json({ error: 'action' }, 400);
    return json({ ok: true });
  }
  if (b.action === 'hide') await env.DB.prepare('UPDATE reviews SET hidden=1 WHERE id=?').bind(id).run();
  else if (b.action === 'show') await env.DB.prepare('UPDATE reviews SET hidden=0, reports=0 WHERE id=?').bind(id).run();
  else if (b.action === 'delete') {
    await env.DB.prepare('DELETE FROM reports WHERE review_id=?').bind(id).run();
    await env.DB.prepare('DELETE FROM reviews WHERE id=?').bind(id).run();
  } else return json({ error: 'action' }, 400);
  return json({ ok: true });
}
