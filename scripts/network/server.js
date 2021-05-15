import { client } from "./client.js";
import { chat } from "../ui/chat.js";
import { packet } from "./packets/packet.js";
import { DataHandler } from "./data-handler.js";
import { COUNTRY } from "../util.js";
const net = require("net");

export const server = {
  start: start,
  stop: stop,
  /** @type {net.Server} */
  socket: null,
  /** @type {{socket: net.Socket, dataHandler: DataHandler, color: number}[]} */
  clients: []
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
      const id = server.clients.push({
        socket: socket,
        dataHandler: new DataHandler("\n"),
        color: COUNTRY.NONE
      }) - 1;

      packet.playerConnected(true, id);
      packet.syncPlayer(true, false, id);

      socket.on("data", (data) => {
        const clientId = getIdFromSocket(socket);
        server.clients[clientId].dataHandler.push(data);

        data = server.clients[clientId].dataHandler.getData()
        if (data) {
          console.log(data);
          data.clientId = clientId;
          packet.handles[data.id](false, data)
        }
      })

      socket.on("close", () => {
        const clientId = getIdFromSocket(socket);
        server.clients.splice(clientId, 1)[0].socket.destroy();
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

    server.clients.forEach((client) => { client.socket.destroy() })
    server.socket.close((err) => {
      server.socket = null;
      server.clients = []
      if (err)
        console.log(err);
    })
  }
}

/**
 * 
 * @param {net.Socket} socket 
 */
function getIdFromSocket(socket) {
  for (let i = 0; i < server.clients.length; ++i) {
    if (server.clients[i].socket === socket)
      return i;
  }

  return -1;
}