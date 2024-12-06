import { getLines, sumArray } from "../lib/helpers.js";

const map = getLines("input.txt").map((line) => line.split(""));
const obst = "#";
let guardPos;

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (map[i][j] === "^") {
      guardPos = [i, j];
    }
  }
}

const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

function nextDir(dir) {
  return (dir + 1) % directions.length;
}

function visited(checkLoop) {
  let pos = guardPos;
  let dir = 0;
  const visited = new Set();

  while (map[pos[0]]?.[pos[1]]) {
    const entry = `${pos.toString()}${checkLoop ? `,${dir}` : ""}`;

    if (checkLoop && visited.has(entry)) {
      return true;
    }

    visited.add(entry);

    let next = sumArray(pos, directions[dir]);
    while (map[next[0]]?.[next[1]] === obst) {
      dir = nextDir(dir);
      next = sumArray(pos, directions[dir]);
    }
    pos = next;
  }

  return checkLoop ? false : visited;
}

function part1() {
  return visited().size;
}

function part2() {
  const visits = [...visited()].map((v) => v.split(",").map(Number));

  return visits.filter(([x, y]) => {
    map[x][y] = obst;
    const loops = visited(true);
    map[x][y] = ".";
    return loops;
  }).length;
}

console.log(part1());
console.log(part2());
