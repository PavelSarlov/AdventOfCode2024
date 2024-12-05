import { chain } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const lines = getLines("input.txt");

const rules = lines
  .filter((line) => line.match(/\d+\|\d+/))
  .map((line) => line.split("|").map((x) => Number(x)))
  .reduce((res, [x, y]) => {
    if (res.has(x)) {
      res.get(x).add(y);
    } else {
      res.set(x, new Set([y]));
    }
    return res;
  }, new Map());
const updates = lines
  .filter((line) => line.match(/\d+,\d+/))
  .map((line) => line.split(",").map((x) => Number(x)));

function isCorrectlyOrdered(update) {
  return update.every((x, i) => {
    if (!rules.has(x)) {
      return true;
    }
    for (let y = i - 1; y >= 0; y--) {
      if (rules.get(x).has(update[y])) {
        return false;
      }
    }
    return true;
  });
}

function part1() {
  return chain(updates)
    .filter((update) => isCorrectlyOrdered(update))
    .map((update) => update[Number.parseInt(update.length / 2)])
    .sum()
    .value();
}

function part2() {
  return chain(updates)
    .filter((update) => !isCorrectlyOrdered(update))
    .map((update) =>
      update.sort((a, b) =>
        rules.get(a)?.has(b) ? -1 : rules.get(b)?.has(a) ? 1 : 0,
      ),
    )
    .map((update) => update[Number.parseInt(update.length / 2)])
    .sum()
    .value();
}

console.log(part1());
console.log(part2());
