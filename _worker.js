const userID = '2a7401b5-6ebf-4244-88ce-2b99afe84499'; 
const proxyIP = 'dl.google.com'; 

export default {
  async fetch(request, env) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Server is Running', { status: 200 });
    }
    return await vlessOverWS(request);
  }
};

async function vlessOverWS(request) {
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);
  server.accept();
  const url = new URL(request.url);
  const socket = await fetch(`https://${proxyIP}${url.pathname}`, {
    method: 'GET',
    headers: request.headers,
    body: request.body,
  });
  return new Response(null, { status: 101, webSocket: client });
}
