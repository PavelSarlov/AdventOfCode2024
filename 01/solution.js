import { chain, isNil, sum } from "lodash-es";
import { getLines, subArray } from "../lib/helpers.js";

const lines = getLines("input.txt");

const [arr1, arr2] = chain(lines)
  .reduce(
    (prev, line) => {
      const [x, y] = line.split(/\s+/).map(Number);
      prev[0].push(x);
      prev[1].push(y);
      return prev;
    },
    [[], []],
  )
  .map((arr) => arr.sort())
  .value();

function part1() {
  return sum(subArray(arr1, arr2, true));
}

function part2() {
  const scores = arr2.reduce((prev, curr) => {
    const val = prev.get(curr);
    return prev.set(curr, isNil(val) ? 1 : val + 1);
  }, new Map());

  return arr1.reduce((prev, curr) => prev + (scores.get(curr) ?? 0) * curr, 0);
}

console.log("part1", part1());
console.log("part2", part2());
