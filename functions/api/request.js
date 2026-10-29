import { ngCheck, json, ipHash, notifyMail } from '../../lib/omocha.js';

// POST /api/request {name, url, comment, website(=空)} … ほしいおもちゃのリクエスト。運営者にメールで通知
export async function onRequestPost({ request, env, waitUntil }) {
  let b;
  try { b = await request.json(); } catch { return json({ error: 'json' }, 400); }
  if (b.website) return json({ ok: true });
  const name = String(b.name || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  let url = String(b.url || '').trim().slice(0, 500);
  const comment = String(b.comment || '').replace(/\s+/g, ' ').trim().slice(0, 200);
  if (name.length < 2) return json({ error: 'input', message: 'おもちゃの名前を入れてください' }, 400);
  if (url && !/^https?:\/\/[^\s]+$/.test(url)) return json({ error: 'url', message: 'URLは https:// から入れてください' }, 400);
  if (ngCheck(name) || (comment && ngCheck(comment)))
    return json({ error: 'ng', message: '投稿できない言葉が入っています。名前とひとことには、URLや宣伝・攻撃的な言葉は入れられません' }, 400);
  const ip = await ipHash(env, request);
  const now = Date.now();
  const rc = await env.DB.prepare('SELECT COUNT(*) AS n FROM toy_requests WHERE ip_hash=? AND created_at>?').bind(ip, now - 86400000).first();
  if (rc && rc.n >= 5) return json({ error: 'limit', message: '今日はたくさんリクエストしてくれたので、また明日お願いします' }, 429);
  const r = await env.DB.prepare('INSERT INTO toy_requests (name, url, comment, created_at, ip_hash) VALUES (?,?,?,?,?)')
    .bind(name, url, comment, now, ip).run();
  const id = r.meta.last_row_id;
  const text = `おもちゃのリクエストが届きました。\n\nおもちゃ：${name}\nURL：${url || '（なし）'}\nひとこと：${comment || '（なし）'}\n\n管理ページ：https://nekomawari.com/kanri/\n`;
  const send = notifyMail(env, `【ねこまわり】おもちゃのリクエスト：${name}`, text)
    .then(res => res.ok ? env.DB.prepare('UPDATE toy_requests SET mailed=1 WHERE id=?').bind(id).run() : null)
    .catch(() => null);
  if (waitUntil) waitUntil(send); else await send;
  return json({ ok: true });
}
