import { MinHeap } from "@datastructures-js/heap";
import { getLines, sumArray } from "../lib/helpers.js";

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

function bfs() {
  const visited = new Set();
  const pq = new MinHeap(({ points }) => points);
  pq.push({ pos: start, points: 0, dir: [0, 1] });

  while (pq.size()) {
    const {
      pos: [x, y],
      points,
      dir,
    } = pq.pop();

    if (map[x][y] === "E") {
      return points;
    }

    if (visited.has([x, y, dir].toString())) {
      continue;
    }

    visited.add([x, y, dir].toString());

    dirs
      .filter((d) => sumArray(d, dir) !== [0, 0].toString())
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
}

function dfs({ pos: [x, y], points, dir }, visited, best, nodes) {
  if (map[x][y] === "E" && best === points) {
    [...visited].forEach((v) => nodes.add(v));
    nodes.add([x, y].toString());
    return;
  }

  visited.add([x, y].toString());

  dirs
    .filter((d) => sumArray(d, dir) !== [0, 0].toString())
    .forEach((d) => {
      const [nx, ny] = sumArray(d, [x, y]);
      if (map[nx][ny] !== "#" && !visited.has([nx, ny].toString())) {
        dfs(
          {
            pos: [nx, ny],
            points: points + (d.toString() === dir.toString() ? 1 : 1001),
            dir: d,
          },
          visited,
          best,
          nodes,
        );
      }
    });

  visited.delete([x, y].toString());
}

function part1() {
  return bfs();
}

function part2() {
  const nodes = new Set();
  const visited = new Set();
  dfs({ pos: start, points: 0, dir: [0, 1] }, visited, bfs(), nodes);
  return nodes.size;
}

console.log(part1());
console.log(part2());
