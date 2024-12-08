import { getLines, multiplyArray, subArray, sumArray } from "../lib/helpers.js";

const map = getLines("input.txt").map((line) => line.split(""));

const nodesByFreq = map.reduce(
  (_, line, i) =>
    line.reduce(
      (m, n, j) => (n !== "." ? m.set(n, [[i, j], ...(m.get(n) ?? [])]) : m),
      _,
    ),
  new Map(),
);

function isInMap([x, y]) {
  return !!map[x]?.[y];
}

function findAntinodes({ resonantHarmonics } = {}) {
  return [...nodesByFreq.values()].reduce((aNodes, nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const vec = subArray(nodes[i], nodes[j]);
        const antinodes = [
          sumArray(vec, nodes[i]),
          sumArray(multiplyArray(vec, -1), nodes[j]),
        ];

        if (resonantHarmonics) {
          let vec2 = sumArray(vec, vec);
          let moreAntinodes = [
            sumArray(vec2, nodes[i]),
            sumArray(multiplyArray(vec2, -1), nodes[j]),
          ];
          while (moreAntinodes.some(isInMap)) {
            antinodes.push(...moreAntinodes);
            vec2 = sumArray(vec, vec2);
            moreAntinodes = [
              sumArray(vec2, nodes[i]),
              sumArray(multiplyArray(vec2, -1), nodes[j]),
            ];
          }
          antinodes.push(nodes[i], nodes[j]);
        }

        antinodes
          .filter((n) => isInMap(n))
          .forEach((aNode) => {
            aNodes.add(aNode.toString());
          });
      }
    }
    return aNodes;
  }, new Set());
}

function part1() {
  return findAntinodes().size;
}

function part2() {
  return findAntinodes({ resonantHarmonics: true }).size;
}

console.log(part1());
console.log(part2());
