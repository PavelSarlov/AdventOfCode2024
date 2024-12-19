import { getLines } from "../lib/helpers.js";

const [towels, input] = getLines("input.txt").reduce(
  (res, line, i) =>
    i === 0
      ? [line.split(", ")]
      : line
        ? [res[0], [...(res[1] ?? []), line]]
        : res,
  [],
);
const patterns = new Set(towels);
const seen = new Map();

function hasPattern(design) {
  if (!design) {
    return 1;
  }
  if (seen.has(design)) {
    return seen.get(design);
  }

  let res = 0;
  for (const p of patterns) {
    if (design.startsWith(p)) {
      res += hasPattern(design.slice(p.length));
    }
  }
  seen.set(design, res);
  return res;
}

const possible = input.map((design) => hasPattern(design)).filter((x) => x);

function part1() {
  return possible.length;
}

function part2() {
  return possible.reduce((sum, v) => sum + v, 0);
}

console.log(part1());
console.log(part2());
