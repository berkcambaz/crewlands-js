/**
 * 
 * @param {number} min Minimum number, inclusive
 * @param {number} max Maximum number, inclusive
 */
export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}