import { COUNTRY, util } from "../util.js";

export const panelTop = {
  update: update
}

/**
 * 
 * @param {import("../tilemap").Country} country 
 */
function update(countryId, country) {
  switch (countryId) {
    case COUNTRY.GREEN:
      countryName.textContent = "GREEN";
      break;
    case COUNTRY.PURPLE:
      countryName.textContent = "PURPLE";
      break;
    case COUNTRY.RED:
      countryName.textContent = "RED";
      break;
    case COUNTRY.YELLOW:
      countryName.textContent = "YELLOW";
      break;
    case COUNTRY.NONE:
      countryName.textContent = "NONE";
      break;
  }
  countryName.style.color = util.countryIdToColor(countryId);

  const goldText = "Gold: " + country.gold
  gold.textContent = goldText;
  gold.title = goldText;

  const incomeText = "Income: " + country.income
  income.textContent = incomeText;
  income.title = incomeText;

  const armyText = "Army: " + country.army + "/" + country.armyLimit;
  army.textContent = armyText;
  army.title = armyText;
}

const panel = document.getElementById("panel-top");

const countryName = document.getElementById("country_name");
const gold = document.getElementById("gold");
const income = document.getElementById("income");
const army = document.getElementById("army");