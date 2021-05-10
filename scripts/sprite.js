let loadedSprites = 0;
let spriteId = 0;

export const SPRITE = {
  TILE_GREEN: spriteId++,
  TILE_PURPLE: spriteId++,
  TILE_RED: spriteId++,
  TILE_YELLOW: spriteId++,

  TILE_DIAGONAL_GREEN: spriteId++,
  TILE_DIAGONAL_PURPLE: spriteId++,
  TILE_DIAGONAL_RED: spriteId++,
  TILE_DIAGONAL_YELLOW: spriteId++,

  ARMY_GREEN: spriteId++,
  ARMY_PURPLE: spriteId++,
  ARMY_RED: spriteId++,
  ARMY_YELLOW: spriteId++,

  CAPITAL: spriteId++,
  CHURCH: spriteId++,
  FOREST: spriteId++,
  HOUSE: spriteId++,
  MOUNTAINS: spriteId++,
  TOWER: spriteId++,

  SELECT_WHITE: spriteId++,
  SELECT_GRAY: spriteId++,
  SELECTED: spriteId++
}

export const sprites = [
  "./sprites/tile_green.png",
  "./sprites/tile_purple.png",
  "./sprites/tile_red.png",
  "./sprites/tile_yellow.png",

  "./sprites/tile_diagonal_green.png",
  "./sprites/tile_diagonal_purple.png",
  "./sprites/tile_diagonal_red.png",
  "./sprites/tile_diagonal_yellow.png",

  "./sprites/army_green_small.png",
  "./sprites/army_purple_small.png",
  "./sprites/army_red_small.png",
  "./sprites/army_yellow_small.png",

  "./sprites/capital.png",
  "./sprites/church.png",
  "./sprites/forest.png",
  "./sprites/house.png",
  "./sprites/mountains.png",
  "./sprites/tower.png",

  "./sprites/select_white.png",
  "./sprites/select_gray.png",
  "./sprites/selected.png"
]

export function loadSprites(callback) {
  for (let i = 0; i < sprites.length; ++i) {
    let img = new Image();
    img.src = sprites[i];
    img.onload = function () {
      sprites[i] = img;

      if (++loadedSprites === sprites.length) {
        callback();
      }
    }
  }
}