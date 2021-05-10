import { game } from "../game.js";
import { COUNTRY, LANDMARK } from "../util.js";

export const panelBottom = {
  init: init,
  show: show,
  update: update
}

function init() {
  close.addEventListener("click", (ev) => {
    game.unselectTile()
  })
}

/**
 * 
 * @param {boolean} show 
 */
function show(show) {
  if (show) {
    panel.classList.remove("hide");
  } else {
    panel.classList.add("hide");
  }
}

/**
 * 
 * @param {import("../tilemap.js").Tile} tile 
 */
function update(tile) {
  let name = "";
  let landmark = "";
  let army = "";

  switch (tile.countryId) {
    case COUNTRY.GREEN:
      name += "Green's Province";
      break;
    case COUNTRY.PURPLE:
      name += "Purple's Province";
      break;
    case COUNTRY.RED:
      name += "Red's Province";
      break;
    case COUNTRY.YELLOW:
      name += "Yellow's Province";
      break;
  }

  switch (tile.occupiedByCountryId) {
    case COUNTRY.GREEN:
      name += " (Occupied by Green)";
      break;
    case COUNTRY.PURPLE:
      name += " (Occupied by Purple)";
      break;
    case COUNTRY.RED:
      name += " (Occupied by Red)";
      break;
    case COUNTRY.YELLOW:
      name += " (Occupied by Yellow)";
      break;
  }

  switch (tile.landmarkId) {
    case LANDMARK.CAPITAL:
      landmark = "- Capital"
      break;
    case LANDMARK.CHURCH:
      landmark = "- Church"
      break;
    case LANDMARK.FOREST:
      landmark = "- Forest"
      break;
    case LANDMARK.HOUSE:
      landmark = "- House"
      break;
    case LANDMARK.MOUNTAINS:
      landmark = "- Mountains"
      break;
    case LANDMARK.TOWER:
      landmark = "- Tower"
      break;
    case LANDMARK.NONE:
      landmark = "- No Landmark"
      break;
  }

  switch (tile.armyId) {
    case COUNTRY.GREEN:
      army = "- Green's Army"
      break;
    case COUNTRY.PURPLE:
      army = "- Purple's Army"
      break;
    case COUNTRY.RED:
      army = "- Red's Army"
      break;
    case COUNTRY.YELLOW:
      army = "- Yellow's Army"
      break;
    case COUNTRY.NONE:
      army = "- No Army"
      break;
  }

  provinceName.textContent = name;
  provinceLandmark.textContent = landmark;
  provinceArmy.textContent = army;
}

const panel = document.getElementById("panel-bottom");

const close = document.getElementById("panel-bottom-close");

const provinceName = document.getElementById("province_name");
const provinceLandmark = document.getElementById("province_landmark");
const provinceArmy = document.getElementById("province_army");

const armyGreen = document.getElementById("army_green");
const armyPurple = document.getElementById("army_purple");
const armyRed = document.getElementById("army_red");
const armyYellow = document.getElementById("army_yellow");

const actionDemolish = document.getElementById("action_demolish");
const actionBuildChurch = document.getElementById("action_build_church");
const actionBuildHouse = document.getElementById("action_build_house");
const actionBuildTower = document.getElementById("action_build_tower");