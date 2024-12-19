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

function hasPattern(design, matched = "", seen) {
  if (seen.has(matched)) {
    return 0;
  }
  if (matched.length === design.length) {
    return 1;
  }

  seen.add(matched);

  let res = 0;
  for (const p of patterns) {
    if (design.match(new RegExp(`^${matched}${p}`))) {
      res += hasPattern(design, `${matched}${p}`, seen);
    }
  }
  return res;
}

const possible = input
  .map((design, i) => {
    console.log(design.length, patterns.size, i, input.length);
    return hasPattern(design, "", new Set());
  })
  .filter((x) => x);

function part1() {
  return possible.length;
}

function part2() {
  return;
}

console.log(part1());
console.log(part2());
