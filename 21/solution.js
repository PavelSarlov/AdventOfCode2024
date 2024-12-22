import { MinHeap } from "@datastructures-js/heap";
import { chain } from "lodash-es";
import { getLines, sumArray } from "../lib/helpers.js";

const codes = getLines("input.txt").map((l) => l.trim());
const keypadNum = ["789", "456", "123", [, "0", "A"]];
const keypadDir = [[, "^", "A"], "<v>"];
const actions = ["A", "^", ">", "v", "<"];

function getPos(key, keypad) {
  return keypad.reduce(
    (_, l, i) => (l.indexOf(key) !== -1 ? [i, l.indexOf(key)] : _),
    null,
  );
}

function apply(action, key, keypad) {
  let pos = getPos(key, keypad);
  switch (action) {
    case "v":
      pos = sumArray(pos, [1, 0]);
      break;
    case "<":
      pos = sumArray(pos, [0, -1]);
      break;
    case "^":
      pos = sumArray(pos, [-1, 0]);
      break;
    case ">":
      pos = sumArray(pos, [0, 1]);
      break;
  }

  return keypad[pos[0]]?.[pos[1]];
}

function bfsPaths(start, end, keypad) {
  const q = new MinHeap(([, d]) => d.length);
  q.push([start, ""]);

  const paths = new Set();
  while (q.size()) {
    const [curr, d] = q.pop();

    if (!curr || d.length > ([...paths][0]?.length ?? Infinity)) {
      continue;
    }

    if (curr === end) {
      paths.add(d);
      continue;
    }

    actions
      .filter((a) => a !== "A")
      .forEach((action) => {
        const next = apply(action, curr, keypad);

        q.push([next, d + action]);
      });
  }
  return [...paths].map((p) => p + "A");
}

const dirkeys = keypadDir.flat().join("");
const dirpaths = new Map();

for (let i = 0; i < dirkeys.length; i++) {
  for (let j = i; j < dirkeys.length; j++) {
    const path = bfsPaths(dirkeys[i], dirkeys[j], keypadDir);
    dirpaths.set([dirkeys[i], dirkeys[j]].toString(), path);

    const rpath = bfsPaths(dirkeys[j], dirkeys[i], keypadDir);
    dirpaths.set([dirkeys[j], dirkeys[i]].toString(), rpath);
  }
}

const numkeys = keypadNum.flat().join("");
const numpaths = new Map();

for (let i = 0; i < numkeys.length; i++) {
  for (let j = i; j < numkeys.length; j++) {
    const path = bfsPaths(numkeys[i], numkeys[j], keypadNum, 1);
    numpaths.set([numkeys[i], numkeys[j]].toString(), path);

    const rpath = bfsPaths(numkeys[j], numkeys[i], keypadNum, 1);
    numpaths.set([numkeys[j], numkeys[i]].toString(), rpath);
  }
}

function calcCosts(pads) {
  const padCosts = new Array(pads).fill(1).map(() => new Map());
  [...dirpaths.entries()].forEach(([p, p1]) =>
    padCosts[0].set(
      p,
      chain(p1)
        .minBy((x) => x.length)
        .value().length,
    ),
  );

  for (let i = 1; i < padCosts.length; i++) {
    const paths = i === padCosts.length - 1 ? numpaths : dirpaths;
    for (const [p, path] of paths) {
      path.forEach((p1) => {
        let cost = 0;
        for (let j = 0; j < p1.length; j++) {
          cost += padCosts[i - 1].get([p1[j - 1] ?? "A", p1[j]].toString());
        }
        padCosts[i].set(p, Math.min(cost, padCosts[i].get(p) ?? Infinity));
      });
    }
  }

  return padCosts;
}

function calcCodesCost(n) {
  const costs = calcCosts(n);

  return chain(codes)
    .map((code) => {
      const cost = chain(code)
        .reduce(
          (sum, _, i) =>
            sum + costs[n - 1].get([code[i - 1] ?? "A", code[i]].toString()),
          0,
        )
        .value();
      return cost * Number.parseInt(code);
    })
    .sum()
    .value();
}

function part1() {
  return calcCodesCost(3);
}

function part2() {
  return calcCodesCost(26);
}

console.log(part1());
console.log(part2());
