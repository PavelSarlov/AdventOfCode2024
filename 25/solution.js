import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt", "\n\n").map((l) =>
  l.split("\n").map((r) => r.split("")),
);

const locks = input
  .filter((l) => l[0].every((c) => c === "#"))
  .map((l) =>
    l.slice(1).reduce(
      (h, r) => r.map((c, i) => (c === "#" ? h[i] + 1 : h[i])),
      l[0].map(() => 0),
    ),
  );
const keys = input
  .filter((l) => l[0].every((c) => c === "."))
  .map((l) =>
    l.slice(0, l.length - 1).reduce(
      (h, r) => r.map((c, i) => (c === "#" ? h[i] + 1 : h[i])),
      l[0].map(() => 0),
    ),
  );

function fits(lock, key) {
  return lock.every((col, i) => col + key[i] <= 5);
}

function part1() {
  let pairs = 0;

  for (const lock of locks) {
    for (const key of keys) {
      pairs += Number(fits(lock, key));
    }
  }

  return pairs;
}

console.log(part1());
