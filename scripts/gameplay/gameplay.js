import { tilemap } from "../tilemap"
import { COUNTRY, util } from "../util";

export const gameplay = {
  moveArmy: moveArmy,
  canMoveArmy: canMoveArmy,
  armyAttackProvince: armyAttackProvince,
  canArmyAttackProvince: canArmyAttackProvince,
  armyAttackArmy: armyAttackArmy,
  canArmyAttackArmy: canArmyAttackArmy,
  recruitArmy: recruitArmy,
  canRecruitArmy: canRecruitArmy,
  build: build,
  canBuild: canBuild,
  destroy: destroy,
  canDestroy: canDestroy
}

/**
 * 
 * @param {{x: number, y: number}} armyPos 
 * @param {{x: number, y: number}} targetPos 
 */
function moveArmy(armyPos, targetPos) {
  if (!canMoveArmy(armyPos, targetPos))
    return;

  const armyTile = tilemap.getTile(armyPos.x, armyPos.y);
  const targetTile = tilemap.getTile(targetPos.x, targetPos.y);

  const armyId = armyTile.army.id;

  armyTile.l3 = null;
  armyTile.army.id = COUNTRY.NONE;
  armyTile.army.moved = false;

  targetTile.l3 = util.idToArmySprite(armyId);
  targetTile.army.id = armyId;
  targetTile.army.moved = true;

  // Acknowledge all clients
}

/**
 * 
 * @param {{x: number, y: number}} armyPos 
 * @param {{x: number, y: number}} targetPos 
 * @returns {boolean}
 */
function canMoveArmy(armyPos, targetPos) {
  // If out of bounds, army can not move
  if (targetPos.x < -1 || targetPos.x > tilemap.width || targetPos.y < -1 || targetPos.y > tilemap.height)
    return false;

  const armyTile = tilemap.getTile(armyPos.x, armyPos.y);
  const targetTile = tilemap.getTile(targetPos.x, targetPos.y);

  // If army has not moved & target tile has no army on it, army can move
  return !armyTile.army.moved && targetTile.army.id === COUNTRY.NONE;
}

function armyAttackProvince() {

}

function canArmyAttackProvince() {

}

function armyAttackArmy() {

}

function canArmyAttackArmy() {

}

function recruitArmy() {

}

function canRecruitArmy() {

}

function build() {

}

function canBuild() {

}

function destroy() {

}

function canDestroy() {

}