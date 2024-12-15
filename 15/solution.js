import { cloneDeep, isNil } from "lodash-es";
import { getLines, multiplyArray, sumArray } from "../lib/helpers.js";

const [map, moves] = getLines("input.txt").reduce(
  (arr, line) => {
    if (line) {
      arr[arr[2]].push(line.split(""));
      arr[1] = arr[1].flat();
    } else {
      arr[2]++;
    }
    return arr;
  },
  [[], [], 0],
);
const dirs = {
  "^": [-1, 0],
  "<": [0, -1],
  v: [1, 0],
  ">": [0, 1],
};

function getRobotPos(map) {
  return map.reduce(
    (pos, line, i) => (line.indexOf("@") >= 0 ? [i, line.indexOf("@")] : pos),
    null,
  );
}

function getLastInLine([x, y], dir, map) {
  while (![".", "#"].includes(map[x][y])) {
    [x, y] = sumArray([x, y], dir);
  }

  return map[x][y] === "." ? [x, y] : [];
}

function getNextRange([x, [ys, ye]], map) {
  ys = map[x][ys] === "]" ? ys - 1 : ys;
  ye = map[x][ye] === "[" ? ye + 1 : ye;
  const range = map[x].slice(ys, ye + 1);
  const i = range.indexOf("[");
  const j = range.lastIndexOf("]");
  return i === -1 ? [] : [i + ys, j + ys];
}

function getRanges([x, [ys, ye]], dir, map) {
  const ranges = [];

  while (true) {
    const [px, [pys, pye]] = [x, [ys, ye]];
    const nx = x + dir[0];

    if (map[nx].slice(pys, pye + 1).indexOf("#") !== -1) {
      return [];
    }

    [x, [ys, ye]] = [nx, getNextRange([nx, [pys, pye]], map)];

    if (isNil(pys)) {
      break;
    }

    ranges.unshift([px, [pys, pye]]);
  }

  return ranges;
}

function moveRobot([x, y], move, map) {
  const dir = dirs[move];
  const [nx, ny] = sumArray([x, y], dir);

  let [lx, ly] = getLastInLine([nx, ny], dir, map);

  if (!isNil(lx)) {
    const opDir = multiplyArray(dir, -1);

    while ([x, y].toString() !== [lx, ly].toString()) {
      const [px, py] = sumArray([lx, ly], opDir);
      [map[lx][ly], map[px][py]] = [map[px][py], map[lx][ly]];
      [lx, ly] = [px, py];
    }

    return [nx, ny];
  }

  return [x, y];
}

function moveRanges([x, y], move, map) {
  const dir = dirs[move];
  const ranges = getRanges([x, [y, y]], dir, map);
  const [nx, ny] = sumArray([x, y], dir);

  if (ranges.length) {
    // console.log(ranges);
    for (const [rx, [rys, rye]] of ranges) {
      const [nrx] = sumArray([rx, 0], dir);
      const s1 = map[nrx].slice(rys, rye + 1);
      const s2 = map[rx].slice(rys, rye + 1);

      map[nrx].splice(rys, s2.length, ...s2);
      map[rx].splice(rys, s1.length, ...s1);
    }
    return [nx, ny];
  }

  [].splice();

  return [x, y];
}

function getCoordsSum(map, sym) {
  return map.reduce(
    (_, line, i) =>
      line.reduce((sum, x, j) => (x === sym ? sum + 100 * i + j : sum), _),
    0,
  );
}

function part1() {
  const lMap = cloneDeep(map);
  let pos = getRobotPos(lMap);
  for (const move of moves) {
    pos = moveRobot(pos, move, lMap);
  }
  return getCoordsSum(lMap, "O");
}

function part2() {
  const lMap = map.map((line) =>
    line.flatMap((l) =>
      l === "O" ? ["[", "]"] : l === "@" ? ["@", "."] : [l, l],
    ),
  );
  let pos = getRobotPos(lMap);
  for (const move of moves) {
    if (["<", ">"].includes(move)) {
      pos = moveRobot(pos, move, lMap);
    } else {
      pos = moveRanges(pos, move, lMap);
    }
  }
  return getCoordsSum(lMap, "[");
}

console.log(part1());
console.log(part2());
