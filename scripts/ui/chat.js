import { server } from "../network/server.js";
import { client } from "../network/client.js";
import { packet } from "../network/packets/packet.js";
import { COUNTRY, util } from "../util.js";

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

      // Scroll to bottom
      chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;

      if (message.startsWith("/"))
        parseCommand(message.substr(1));
      else    // If not a command, send it to the server
        packet.sendMessage(true, null, { message: message });
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
    case "color":
      commandColor(command[1]);
      break;
    case "save":
      commandSave(command[1]);
      break;
    case "load":
      commandLoad(command[1]);
      break;
    case "getsaves":
      commandGetSaves();
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

function commandColor(color) {
  let countryId;
  switch (color) {
    case "green":
      countryId = COUNTRY.GREEN;
      break;
    case "purple":
      countryId = COUNTRY.PURPLE;
      break;
    case "red":
      countryId = COUNTRY.RED;
      break;
    case "yellow":
      countryId = COUNTRY.YELLOW;
      break;
    case "none":
      countryId = COUNTRY.NONE;
      break;
  }

  packet.chooseCountry(countryId);
}

function commandSave(name) {
  console.log(util.save(name));
}

function commandLoad(name) {
  console.log(util.load(name));
}

function commandGetSaves() {
  const saves = util.getAllSaves();
  if (saves.length === 0)
    chat.insertMessage("No save found.");
  else
    chat.insertMessage(saves.join(", "))
}

function commandHelp() {
  insertMessage(`Commands:
    /host
    /stop
    /join {ip} {port}
    /leave
    /genmap {width} {height} {colorCount}
    /color {colorName}
    /save {name}
    /load {name}
    /getsaves`);
}

const messageLimit = 50;
const messages = [];

const elem = document.getElementById("chat");

const chatMessageContainer = document.getElementById("chat_message_container");
const chatInput = document.getElementById("chat_input");