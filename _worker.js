const userID = '7a58054e-dc48-4633-986c-2ca6dd19b974'; 
const proxyIP = '155.254.35.75'; 
const proxyPort = 2052;

export default {
  async fetch(request, env) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Bridge is Active', { status: 200 });
    }
    return await vlessOverWS(request);
  }
};

async function vlessOverWS(request) {
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);
  server.accept();

  // ایجاد اتصال مستقیم به سرور شما
  const url = `ws://${proxyIP}:${proxyPort}/`;
  const socket = new WebSocket(url);

  socket.addEventListener('open', () => {
    // اتصال دو طرفه بین گوشی و سرور
    server.addEventListener('message', event => socket.send(event.data));
    socket.addEventListener('message', event => server.send(event.data));
  });

  socket.addEventListener('close', () => server.close());
  server.addEventListener('close', () => socket.close());

  return new Response(null, { status: 101, webSocket: client });
}
