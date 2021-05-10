import { COUNTRY, util } from "../util.js";

export const panelTop = {
  init: init,
  update: update
}

function init(countryId) {
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
  }

  countryName.style.color = util.countryIdToColor(countryId);
}

/**
 * 
 * @param {import("../world").Country} country 
 */
function update(country) {
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