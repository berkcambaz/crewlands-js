import { random } from "./random.js";
import { SPRITE, sprites, loadSprites } from "./sprite.js";
import { tilemap } from "./tilemap.js";
import { world } from "./world.js";
import { COUNTRY, LANDMARK, util } from "./util.js";
import { ui } from "./ui/ui.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

loadSprites(() => {
  //for (let y = 0; y < tilemap.height; ++y) {
  //  for (let x = 0; x < tilemap.width; ++x) {
  //    let countryId = random.number(COUNTRY.GREEN, COUNTRY.YELLOW)
  //    let occupiedByCountryId = COUNTRY.NONE
  //    let landmarkId = random.number(LANDMARK.CAPITAL, LANDMARK.TOWER)
  //    let armyId = random.number(COUNTRY.GREEN, COUNTRY.YELLOW)
  //
  //    tilemap.tiles.push({
  //      x: x * 128,
  //      y: y * 128,
  //      l1: util.countryIdToSprite(countryId, occupiedByCountryId),
  //      l2: util.landmarkIdToSprite(landmarkId),
  //      l3: util.countryIdToArmySprite(armyId),
  //      countryId: countryId,
  //      occupiedByCountryId: occupiedByCountryId,
  //      landmarkId: landmarkId,
  //      armyId: armyId
  //    });
  //  }
  //}

  util.load("save")
  //util.save("save")
  //util.getAllSaves();
  ui.panelTop.init(COUNTRY.YELLOW)
  ui.panelTop.update(world.countries[COUNTRY.YELLOW])
  ui.panelBottom.init()
  ui.chat.init()

  window.requestAnimationFrame(loop);
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < tilemap.tiles.length; ++i) {
    if (tilemap.tiles[i].x + camera.x + tilemap.tileWidth > -1 && tilemap.tiles[i].x + camera.x < canvas.width + 1
      && tilemap.tiles[i].y + camera.y + tilemap.tileHeight > -1 && tilemap.tiles[i].y + camera.y < canvas.height + 1) {
      const posX = tilemap.tiles[i].x + camera.x;
      const posY = tilemap.tiles[i].y + camera.y;
      if (tilemap.tiles[i].l1) ctx.drawImage(tilemap.tiles[i].l1, posX, posY)
      if (tilemap.tiles[i].l2) ctx.drawImage(tilemap.tiles[i].l2, posX, posY)
      if (tilemap.tiles[i].l3) ctx.drawImage(tilemap.tiles[i].l3, posX, posY)
    }
  }

  ctx.drawImage(sprites[SPRITE.SELECT_WHITE], highlightedTile.x, highlightedTile.y);

  if (selectedTile) {
    ctx.drawImage(sprites[SPRITE.SELECTED], selectedTile.x + camera.x, selectedTile.y + camera.y);
  }
}

let time = 0;
let dt = 0;
let fps = 0;
function loop(timestamp) {
  dt = (timestamp - time) / 1000;
  time = timestamp;
  fps = Math.round(1 / dt);
  //console.log(fps);

  draw();

  window.requestAnimationFrame(loop);
}

/** @type {{x: number, y: number, tile: import("./tilemap.js").Tile}} */
let selectedTile = null;
let highlightedTile = { x: 0, y: 0 };
let camera = { x: 0, y: 0 };
let mouse = { x: 0, y: 0 };
let moved = false;
let pressed = false;

canvas.addEventListener("mousemove", (ev) => {
  if (pressed) {
    camera.x += ev.x - mouse.x;
    camera.y += ev.y - mouse.y;

    moved = true;
  }

  mouse.x = ev.x;
  mouse.y = ev.y;

  highlightedTile = tilemap.getTilePos(mouse, camera);
})

canvas.addEventListener("mousedown", (ev) => {
  mouse.x = ev.x;
  mouse.y = ev.y;

  pressed = true;
})

canvas.addEventListener("mouseup", (ev) => {
  if (!moved) {
    let tilePos = tilemap.getTilePos(mouse, camera);
    let tile = tilemap.getTileAt(tilePos, camera);

    if (!tile || (selectedTile && selectedTile.tile === tile)) {
      unselectTile();
    } else {
      selectTile(tilePos, tile);
    }
  }

  pressed = false;
  moved = false;
})

window.addEventListener("resize", (ev) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})

export const game = {
  selectTile: selectTile,
  unselectTile: unselectTile
}

function selectTile(tilePos, tile) {
  selectedTile = { x: tilePos.x - camera.x, y: tilePos.y - camera.y, tile: tile };

  ui.panelBottom.update(tile);
  ui.panelBottom.show(true);
}

function unselectTile() {
  selectedTile = null;

  ui.panelBottom.show(false);
}