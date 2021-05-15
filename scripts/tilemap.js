import { game } from "./game.js";

export const tilemap = {
  tileWidth: 128,
  tileHeight: 128,
  width: 10,
  height: 10,
  /** @type {Tile[]} */
  tiles: [],
  /** @type {Country[]} */
  countries: [],
  getTile: getTile,
  getTileAt: getTileAt,
  getTilePos: getTilePos
}

/**
 * @typedef Tile
 * @property {number} x
 * @property {number} y
 * @property {HTMLImageElement} l1
 * @property {HTMLImageElement} l2
 * @property {HTMLImageElement} l3
 * @property {number} countryId
 * @property {number} occupiedByCountryId
 * @property {number} landmarkId
 * @property {Army} army
 */

/**
 * @typedef Country
 * @property {number} gold
 * @property {number} income
 * @property {number} army
 * @property {number} armyLimit
 */

/**
 * 
 * @typedef Army
 * @property {boolean} moved
 * @property {number} id
 */

/**
 * 
 * @param {number} x X position of the tile in tile coordinates.
 * @param {number} y Y position of the tile in tile coordinates.
 * @returns 
 */
function getTile(x, y) {
  return tilemap.tiles[x + y * tilemap.width];
}

/**
 * 
 * @param {{x: number, y: number}} pos Position of the tile in pixel coordinates.
 * @param {{x: number, y: number}} camera 
 */
function getTileAt(pos, camera) {
  let x = ((pos.x - camera.x) / tilemap.tileWidth);
  let y = ((pos.y - camera.y) / tilemap.tileHeight);

  if (x < 0 || x > tilemap.width || y < 0 || y > tilemap.height)
    return null;

  return tilemap.tiles[x + y * tilemap.width];
}

/**
 * 
 * @param {{x: number, y: number}} mouse 
 * @param {{x: number, y: number}} camera 
 * @returns {{x: number, y: number}} Returns tile position in pixel coordinates.
 */
function getTilePos(mouse, camera) {
  return {
    x: Math.floor((mouse.x - (camera.x * game.zoom)) / (tilemap.tileWidth * game.zoom)) * (tilemap.tileWidth) + camera.x,
    y: Math.floor((mouse.y - (camera.y * game.zoom)) / (tilemap.tileHeight * game.zoom)) * (tilemap.tileHeight) + camera.y
  };
}