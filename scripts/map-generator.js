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
  /** @type {import("./tilemap.js").Tile[]} */
  const tiles = []
  /** @type {import("./tilemap.js").Country[]} */
  const countries = [];
  const provinces = [];
  const evaluationPoints = [];

  // Necessary for map generation
  const countryWidth = Math.floor(width / countryCount)
  const countryHeight = Math.floor(height / countryCount)
  const capitalDistance = countryWidth * countryWidth + countryHeight * countryHeight

  // Initialize countries, provinces & evaluation points
  for (let i = 0; i < countryCount; ++i) {
    evaluationPoints.push(Math.floor(width * height / 2));
    provinces.push([]);
    countries.push({
      army: 0,
      armyLimit: 1,
      gold: 0,
      income: 1
    });
  }

  // Initialize an empty map
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
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

  const origins = chooseOrigins(width, height, countryCount, capitalDistance);
  for (let i = 0; i < countryCount; ++i) {
    const tileIndex = origins[i].x + origins[i].y * width;

    provinces[i].push({ x: origins[i].x, y: origins[i].y });

    tiles[tileIndex].countryId = i;
    tiles[tileIndex].l1 = util.countryIdToSprite(i);
  }

  chooseProvinces(tiles, provinces, width, height)
  sprinkleNature(tiles);
  evaluateCountries(tiles, evaluationPoints);

  // Set the evaluation points as the gold of the countries
  for (let i = 0; i < countries.length; ++i)
    countries[i].gold = util.clamp(evaluationPoints[i], width * height / 4, width * height / 2);

  console.log(tiles);
  console.log(origins);
  console.log(countries);

  tilemap.width = width;
  tilemap.height = height;
  tilemap.tiles = tiles;
  tilemap.countries = countries;
}

function chooseOrigins(width, height, countryCount, capitalDistance) {
  const origins = [];

  // Select origin for each country
  for (let i = 0; i < countryCount; ++i) {
    origins.push({ x: random.number(0, width - 1), y: random.number(0, height - 1) })
    if (i > 0) {
      for (let j = 0; j < origins.length - 1; ++j) {
        const diffX = Math.abs(origins[j].x - origins[i].x)
        const diffY = Math.abs(origins[j].y - origins[i].y)
        const length = diffX * diffX + diffY * diffY;
        if (length < capitalDistance)
          return chooseOrigins(width, height, countryCount, capitalDistance)
      }
    }
  }

  return origins;
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

      const upIndex = (provinceX) + (provinceY - 1) * width
      const rightIndex = (provinceX + 1) + (provinceY) * width
      const downIndex = (provinceX) + (provinceY + 1) * width
      const leftIndex = (provinceX - 1) + (provinceY) * width

      if (provinceY - 1 > -1 && tiles[upIndex].countryId === COUNTRY.NONE) {
        provinces[countryId].push({ x: provinceX, y: provinceY - 1 })
        tiles[upIndex].countryId = countryId;
        tiles[upIndex].l1 = util.countryIdToSprite(countryId);
      } else if (provinceX + 1 < width && tiles[rightIndex].countryId === COUNTRY.NONE) {
        provinces[countryId].push({ x: provinceX + 1, y: provinceY })
        tiles[rightIndex].countryId = countryId;
        tiles[rightIndex].l1 = util.countryIdToSprite(countryId);
      } else if (provinceY + 1 < height && tiles[downIndex].countryId === COUNTRY.NONE) {
        provinces[countryId].push({ x: provinceX, y: provinceY + 1 })
        tiles[downIndex].countryId = countryId;
        tiles[downIndex].l1 = util.countryIdToSprite(countryId);
      } else if (provinceX - 1 > -1 && tiles[leftIndex].countryId === COUNTRY.NONE) {
        provinces[countryId].push({ x: provinceX - 1, y: provinceY })
        tiles[leftIndex].countryId = countryId;
        tiles[leftIndex].l1 = util.countryIdToSprite(countryId);
      } else {
        provinces[countryId].splice(0, 1);
      }

      unoccupiedProvincesLeft |= provinces[countryId] !== 0;
    }
  }
}

function sprinkleNature(tiles) {
  for (let i = 0; i < tiles.length; ++i) {
    tiles[i].landmarkId = random.percent([
      { percent: 15, result: LANDMARK.FOREST },
      { percent: 15, result: LANDMARK.MOUNTAINS },
      { percent: 70, result: LANDMARK.NONE },
    ]);
    tiles[i].l2 = util.landmarkIdToSprite(tiles[i].landmarkId);
  }
}

function evaluateCountries(tiles, evaluationPoints) {
  for (let i = 0; i < tiles.length; ++i) {
    const landmarkId = tiles[i].landmarkId;
    const countryId = tiles[i].countryId;

    switch (landmarkId) {
      case LANDMARK.FOREST:
        evaluationPoints[countryId] -= 1;
        break;
      case LANDMARK.MOUNTAINS:
        evaluationPoints[countryId] -= 1;
        break;
      case LANDMARK.NONE:
        evaluationPoints[countryId] -= 0;
        break;
    }

    // Subtract 1 evaluation point for each province
    evaluationPoints[countryId] -= 1;
  }
}