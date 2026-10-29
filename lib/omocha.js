// おもちゃの口コミ API で使う共通の部品
export const TOYS = ['dabird','kashabun','catchme','keri-ebi','tunnel','gurukoro','pichi-fish','chururun','matatabi','tsumetogi','jarashi-rod','wheel'];
export const AGES = ['kitten','young','adult','senior'];
export const TRAITS = ['active','calm','shy','hunter','lazy','multi'];
export const DAYS = ['d1','w1','m1','long','still'];

// 投稿できない言葉（荒らし・宣伝・攻撃的な言葉）
const NG = ['死ね','氏ね','しね','殺す','ころす','殺せ','くたばれ','ガイジ','池沼','きもい','キモい','うざい','クソ','くそ','糞',
  'ちんこ','ちんぽ','まんこ','セックス','せっくす','エロ','援交','パパ活','出会い','副業','稼げ','儲か','投資','仮想通貨','LINE','ライン交換',
  'http','www.','.com','.net','.jp/','@'];
export function ngCheck(s){
  const t = s.normalize('NFKC').toLowerCase().replace(/\s+/g,'');
  return NG.some(w => t.includes(w.normalize('NFKC').toLowerCase()));
}

export const json = (data, status=200) => new Response(JSON.stringify(data), {
  status, headers: {'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
});

export async function sha256(s){
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
}

export async function ipHash(env, request){
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const row = await env.DB.prepare("SELECT v FROM settings WHERE k='salt'").first();
  return sha256((row ? row.v : 'nyan') + ':' + ip);
}

export async function isAdmin(env, token){
  if (!token || token.length < 10) return false;
  const row = await env.DB.prepare("SELECT v FROM settings WHERE k='admin_hash'").first();
  return !!row && row.v === await sha256(token);
}

// 運営者へのメール通知（Cloudflare Email Service の REST API。確認済みの宛先へは無料）
// Pages の設定で、シークレット EMAIL_API_TOKEN（Email Sending: Edit の権限）を入れておく
export async function notifyMail(env, subject, text) {
  const token = env.EMAIL_API_TOKEN;
  const to = env.NOTIFY_TO;
  if (!token || !to) return { ok: false, reason: 'not-configured' };
  let account = env.CF_ACCOUNT_ID;
  if (!account) {
    const r = await fetch('https://api.cloudflare.com/client/v4/accounts', { headers: { Authorization: 'Bearer ' + token } });
    const j = await r.json().catch(() => ({}));
    account = j && j.result && j.result[0] && j.result[0].id;
    if (!account) return { ok: false, reason: 'no-account' };
  }
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/email/sending/send`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, from: { email: env.NOTIFY_FROM || 'noreply@nekomawari.com', name: 'ねこまわり' }, subject, text }),
  });
  const j = await r.json().catch(() => ({}));
  return { ok: !!j.success, status: r.status, errors: j.errors };
}
