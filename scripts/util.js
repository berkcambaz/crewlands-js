import { SPRITE, sprites } from "./sprite.js";
import { world } from "./world.js";
import { tilemap } from "./tilemap.js";
const fs = require("fs");

export const COUNTRY = {
  NONE: -1,
  GREEN: 0,
  PURPLE: 1,
  RED: 2,
  YELLOW: 3
}

export const LANDMARK = {
  NONE: -1,
  CAPITAL: 0,
  CHURCH: 1,
  FOREST: 2,
  HOUSE: 3,
  MOUNTAINS: 4,
  TOWER: 5
}

export const util = {
  countryIdToSprite: countryIdToSprite,
  landmarkIdToSprite: landmarkIdToSprite,
  countryIdToArmySprite: countryIdToArmySprite,
  countryIdToColor: countryIdToColor,
  getAllSaves: getAllSaves,
  save: save,
  load: load,
  getSave: getSave,
  setSave: setSave,
  isServer: isServer
}

function countryIdToSprite(countryId, occupiedByCountryId) {
  switch (occupiedByCountryId) {
    case COUNTRY.GREEN:
      return sprites[SPRITE.TILE_DIAGONAL_GREEN];
    case COUNTRY.PURPLE:
      return sprites[SPRITE.TILE_DIAGONAL_PURPLE];
    case COUNTRY.RED:
      return sprites[SPRITE.TILE_DIAGONAL_RED];
    case COUNTRY.YELLOW:
      return sprites[SPRITE.TILE_DIAGONAL_YELLOW];
  }

  switch (countryId) {
    case COUNTRY.GREEN:
      return sprites[SPRITE.TILE_GREEN];
    case COUNTRY.PURPLE:
      return sprites[SPRITE.TILE_PURPLE];
    case COUNTRY.RED:
      return sprites[SPRITE.TILE_RED];
    case COUNTRY.YELLOW:
      return sprites[SPRITE.TILE_YELLOW];
  }
}

function landmarkIdToSprite(id) {
  switch (id) {
    case LANDMARK.CAPITAL:
      return sprites[SPRITE.CAPITAL];
    case LANDMARK.CHURCH:
      return sprites[SPRITE.CHURCH];
    case LANDMARK.FOREST:
      return sprites[SPRITE.FOREST];
    case LANDMARK.HOUSE:
      return sprites[SPRITE.HOUSE];
    case LANDMARK.MOUNTAINS:
      return sprites[SPRITE.MOUNTAINS];
    case LANDMARK.TOWER:
      return sprites[SPRITE.TOWER];
  }
}

function countryIdToArmySprite(id) {
  switch (id) {
    case COUNTRY.GREEN:
      return sprites[SPRITE.ARMY_GREEN];
    case COUNTRY.PURPLE:
      return sprites[SPRITE.ARMY_PURPLE];
    case COUNTRY.RED:
      return sprites[SPRITE.ARMY_RED];
    case COUNTRY.YELLOW:
      return sprites[SPRITE.ARMY_YELLOW];
  }
}

function countryIdToColor(id) {
  switch (id) {
    case COUNTRY.GREEN:
      return "#37d98c";
    case COUNTRY.PURPLE:
      return "#9179ff";
    case COUNTRY.RED:
      return "#fc5c65";
    case COUNTRY.YELLOW:
      return "#ffb600";
  }
}

function load(file) {
  try {
    const save = JSON.parse(fs.readFileSync("./saves/" + file + ".json"));
    setSave(save);
  } catch (err) {
    console.log(err);
  }
}

function save(file) {
  const save = getSave();

  // Make sure "saves" folder exists
  if (!fs.existsSync("./saves"))
    fs.mkdirSync("./saves");

  try {
    fs.writeFileSync("./saves/" + file + ".json", JSON.stringify(save));
  } catch (err) {
    console.log(err);
  }
}

function getAllSaves() {
  // Make sure "saves" folder exists
  if (!fs.existsSync("./saves"))
    fs.mkdirSync("./saves");

  const saves = fs.readdirSync("./saves");
  for (let i = 0; i < saves.length; ++i)
    saves[i] = saves[i].split(".")[0];

  return saves;
}

function getSave() {
  const save = {
    countries: world.countries,
    width: tilemap.width,
    height: tilemap.height,
    tiles: []
  };

  for (let i = 0; i < tilemap.tiles.length; ++i) {
    save.tiles.push({
      countryId: tilemap.tiles[i].countryId,
      occupiedByCountryId: tilemap.tiles[i].occupiedByCountryId,
      landmarkId: tilemap.tiles[i].landmarkId,
      armyId: tilemap.tiles[i].armyId
    })
  }

  return save;
}

function setSave(save) {
  world.countries = save.countries;
  tilemap.width = save.width;
  tilemap.height = save.height;
  tilemap.tiles = []

  for (let i = 0; i < save.tiles.length; ++i) {
    tilemap.tiles.push({
      x: (i % tilemap.width) * tilemap.tileWidth,
      y: Math.floor(i / tilemap.height) * tilemap.tileHeight,
      l1: util.countryIdToSprite(save.tiles[i].countryId, save.tiles[i].occupiedByCountryId),
      l2: util.landmarkIdToSprite(save.tiles[i].landmarkId),
      l3: util.countryIdToArmySprite(save.tiles[i].armyId),
      countryId: save.tiles[i].countryId,
      occupiedByCountryId: save.tiles[i].occupiedByCountryId,
      landmarkId: save.tiles[i].landmarkId,
      armyId: save.tiles[i].armyId
    })
  }
}

function isServer(clientId) {
  return 0 === clientId;
}