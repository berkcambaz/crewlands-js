import { client } from "./client.js";
import { chat } from "../ui/chat.js";
import { packet } from "./packets/packet.js";
const net = require("net");

export const server = {
  start: start,
  stop: stop,
  /** @type {net.Server} */
  socket: null,
  /** @type {net.Socket[]} */
  clients: []
}

function start() {
  try {
    server.socket = net.createServer()

    server.socket.listen(0, "127.0.0.1", () => {
      const port = server.socket.address().port;
      chat.insertMessage(`Server has started on port ${port}.`);
      client.connect("127.0.0.1", port);
    })

    server.socket.on("connection", (socket) => {
      const id = server.clients.push(socket) - 1;
      packet.playerConnected(true, id);

      socket.on("data", (data) => {
        const clientId = server.clients.indexOf(socket);
        data = JSON.parse(data);
        data.clientId = clientId;
        packet.handles[data.id](false, data)
      })

      socket.on("close", () => {
        const clientId = server.clients.indexOf(socket);
        server.clients.splice(clientId, 1)[0].destroy();
        packet.playerDisconnected(true);
      })
    })
  } catch (err) {
    console.log(err);
    return true;
  }

  return false;
}

function stop() {
  if (server.socket && server.socket.listening) {
    chat.insertMessage(`Server has stopped.`);

    server.clients.forEach((client) => { client.destroy() })
    server.socket.close((err) => {
      server.socket = null;
      server.clients = []
      if (err)
        console.log(err);
    })
  }
}