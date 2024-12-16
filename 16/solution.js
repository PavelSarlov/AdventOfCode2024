import { MinHeap } from "@datastructures-js/heap";
import { chain } from "lodash-es";
import { getLines, subArray, sumArray } from "../lib/helpers.js";

const map = getLines("input.txt").map((l) => l.split(""));
const dirs = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
const start = map.reduce((_, l, i) =>
  l.indexOf("S") !== -1 ? [i, l.indexOf("S")] : _,
);
const end = map.reduce((_, l, i) =>
  l.indexOf("E") !== -1 ? [i, l.indexOf("E")] : _,
);

function bfs() {
  const visited = new Set();
  const pq = new MinHeap(({ points }) => points);
  pq.push({ pos: start, points: 0, dir: [0, 1] });

  const distances = new Map();

  while (pq.size()) {
    const {
      pos: [x, y],
      points,
      dir,
    } = pq.pop();
    const key = [x, y, dir].toString();

    if (visited.has(key)) {
      continue;
    }

    distances.set(key, Math.min(points, distances.get(key) ?? Infinity));
    visited.add(key);

    dirs
      .filter((d) => sumArray(d, dir).toString() !== [0, 0].toString())
      .forEach((d) => {
        const [nx, ny] = sumArray(d, [x, y]);
        if (map[nx][ny] !== "#") {
          pq.push({
            pos: [nx, ny],
            points: points + (d.toString() === dir.toString() ? 1 : 1001),
            dir: d,
          });
        }
      });
  }

  return distances;
}

function bfsBest() {
  const visited = new Set();
  const q = [];
  const best = bfs();
  const endBest = chain(dirs)
    .map((dir) => ({ pos: end, dir, points: best.get(`${[...end, dir]}`) }))
    .filter(({ points }) => points)
    .minBy(({ points }) => points)
    .value();
  q.push(endBest);

  while (q.length) {
    const {
      pos: [x, y],
      points,
      dir,
    } = q.shift();
    const key = [x, y, dir].toString();

    if (visited.has(key) || best.get(key) !== points) {
      continue;
    }

    visited.add(key);

    const [nx, ny] = subArray([x, y], dir);

    dirs
      .filter((d) => sumArray(d, dir).toString() !== [0, 0].toString())
      .forEach((d) => {
        q.push({
          pos: [nx, ny],
          points: points - 1,
          dir: d,
        });
        q.push({
          pos: [nx, ny],
          points: points - 1001,
          dir: d,
        });
      });
  }

  return new Set([...visited].map((v) => v.split(",").slice(0, 2).join())).size;
}

function part1() {
  const dist = bfs();
  return Math.min(
    ...dirs.map((dir) => dist.get(`${[...end, dir]}`)).filter((x) => x),
  );
}

function part2() {
  return bfsBest();
}

console.log(part1());
console.log(part2());
