import { chain } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const input = "input.txt";
const robots = getLines(input).map((line) =>
  line
    .match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/)
    .slice(1)
    .map(Number),
);
const [rx, ry] = input === "example.txt" ? [11, 7] : [101, 103];
const [mx, my] = [Number.parseInt(rx / 2), Number.parseInt(ry / 2)];

function moveRobot([x, y, vx, vy]) {
  return [(x + vx + rx) % rx, (y + vy + ry) % ry, vx, vy];
}

function part1() {
  return chain(robots)
    .map((r) =>
      Array(100)
        .fill(0)
        .reduce((r) => moveRobot(r), r),
    )
    .filter(([x, y]) => x !== mx && y !== my)
    .groupBy(([x, y]) =>
      x < mx && y < my ? 0 : x > mx && y < my ? 1 : x < mx && y > my ? 2 : 3,
    )
    .map((g) => g.length)
    .reduce((m, l) => m * l)
    .value();
}

function part2() {
  let robs = robots.slice();
  let seconds = 0;

  while (true) {
    const room = Array(ry)
      .fill(null)
      .map(() => Array(rx).fill(" "));
    robs.forEach(
      ([x, y]) => (room[y][x] = (room[y][x] === " " ? 0 : room[y][x]) + 1),
    );

    console.log(seconds);
    console.log(room.map((l) => l.join("")).join("\n"));

    robs = robs.map(moveRobot);
    seconds++;
  }
}

console.log(part1());
part2();
