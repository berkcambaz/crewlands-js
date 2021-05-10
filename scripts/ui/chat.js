import { server } from "../network/server.js";
import { client } from "../network/client.js";
import { tilemap } from "../tilemap.js";
import { packet } from "../network/packets/packet.js";

export const chat = {
  init: init,
  insertMessage: insertMessage
}

function init() {
  chatInput.addEventListener("keyup", (ev) => {
    if (ev.key === "Enter") {
      const message = chatInput.value;
      chatInput.value = "";
      insertMessage(message)

      // Send the message to the server
      packet.sendMessage(true, null, { message: message });

      // Scroll to bottom
      chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;

      if (message.startsWith("/"))
        parseCommand(message.substr(1));
    }
  })
}

function insertMessage(message) {
  const messageElem = document.createElement("div");
  messageElem.innerText = message;
  chatMessageContainer.appendChild(messageElem);

  messages.push(messageElem);
  if (messages.length > messageLimit)
    messages.shift().remove();
}

/**
 * 
 * @param {string} command 
 */
function parseCommand(command) {
  command = command.split(" ");

  switch (command[0]) {
    case "host":
      commandHost();
      break;
    case "join":
      commandJoin(command[1], command[2]);
      break;
    case "stop":
      commandStop();
      break;
    case "leave":
      commandLeave();
      break;
    case "genmap":
      commandGenerateMap(command[1], command[2], command[3]);
      break;
    case "choosecountry":
      commandChooseCountry(command[1]);
      break;
    case "help":
      commandHelp();
      break;
    default:
      insertMessage("Command not found");
      break;
  }
}

function commandHost() {
  server.start();
}

function commandJoin(ip, port) {
  client.connect(ip, port);
}

function commandStop() {
  server.stop();
}

function commandLeave() {
  client.disconnect();
}

function commandGenerateMap(width, height, countryCount) {
  packet.generateMap(true, null, { width: width, height: height, countryCount: countryCount })
}

function commandHelp() {
  insertMessage(`Commands:
    /host 
    /join {ip} {port}
    /stop
    /leave
    /genmap {width} {height} {countryCount}`);
}

function commandChooseCountry(countryName) {
  switch (countryName) {
    case "green":
      break;
    case "purple":
      break;
    case "red":
      break;
    case "yellow":
      break;
  }
}

const messageLimit = 50;
const messages = [];

const elem = document.getElementById("chat");

const chatMessageContainer = document.getElementById("chat_message_container");
const chatInput = document.getElementById("chat_input");