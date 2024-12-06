import { getLines, sumArray } from "../lib/helpers.js";

const map = getLines("input.txt").map((line) => line.split(""));
const obst = "#";

function getGuardPos(map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "^") {
        return [i, j];
      }
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

function visited() {
  let pos = getGuardPos(map);
  let dir = 0;
  const visited = new Set();

  while (map[pos[0]]?.[pos[1]]) {
    visited.add(pos.toString());

    let next = sumArray(pos, directions[dir]);
    while (map[next[0]]?.[next[1]] === obst) {
      dir = nextDir(dir);
      next = sumArray(pos, directions[dir]);
    }
    pos = next;
  }

  return visited;
}

function willLoop(pos) {
  return directions.some()
}

function part1() {
  return visited().size;
}

function part2() {
  const visits = [...visited()].map(v => v.split(',').map(Number));
}

console.log(part1());
console.log(part2());
