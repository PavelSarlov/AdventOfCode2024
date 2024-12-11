import { getLines } from "../lib/helpers.js";

const [input] = getLines("input.txt").map((line) =>
  line.split(" ").map(BigInt),
);

function blink(stones) {
  return [...stones.entries()].reduce((newStones, [stone, times]) => {
    switch (true) {
      case stone === 0n:
        return newStones.set(1n, (newStones.get(1n) ?? 0) + times);
      case stone.toString().length % 2 === 0:
        const [s1, s2] = [
          BigInt(stone.toString().substring(0, stone.toString().length / 2)),
          BigInt(stone.toString().substring(stone.toString().length / 2)),
        ];

        newStones.set(s1, (newStones.get(s1) ?? 0) + times);
        newStones.set(s2, (newStones.get(s2) ?? 0) + times);
        return newStones;
      default:
        return newStones.set(
          stone * 2024n,
          (newStones.get(stone * 2024n) ?? 0) + times,
        );
    }
  }, new Map());
}

function countAfterBlinks(blinks) {
  const unique = input.reduce(
    (m, stone) =>
      m.has(stone) ? m.set(stone, m.get(stone) + 1) : m.set(stone, 1),
    new Map(),
  );

  const final = Array(blinks)
    .fill(0)
    .reduce((stones) => blink(stones), unique);

  return [...final.entries()].reduce((sum, [_, v]) => sum + v, 0);
}

function part1() {
  return countAfterBlinks(25);
}

function part2() {
  return countAfterBlinks(75);
}

console.log(part1());
console.log(part2());
