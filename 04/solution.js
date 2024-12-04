import { chain } from "lodash-es";
import { getLines, sumArray } from "../lib/helpers.js";

const lines = getLines("input.txt").map((l) => l.toLowerCase().split(""));

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];

const diagonals = [
  [-1, 1],
  [-1, -1],
];

function checkXmas(coords) {
  if (lines[coords[0]]?.[coords[1]] !== "x") {
    return 0;
  }
  const xmas = "xmas";

  return chain(directions)
    .map((dir) => {
      let i = 1;
      do {
        const [x, y] = coords.map((c, j) => c + dir[j] * i);
        if (lines[x]?.[y] != xmas[i]) {
          return 0;
        }
      } while (xmas[++i]);
      return 1;
    })
    .sum()
    .value();
}

function checkMas(coords) {
  if (lines[coords[0]]?.[coords[1]] !== "a") {
    return 0;
  }

  return Number(
    diagonals.every((diag) => {
      const [x, y] = sumArray(diag, coords);
      const [rx, ry] = sumArray(
        diag.map((x) => x * -1),
        coords,
      );

      return (
        (lines[x]?.[y] === "m" && lines[rx]?.[ry] === "s") ||
        (lines[x]?.[y] === "s" && lines[rx]?.[ry] === "m")
      );
    }),
  );
}

function part1() {
  return chain(lines)
    .flatMap((line, x) => line.map((_, y) => checkXmas([x, y])))
    .sum()
    .value();
}

function part2() {
  return chain(lines)
    .flatMap((line, x) => line.map((_, y) => checkMas([x, y])))
    .sum()
    .value();
}

console.log(part1());
console.log(part2());
