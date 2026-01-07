export default {
  async fetch(request, env) {
    const userID = '2a7401b5-6ebf-4244-88ce-2b99afe84499'; // <--- UUID خودت را اینجا بذار
    const proxyIP = 'dl.google.com'; // یا آدرس سرور خارجت

    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Server is Running...', { status: 200 });
    }

    return await vlessOverWS(request, userID, proxyIP);
  }
};

async function vlessOverWS(request, userID, proxyIP) {
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.accept();

  // این بخش وظیفه تبدیل ترافیک وب‌سوکت به پروتکل VLESS را دارد
  const socket = await fetch(`https://${proxyIP}`, {
    method: 'GET',
    headers: request.headers,
    body: request.body,
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}
