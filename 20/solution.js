import { MinHeap } from "@datastructures-js/heap";
import { chain } from "lodash-es";
import { getLines, strToCoord, sumArray } from "../lib/helpers.js";

const map = getLines("input.txt").map((l) => l.split(""));
const start = map.reduce((_, l, i) =>
  l.indexOf("S") !== -1 ? [i, l.indexOf("S")] : _,
);
const dirs = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function isValid([x, y]) {
  return ["S", "E", "."].includes(map[x]?.[y]);
}

function getDist([sx, sy], [ex, ey]) {
  return Math.abs(sx - ex) + Math.abs(sy - ey);
}

function getCheatBlocks() {
  return map.reduce(
    (_, l, i) =>
      l.reduce((s, b, j) => {
        const [up, right, down, left] = dirs.map((dir) =>
          sumArray(dir, [i, j]),
        );
        const upDown = isValid(up) && isValid(down) && [up, down];
        const leftRight = isValid(left) && isValid(right) && [left, right];
        if (b === "#" && (upDown || leftRight)) {
          s.set(
            [i, j].toString(),
            (upDown || leftRight).map((x) => x.toString()),
          );
        }
        return s;
      }, _),
    new Map(),
  );
}

function bfs() {
  const pq = new MinHeap(({ d }) => d);
  pq.push({ x: start[0], y: start[1], d: 0 });

  const visited = new Map();

  while (pq.size()) {
    const { x, y, d } = pq.pop();

    const key = [x, y].toString();

    if (!visited.get(key) || visited.get(key) > d) {
      visited.set(key, d);
    } else {
      continue;
    }

    for (const dir of dirs) {
      const [nx, ny] = sumArray(dir, [x, y]);
      if (map[nx]?.[ny] && map[nx][ny] !== "#") {
        pq.push({ x: nx, y: ny, d: d + 1 });
      }
    }
  }

  return visited;
}

function part1() {
  const dists = bfs();
  const cheats = getCheatBlocks();

  return chain([...cheats.values()])
    .map(([s, e]) => Math.abs(dists.get(s) - dists.get(e)) - 2)
    .filter((x) => x >= 100)
    .value().length;
}

function part2() {
  const dists = bfs();
  const distsArr = [...dists.keys()];
  const saved = [];
  // let best = 0;
  for (let i = 0; i < distsArr.length - 1; i++) {
    for (let j = i + 1; j < distsArr.length; j++) {
      // if (Math.floor(i / 100) > best) {
      //   console.log(i, j, distsArr.length);
      //   best = Math.floor(i / 100);
      // }
      const s = distsArr[i];
      const e = distsArr[j];
      const dist = getDist(strToCoord(s), strToCoord(e));
      const save = Math.abs(dists.get(s) - dists.get(e)) - dist;
      if (dist <= 20 && save > 0) {
        saved.push(save);
      }
    }
  }

  return saved.filter((x) => x >= 100).length;
}

console.log(part1());
console.log(part2());
