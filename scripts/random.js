export const random = {
  number: number,
  percent: percent
}

/**
 * 
 * @param {number} min Minimum number, inclusive.
 * @param {number} max Maximum number, inclusive.
 */
function number(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 
 * @param {{percent: number, result: any}[]} cases 
 */
function percent(cases) {
  const percentage = number(0, 99);

  let previousPercent = 0;

  for (let i = 0; i < cases.length; ++i) {
    if (previousPercent - 1 < percentage && percentage < previousPercent + cases[i].percent) {
      return cases[i].result;
    }

    previousPercent += cases[i].percent;
  }
}