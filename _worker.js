export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Bridge is Active', { status: 200 });
    }
    // تنظیمات مستقیم و بدون خطا
    const address = '155.254.35.75'; // آی‌پی سرور شما
    const port = 2052; // پورت سنایی شما
    
    return await vlessOverWS(request, address, port);
  }
};

async function vlessOverWS(request, address, port) {
  const { client, server } = new WebSocketPair();
  server.accept();
  const socket = new WebSocket(`ws://${address}:${port}`);
  
  // لوله‌کشی ترافیک بین کلودفلر و سرور
  socket.onopen = () => {
    server.onmessage = ({ data }) => socket.send(data);
    socket.onmessage = ({ data }) => server.send(data);
  };
  
  socket.onclose = () => server.close();
  server.onclose = () => socket.close();

  return new Response(null, { status: 101, webSocket: client });
}
