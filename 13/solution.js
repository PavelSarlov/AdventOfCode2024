import { getLines } from "../lib/helpers.js";
import { chain } from "lodash-es";

let i = 0;
const equations = getLines("input.txt").reduce((all, line) => {
  line = line
    .match(/(Button (.): X\+(\d+), Y\+(\d+)|(Prize): X=(\d+), Y=(\d+))/)
    ?.slice(2)
    .filter((x) => x);
  if (!line) {
    i++;
    return all;
  }
  all[i] = {
    ...(all[i] ?? {}),
    [line[0].toLowerCase()]: line.slice(1).map(Number),
  };
  return all;
}, []);

function solveEq({ a: [a1, a2], b: [b1, b2], prize: [X, Y] }) {
  const x = (Y * b1 - X * b2) / (b1 * a2 - b2 * a1);
  const y = Math.min(
    ...[(X - x * a1) / b1, (Y - x * a2) / b2].filter(Number.isInteger),
  );

  if (!Number.isInteger(x) || y === Infinity) {
    return 0;
  }

  return x * 3 + y;
}

function part1() {
  return chain(equations).map(solveEq).sum().value();
}

function part2() {
  equations.forEach(
    (eq) => (eq.prize = eq.prize.map((x) => x + 10000000000000)),
  );
  return part1();
}

console.log(part1());
console.log(part2());
