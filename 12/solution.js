import { chain } from "lodash-es";
import { getLines, subArray, sumArray } from "../lib/helpers.js";

const map = getLines("input.txt").map((line) => line.split(""));
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
  return chain([
    ...chain([...r])
      .reduce((m, x) => {
        const plot = x.split(",").map(Number);
        const [p1, p2, p3, p4] = [
          [0, 0],
          [1, 1],
          [1, 0],
          [0, 1],
        ].map((p) => `${sumArray(p, plot)}`);
        m.set(p1, [...(m.get(p1) ?? []), p2]);
        m.set(p2, [...(m.get(p2) ?? []), p1]);
        m.set(p3, [...(m.get(p3) ?? []), p4]);
        m.set(p4, [...(m.get(p4) ?? []), p3]);
        return m;
      }, new Map())
      .value()
      .values(),
  ])
    .map((diags) =>
      Number(
        [1, 3].includes(diags.length) ||
          (diags.length === 2 &&
            Number(
              (() => {
                const [left, right] = diags.map((diag) =>
                  diag.split(",").map(Number),
                );
                return `${subArray(left, right, true)}` === "2,2";
              })(),
            ) * 2),
      ),
    )
    .sum()
    .value();
}

function part1() {
  return chain(regions)
    .map((region) => region.size * getRegionPerimeter(region))
    .sum()
    .value();
}

function part2() {
  return chain(regions)
    .map((region) => region.size * getRegionSides(region))
    .sum()
    .value();
}

console.log(part1());
console.log(part2());
