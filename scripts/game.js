import { SPRITE, sprites, loadSprites } from "./sprite.js";
import { tilemap } from "./tilemap.js";
import { ui } from "./ui/ui.js";
import { util } from "./util.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

loadSprites(() => {
  util.load("mertmalaq")
  ui.panelBottom.init()
  ui.chat.init()

  window.requestAnimationFrame(loop);
});

function draw() {
  const canvasWidth = canvas.width / game.zoom
  const canvasHeight = canvas.height / game.zoom

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i < tilemap.tiles.length; ++i) {
    if (tilemap.tiles[i].x + camera.x + tilemap.tileWidth > -1 && tilemap.tiles[i].x + camera.x < canvasWidth + 1
      && tilemap.tiles[i].y + camera.y + tilemap.tileHeight > -1 && tilemap.tiles[i].y + camera.y < canvasHeight + 1) {
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

//let time = 0;
//let dt = 0;
//let fps = 0;
function loop(timestamp) {
  //dt = (timestamp - time) / 1000;
  //time = timestamp;
  //fps = Math.round(1 / dt);
  //console.log(fps);

  draw();

  window.requestAnimationFrame(loop);
}

/** @type {{x: number, y: number, tile: import("./tilemap.js").Tile}} */
let selectedTile = null;
let highlightedTile = { x: 0, y: 0 };

let camera = { x: 0, y: 0 };
let mouse = { x: 0, y: 0 };

let transform = { e: 0, f: 0 };

let moved = false;
let pressed = false;

canvas.addEventListener("mousemove", (ev) => {
  if (pressed) {
    camera.x += (ev.x - mouse.x) / game.zoom;
    camera.y += (ev.y - mouse.y) / game.zoom;

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

canvas.addEventListener("wheel", (ev) => {
  const dt = Math.sign(ev.wheelDelta) * 0.05;
  game.zoom = util.clamp(game.zoom + dt, 0.5, 1.5);

  ctx.setTransform(game.zoom, 0, 0, game.zoom, mouse.x, mouse.y)
  const newTransform = ctx.getTransform();
  ctx.translate(-mouse.x / game.zoom, -mouse.y / game.zoom)
  console.log(game.zoom);
  //camera.x += -transform.e + newTransform.e;
  //camera.y += -transform.f + newTransform.f;
  //
  //transform = newTransform;
  //highlightedTile = tilemap.getTilePos(mouse, camera);
})

window.addEventListener("resize", (ev) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Set zoom level back because it's reset after resize event
  ctx.setTransform(game.zoom, 0, 0, game.zoom, 0, 0)
})

export const game = {
  selectTile: selectTile,
  unselectTile: unselectTile,
  zoom: 1
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