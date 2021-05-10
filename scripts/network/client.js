import { server } from "./server.js";
import { chat } from "../ui/chat.js";
import { packet } from "./packets/packet.js";
const net = require("net");

export const client = {
  connect: connect,
  disconnect: disconnect,
  /** @type {net.Socket} */
  socket: null,
  connected: false
}

function connect(ip, port) {
  try {
    client.socket = new net.Socket();

    client.socket.connect(port, ip, () => {
      chat.insertMessage(`Connected to the server.`);
      client.connected = true;
    })

    client.socket.on("data", (data) => {
      data = JSON.parse(data);
      packet.handles[data.id](false, data)
    })

    client.socket.on("close", () => { disconnect() })
  } catch (err) {
    console.log(err);
    return true;
  }

  return false;
}

function disconnect() {
  if (client.connected) {
    client.socket.destroy();
    client.socket = null;
    client.connected = true;
    chat.insertMessage(`Disconnected from the server.`);
  }
}