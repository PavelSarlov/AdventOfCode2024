import { chain, uniq } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const lines = getLines("input.txt");
const mulPattern = /mul\((\d+),(\d+)\)/g;

function mul(op) {
  return Number.parseFloat(
    op.replace(
      mulPattern,
      (_, x, y) => Number.parseFloat(x) * Number.parseFloat(y),
    ),
  );
}

function part1() {
  return chain(lines)
    .map((line) => [...line.matchAll(mulPattern)].map((m) => mul(m[0])))
    .flatten()
    .sum()
    .value();
}

function part2() {
  const doPattern = /do\(\)/g;
  const dontPattern = /don't\(\)/g;

  const fullPattern = new RegExp(
    [mulPattern.source, doPattern.source, dontPattern.source].join("|"),
    uniq([mulPattern.flags, doPattern.flags, dontPattern.flags].join("")),
  );

  let shouldAdd = true;

  return chain(lines)
    .map((line) => [...line.matchAll(fullPattern)])
    .flatten()
    .map((m) => {
      if (shouldAdd && m[0].match(mulPattern)) {
        return mul(m[0]);
      } else if (m[0].match(doPattern)) {
        shouldAdd = true;
      } else {
        shouldAdd = false;
      }

      return 0;
    })
    .sum()
    .value();
}

console.log(part1());
console.log(part2());
