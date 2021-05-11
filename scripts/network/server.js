import { client } from "./client.js";
import { chat } from "../ui/chat.js";
import { packet } from "./packets/packet.js";
import { DataHandler } from "./data-handler.js";
const net = require("net");

export const server = {
  start: start,
  stop: stop,
  /** @type {net.Server} */
  socket: null,
  /** @type {net.Socket[]} */
  clients: [],
  /** @type {DataHandler[]} */
  dataHandlers: []
}

function start() {
  try {
    server.socket = net.createServer()

    server.socket.listen(0, "127.0.0.1", () => {
      const port = server.socket.address().port;
      chat.insertMessage(`Server has started on port ${port}.`, true);
      client.connect("127.0.0.1", port);
    })

    server.socket.on("connection", (socket) => {
      const id = server.clients.push(socket) - 1;
      server.dataHandlers.push(new DataHandler("\n"));
      packet.playerConnected(true, id);

      socket.on("data", (data) => {
        const clientId = server.clients.indexOf(socket);
        server.dataHandlers[clientId].push(data);

        data = server.dataHandlers[clientId].getData()
        if (data) {
          console.log(data);
          data.clientId = clientId;
          packet.handles[data.id](false, data)
        }
      })

      socket.on("close", () => {
        const clientId = server.clients.indexOf(socket);
        server.clients.splice(clientId, 1)[0].destroy();
        server.dataHandlers.splice(clientId, 1);
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
    chat.insertMessage(`Server has stopped.`, true);

    server.clients.forEach((client) => { client.destroy() })
    server.socket.close((err) => {
      server.socket = null;
      server.clients = []
      server.dataHandlers = []
      if (err)
        console.log(err);
    })
  }
}