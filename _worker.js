const userID = '2a7401b5-6ebf-4244-88ce-2b99afe84499'; 
const proxyIP = '155.254.35.75'; 
const proxyPort = 8080; // پورتی که در پنل سنایی دادی

export default {
  async fetch(request, env) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Bridge is Active', { status: 200 });
    }
    return await vlessOverWS(request);
  }
};

async function vlessOverWS(request) {
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);
  server.accept();
  
  // اتصال مستقیم به سرور اصلی تو با پورت مخصوص
  const socket = await fetch(`http://${proxyIP}:${proxyPort}`, {
    method: 'GET',
    headers: request.headers,
    body: request.body,
  });
  
  return new Response(null, { status: 101, webSocket: client });
}
