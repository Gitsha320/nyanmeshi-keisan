import { ngCheck, json, ipHash, notifyMail } from '../../lib/omocha.js';

// POST /api/contact {message, reply(返信先メール・任意), website(=空)} … お問い合わせ。運営者にメールで通知
// 管理ページの「リクエスト」一覧に［お問い合わせ］として入る（返信先は url 列に入れる）
export async function onRequestPost({ request, env, waitUntil }) {
  let b;
  try { b = await request.json(); } catch { return json({ error: 'json' }, 400); }
  if (b.website) return json({ ok: true });
  const message = String(b.message || '').replace(/[ \t]+/g, ' ').trim().slice(0, 1000);
  const reply = String(b.reply || '').trim().slice(0, 200);
  if (message.length < 5) return json({ error: 'input', message: 'お問い合わせの内容を入れてください' }, 400);
  if (reply && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reply)) return json({ error: 'reply', message: '返信先のメールアドレスを確かめてください' }, 400);
  if (ngCheck(message.replace(/https?:\/\/\S+/g, ''))) return json({ error: 'ng', message: '送れない言葉が入っています' }, 400);
  const ip = await ipHash(env, request);
  const now = Date.now();
  const rc = await env.DB.prepare('SELECT COUNT(*) AS n FROM toy_requests WHERE ip_hash=? AND created_at>?').bind(ip, now - 86400000).first();
  if (rc && rc.n >= 5) return json({ error: 'limit', message: '今日はたくさん送ってくれたので、また明日お願いします' }, 429);
  const title = '［お問い合わせ］' + message.replace(/\s+/g, ' ').slice(0, 30);
  const r = await env.DB.prepare('INSERT INTO toy_requests (name, url, comment, created_at, ip_hash) VALUES (?,?,?,?,?)')
    .bind(title, reply, message, now, ip).run();
  const id = r.meta.last_row_id;
  const text = `お問い合わせが届きました。\n\n${message}\n\n返信先：${reply || '（なし）'}\n\n管理ページ：https://nekomawari.com/kanri/\n`;
  const send = notifyMail(env, '【ねこまわり】お問い合わせ', text)
    .then(res => res.ok ? env.DB.prepare('UPDATE toy_requests SET mailed=1 WHERE id=?').bind(id).run() : null)
    .catch(() => null);
  if (waitUntil) waitUntil(send); else await send;
  return json({ ok: true });
}
