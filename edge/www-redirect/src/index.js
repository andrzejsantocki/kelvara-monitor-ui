const WWW_HOST = 'www.kelvara.xyz';
const APEX_ORIGIN = 'https://kelvara.xyz';

export async function fetch(request) {
  const url = new URL(request.url);

  if (url.hostname !== WWW_HOST) {
    return new Response('Not Found', { status: 404 });
  }

  return Response.redirect(`${APEX_ORIGIN}${url.pathname}${url.search}`, 308);
}
