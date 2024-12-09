import { getLines } from "../lib/helpers.js";

const [input] = getLines("input.txt").map((line) =>
  line.split("").map(Number),
);

function part1() {
  const mem = [];
  let id = 0;

  input.forEach((n, i) => mem.push(...Array(n).fill(i % 2 === 0 ? id++ : ".")));

  let result = 0;

  for (let i = 0, j = mem.length - 1; i < j; i++) {
    if (mem[i] === ".") {
      while (mem[j] === ".") j--;
      if (i >= j) break;
      [mem[i], mem[j]] = [mem[j], mem[i]];
    }
    result += i * mem[i];
  }

  return result;
}

function part2() {
  const mem = [];
  let id = 0;

  input.forEach((n, i) => mem.push(Array(n).fill(i % 2 === 0 ? id++ : null)));

  for (let i = 0, j = mem.length - 1; i < j; j--) {
    if (mem[j].includes(null) || !mem[j].length) continue;

    while (!mem[i].includes(null)) i++;

    let n = i;
    do {
      const block = mem[n];
      const freeStart = block.findIndex((x) => x === null);
      if (freeStart === -1) {
        continue;
      }
      if (block.length - freeStart >= mem[j].length) {
        const free = block.splice(freeStart, mem[j].length, ...mem[j]);
        mem[j] = free;
        break;
      }
    } while (n++ < j);
  }

  return mem.flat().reduce((sum, x, i) => sum + (x || 0) * i, 0);
}

console.log(part1());
console.log(part2());
