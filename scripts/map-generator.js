import { tilemap } from "./tilemap.js";
import { COUNTRY, LANDMARK, util } from "./util.js";
import { random } from "./random.js";

export const mapGenerator = {
  generate: generate
}

/**
 * 
 * @param {number} width 
 * @param {number} height 
 * @param {number} countryCount 
 */
function generate(width, height, countryCount) {
  const tiles = []
  const countries = [];
  const provinces = [];

  // Necessary for map generation
  const countryWidth = Math.floor(width / countryCount)
  const countryHeight = Math.floor(height / countryCount)
  const capitalDistance = countryWidth * countryWidth + countryHeight * countryHeight

  // Initialize countries & provinces
  for (let i = 0; i < countryCount; ++i) {
    countries.push({});
    provinces.push([]);
  }

  // Initialize an empty map
  for (let y = 0; y < width; ++y) {
    for (let x = 0; x < height; ++x) {
      tiles.push({
        x: x * 128,
        y: y * 128,
        countryId: COUNTRY.NONE,
        occupiedByCountryId: COUNTRY.NONE,
        landmarkId: LANDMARK.NONE,
        armyId: COUNTRY.NONE,
        l1: null,
        l2: null,
        l3: null
      });
    }
  }

  const capitals = chooseCapitals(width, height, countryCount, capitalDistance);
  for (let i = 0; i < countryCount; ++i) {
    const tileIndex = capitals[i].x + capitals[i].y * width;

    provinces[i].push({ x: capitals[i].x, y: capitals[i].y });

    tiles[tileIndex].countryId = i;
    tiles[tileIndex].landmarkId = LANDMARK.CAPITAL;

    tiles[tileIndex].l1 = util.countryIdToSprite(i);
    tiles[tileIndex].l2 = util.landmarkIdToSprite(LANDMARK.CAPITAL);
  }

  chooseProvinces(tiles, provinces, width, height)

  console.log(tiles);
  console.log(provinces);
  console.log(capitals);

  tilemap.width = width;
  tilemap.height = height;
  tilemap.tiles = tiles;
}

function chooseCapitals(width, height, countryCount, capitalDistance) {
  const capitals = [];

  // Select capital for each country
  for (let i = 0; i < countryCount; ++i) {
    capitals.push({ x: random(0, width - 1), y: random(0, height - 1) })
    if (i > 0) {
      for (let j = 0; j < capitals.length - 1; ++j) {
        const diffX = Math.abs(capitals[j].x - capitals[i].x)
        const diffY = Math.abs(capitals[j].y - capitals[i].y)
        const length = diffX * diffX + diffY * diffY;
        if (length < capitalDistance)
          return chooseCapitals(width, height, countryCount, capitalDistance)
      }
    }
  }

  return capitals;
}

function chooseProvinces(tiles, provinces, width, height) {
  let unoccupiedProvincesLeft = true;
  while (unoccupiedProvincesLeft) {
    unoccupiedProvincesLeft = false;

    for (let countryId = 0; countryId < provinces.length; ++countryId) {
      if (provinces[countryId].length === 0)
        continue;

      const provinceX = provinces[countryId][0].x;
      const provinceY = provinces[countryId][0].y;

      if (provinceY - 1 > -1 && tiles[(provinceX) + (provinceY - 1) * width].countryId === COUNTRY.NONE) {
        provinces[countryId].push({ x: provinceX, y: provinceY - 1 })
        tiles[(provinceX) + (provinceY - 1) * width].countryId = countryId;
        tiles[(provinceX) + (provinceY - 1) * width].l1 = util.countryIdToSprite(countryId);
      } else if (provinceX + 1 < width && tiles[(provinceX + 1) + (provinceY) * width].countryId === COUNTRY.NONE) {
        provinces[countryId].push({ x: provinceX + 1, y: provinceY })
        tiles[(provinceX + 1) + (provinceY) * width].countryId = countryId;
        tiles[(provinceX + 1) + (provinceY) * width].l1 = util.countryIdToSprite(countryId);
      } else if (provinceY + 1 < height && tiles[(provinceX) + (provinceY + 1) * width].countryId === COUNTRY.NONE) {
        provinces[countryId].push({ x: provinceX, y: provinceY + 1 })
        tiles[(provinceX) + (provinceY + 1) * width].countryId = countryId;
        tiles[(provinceX) + (provinceY + 1) * width].l1 = util.countryIdToSprite(countryId);
      } else if (provinceX - 1 > -1 && tiles[(provinceX - 1) + (provinceY) * width].countryId === COUNTRY.NONE) {
        provinces[countryId].push({ x: provinceX - 1, y: provinceY })
        tiles[(provinceX - 1) + (provinceY) * width].countryId = countryId;
        tiles[(provinceX - 1) + (provinceY) * width].l1 = util.countryIdToSprite(countryId);
      } else {
        provinces[countryId].splice(0, 1);
      }

      unoccupiedProvincesLeft |= provinces[countryId] !== 0;
    }
  }
}