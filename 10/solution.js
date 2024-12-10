import { chain, isNil } from "lodash-es";
import { getLines, sumArray } from "../lib/helpers.js";

const map = getLines("input.txt").map((line) => line.split("").map(Number));
const dirs = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
const trailheads = [
  ...map.reduce(
    (_, r, i) => r.reduce((s, c, j) => (c === 0 ? s.add(`${[i, j]}`) : s), _),
    new Set(),
  ),
].map((th) => th.split(",").map(Number));

function exists([x, y]) {
  return !isNil(map[x]?.[y]);
}

function part1() {
  function traverse([x, y], visited, scores) {
    const key = `${[x, y]}`;

    if (!exists([x, y]) || visited.has(key)) return;
    if (map[x][y] === 9) {
      scores.add(key);
      return;
    }

    visited.add(key);
    dirs.forEach((dir) => {
      const next = sumArray(dir, [x, y]);
      if (exists(next) && map[next[0]][next[1]] - map[x][y] === 1) {
        traverse(next, visited, scores);
      }
    });
    visited.delete(key);
  }

  return chain(trailheads)
    .map((th) => {
      const scores = new Set();
      traverse(th, new Set(), scores);
      return scores.size;
    })
    .sum()
    .value();
}

function part2() {
  function traverse([x, y], visited) {
    const key = `${[x, y]}`;

    if (!exists([x, y]) || visited.has(key)) return 0;
    if (map[x][y] === 9) return 1;

    visited.add(key);
    const ratings = chain(dirs)
      .map((dir) => {
        const next = sumArray(dir, [x, y]);
        return exists(next) && map[next[0]][next[1]] - map[x][y] === 1
          ? traverse(next, visited)
          : 0;
      })
      .sum()
      .value();
    visited.delete(key);
    return ratings;
  }

  return chain(trailheads)
    .map((th) => traverse(th, new Set()))
    .sum()
    .value();
}

console.log(part1());
console.log(part2());
