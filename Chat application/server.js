const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });
const clients = new Map();

wss.on("connection", (ws) => {
  let username = "";

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    if (data.type === "join") {
      username = data.username;
      clients.set(ws, username);
    } else if (data.type === "message") {
      const message = JSON.stringify({ username, text: data.text });
      for (const client of clients.keys()) {
        if (client.readyState === WebSocket.OPEN) client.send(message);
      }
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
  });
});
