import { chain } from "lodash-es";
import { getLines, sumArray } from "../lib/helpers.js";

const map = getLines("example4.txt").map((line) => line.split(""));
const dirs = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function getRegion(r, [x, y]) {
  if (map[x]?.[y] !== r) return [];
  map[x][y] = null;
  return [
    [x, y],
    ...dirs.flatMap((dir) => getRegion(r, sumArray([x, y], dir))),
  ];
}

const regions = map
  .reduce(
    (_, line, i) =>
      line.reduce(
        (regs, p, j) => (p ? [...regs, getRegion(p, [i, j])] : regs),
        _,
      ),
    [],
  )
  .map((region) => new Set(region.map((x) => x.toString())));

function getRegionPerimeter(r) {
  return [...r].reduce(
    (p, plot) =>
      p +
      chain(dirs)
        .map((dir) => {
          const newPlot = sumArray(dir, plot.split(",").map(Number));
          return r.has(`${newPlot}`) ? 0 : 1;
        })
        .sum()
        .value(),
    0,
  );
}

function getRegionSides(r) {
  const outerPlots = new Set(
    [...r]
      .map((x) => x.split(",").map(Number))
      .filter((plot) =>
        dirs.some((dir) => {
          const nextPlot = sumArray(dir, plot);
          return !r.has(`${nextPlot}`);
        }),
      )
      .map((x) => `${x}`),
  );

  const startingPlot = [...outerPlots][0].split(",").map(Number);
  outerPlots.delete(startingPlot);

  let sides = 0;

  while (outerPlots.size) {}

  return sides;
}

getRegionSides(regions[0]);

function part1() {
  return chain(regions)
    .map((region) => region.size * getRegionPerimeter(region))
    .sum()
    .value();
}

function part2() {}

console.log(part1());
console.log(part2());
