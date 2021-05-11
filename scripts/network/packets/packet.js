import { server } from "../server.js";
import { client } from "../client.js";
import { chat } from "../../ui/chat.js";
import { util } from "../../util.js";
import { mapGenerator } from "../../map-generator.js";

let packetId = 0;

export const packet = {
  PLAYER_CONNECTED: packetId++,
  PLAYER_DISCONNECTED: packetId++,
  SYNC_PLAYER: packetId++,
  GENERATE_MAP: packetId++,
  SEND_MESSAGE: packetId++,
  BROADCAST_MESSAGE: packetId++,
  CHOOSE_COUNTRY: packetId++,
  handles: [
    playerConnected,
    playerDisconnected,
    syncPlayer,
    generateMap,
    sendMessage,
    broadcastMessage,
    chooseCountry,
  ],
  playerConnected: playerConnected,
  playerDisconnected: playerDisconnected,
  syncPlayer: syncPlayer,
  generateMap: generateMap,
  sendMessage: sendMessage,
  broadcastMessage: broadcastMessage,
  chooseCountry: chooseCountry
}

/**
 * Send from server to all clients except the newly connected one.
 * @param {boolean} sending 
 * @param {number} [exceptId]
 */
function playerConnected(sending, exceptId) {
  if (sending) {
    const data = { id: packet.PLAYER_CONNECTED }
    sendExcept(data, exceptId)
  } else {
    chat.insertMessage("A player has joined.");
  }
}

/**
 * Send from server to all clients.
 * @param {boolean} sending 
 */
function playerDisconnected(sending) {
  if (sending) {
    const data = { id: packet.PLAYER_DISCONNECTED }
    send(data)
  } else {
    chat.insertMessage("A player has left.");
  }
}

/**
 * Send from server to the newly connected client.
 * @param {boolean} sending 
 * @param {any} receiveData
 * @param {number} [toId]
 */
function syncPlayer(sending, receiveData, toId) {
  if (sending) {
    const save = util.getSave();
    const sendData = { id: packet.SYNC_PLAYER, save: save }
    sendTo(sendData, toId);
  } else {
    util.setSave(receiveData.save);
  }
}

/**
 * Send from server to the newly connected client.
 * @param {boolean} sending 
 * @param {any} [receiveData]
 * @param {any} [sendData]
 */
function generateMap(sending, receiveData, sendData) {
  if (sending) {
    sendData.id = packet.GENERATE_MAP;
    sendToServer(sendData);
  } else {
    // If the host and the generate map requester is the same
    if (util.isServer(receiveData.clientId)) {
      mapGenerator.generate(receiveData.width, receiveData.height, receiveData.countryCount)

      for (let i = 1; i < server.clients.length; ++i)
        syncPlayer(true, null, i);
    }
  }
}

function sendMessage(sending, receiveData, sendData) {
  if (sending) {
    sendData.id = packet.SEND_MESSAGE;
    sendToServer(sendData);
  } else {
    broadcastMessage(true, null, receiveData);
  }
}

function broadcastMessage(sending, receiveData, sendData) {
  if (sending) {
    sendData.id = packet.BROADCAST_MESSAGE;
    sendExcept(sendData, sendData.clientId)
  } else {
    chat.insertMessage(receiveData.message);
  }
}

// --- SEND FUNCTIONS --- //
/**
 * 
 * @param {object} data 
 */
function send(data) {
  data = JSON.stringify(data);

  for (let i = 0; i < server.clients.length; ++i)
    server.clients[i].write(data + "\n");
}

/**
 * 
 * @param {object} data 
 * @param {number} toId 
 */
function sendTo(data, toId) {
  data = JSON.stringify(data);
  server.clients[toId].write(data + "\n");
}

/**
 * 
 * @param {object} data 
 * @param {number} exceptId 
 */
function sendExcept(data, exceptId) {
  data = JSON.stringify(data);

  for (let i = 0; i < server.clients.length; ++i) {
    if (i !== exceptId)
      server.clients[i].write(data + "\n");
  }
}

/**
 * 
 * @param {object} data 
 */
function sendToServer(data) {
  if (client.connected) {
    data = JSON.stringify(data);
    client.socket.write(data + "\n")
  }
}
// --- SEND FUNCTIONS --- //