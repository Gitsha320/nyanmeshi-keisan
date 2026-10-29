// 古いアドレス（pages.dev）と www 付きから、https://nekomawari.com へ転送する
const FROM = ['nyanmeshi-keisan.pages.dev', 'www.nekomawari.com'];
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (FROM.includes(url.hostname)) {
    url.hostname = 'nekomawari.com';
    url.protocol = 'https:';
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
