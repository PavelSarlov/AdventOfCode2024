import { chain } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt").map(BigInt);

function simulate(n) {
  const buyers = [...input];
  const changes = buyers.map(() => []);
  const sequences = new Map();
  const seen = buyers.map(() => new Set());
  while (n--) {
    for (let i = 0; i < buyers.length; i++) {
      const prevPrice = buyers[i] % 10n;
      buyers[i] = ((buyers[i] * 64n) ^ buyers[i]) % 16777216n;
      buyers[i] = ((buyers[i] / 32n) ^ buyers[i]) % 16777216n;
      buyers[i] = ((buyers[i] * 2048n) ^ buyers[i]) % 16777216n;
      const currPrice = buyers[i] % 10n;
      changes[i].push(prevPrice - currPrice);
      if (changes[i].length > 4) {
        changes[i].shift();
      }
      const key = changes[i].toString();
      if (changes[i].length === 4 && !seen[i].has(key)) {
        seen[i].add(key);
        sequences.set(key, (sequences.get(key) ?? 0n) + currPrice);
      }
    }
  }
  return [buyers, sequences];
}

const [buyers, sequences] = simulate(2000);

function part1() {
  return chain(buyers).sum().value();
}

function part2() {
  return chain([...sequences.values()])
    .max()
    .value();
}

console.log(part1());
console.log(part2());
