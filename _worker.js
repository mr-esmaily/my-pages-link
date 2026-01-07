// تنظیمات اختصاصی شما
const userID = '77595fe5-7050-42b3-b978-1ed90d21f87b'; // شناسه‌ی جدید شما
const proxyIP = '155.254.35.75'; // آی‌پی سرور شما
const proxyPort = 2052; // پورت سنایی شما

export default {
  async fetch(request, env) {
    const upgradeHeader = request.headers.get('Upgrade');
    
    // اگر درخواست وب‌سایت معمولی بود، پیام سلامت پل را نشان بده
    if (upgradeHeader !== 'websocket') {
      return new Response('Bridge is Active - skingenius.ir', { 
        status: 200,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
      });
    }
    
    // اجرای پروتکل برای اتصال وی‌پی‌ان
    return await vlessOverWS(request);
  }
};

async function vlessOverWS(request) {
  const { client, server } = new WebSocketPair();
  server.accept();

  // ایجاد اتصال مستقیم به سرور سنایی روی پورت ۲۰۵۲
  const remoteSocket = new WebSocket(`ws://${proxyIP}:${proxyPort}`);
  
  remoteSocket.onopen = () => {
    // انتقال داده‌ها بین کلاینت و سرور اصلی
    server.onmessage = ({ data }) => remoteSocket.send(data);
    remoteSocket.onmessage = ({ data }) => server.send(data);
  };
  
  remoteSocket.onclose = () => server.close();
  server.onclose = () => remoteSocket.close();
  remoteSocket.onerror = () => server.close();
  server.onerror = () => remoteSocket.close();

  return new Response(null, { 
    status: 101, 
    webSocket: client 
  });
}
