import { getLines, sumArray } from "../lib/helpers.js";
import { MinHeap } from "@datastructures-js/heap";

const f = "input.txt";
const input = getLines(f);
const bytes = f === "example.txt" ? 12 : 1024;
const end = f === "example.txt" ? [6, 6] : [70, 70];
const dirs = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function bfs(mBytes) {
  const pq = new MinHeap(({ d }) => d);
  const mem = new Set(input.slice(0, mBytes));
  pq.push({ x: 0, y: 0, d: 0 });

  const visited = new Map();

  while (pq.size()) {
    const { x, y, d } = pq.pop();

    const key = [x, y].toString();

    if (d !== Infinity && (!visited.get(key) || visited.get(key) > d)) {
      visited.set(key, d);
    } else {
      continue;
    }

    for (const dir of dirs) {
      const [nx, ny] = sumArray(dir, [x, y]);
      if (nx >= 0 && nx <= end[0] && ny >= 0 && ny <= end[1]) {
        if (mem.has([nx, ny].toString())) {
          pq.push({ x: nx, y: ny, d: Infinity });
        } else {
          pq.push({ x: nx, y: ny, d: d + 1 });
        }
      }
    }
  }

  return visited.get(end.toString());
}

function binSearch(l, r) {
  const m = Math.floor((l + r) / 2);
  if (m === r) {
    return input[m - 1];
  }
  const res = bfs(m);
  return !res ? binSearch(l, m) : binSearch(m + 1, r);
}

function part1() {
  return bfs(bytes);
}

function part2() {
  return binSearch(bytes + 1, input.length - 1);
}

console.log(part1());
console.log(part2());
