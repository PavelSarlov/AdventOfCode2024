import { chain } from "lodash-es";
import { getLines, sumArray } from "../lib/helpers.js";

const codes = getLines("example.txt");
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
    case "A":
      return [key, key];
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

  return [keypad[pos[0]]?.[pos[1]], null];
}

function bfs(code) {
  const start = ["", 0, ...Array(3).fill("A")];
  const q = [];
  q.push(start);

  const seen = new Set();

  while (q.length) {
    let [out, d, ...pads] = q.shift();

    if (out === code) {
      return d;
    }

    if (
      pads.some((pad) => !pad) ||
      !code.startsWith(out) ||
      seen.has([out, ...pads].toString())
    ) {
      continue;
    }

    seen.add([out, ...pads].toString());

    actions.forEach((action) => {
      let newPad = null;
      let newOut = "";
      const newPads = [...pads];

      for (let i = 0; i < pads.length; i++) {
        [newPad, action] = apply(
          action,
          pads[i],
          i === pads.length - 1 ? keypadNum : keypadDir,
        );
        newPads[i] = newPad;

        if (i === pads.length - 1) {
          newOut = action ?? "";
        }
      }

      q.push([out + newOut, d + 1, ...newPads]);
    });
  }
}

function bfsPaths(start, path, keypad, n) {
  const state = ["", "", ...Array(n).fill(start)];
  const q = [];
  q.push(state);

  const seen = new Set();
  while (q.length) {
    let [out, d, ...pads] = q.shift();

    if (out === path) {
      return d;
    }

    if (
      pads.some((pad) => !pad) ||
      !path.startsWith(out) ||
      seen.has([d, ...pads].toString())
    ) {
      continue;
    }

    seen.add([d, ...pads].toString());

    actions.forEach((a) => {
      let action = a;
      let newPad = null;
      let newOut = "";
      const newPads = [...pads];

      for (let i = 0; i < pads.length; i++) {
        [newPad, action] = apply(action, pads[i], keypad);
        newPads[i] = newPad;

        if (i === pads.length - 1) {
          newOut = action ?? "";
        }
      }

      q.push([out + newOut, d + a, ...newPads]);
    });
  }
}

const dirkeys = keypadDir.flat().join("");
const dirpaths = new Map();

for (let i = 0; i < dirkeys.length; i++) {
  for (let j = i; j < dirkeys.length; j++) {
    const path1 = bfsPaths(dirkeys[i], dirkeys[j], keypadDir, 1);
    const path2 = bfsPaths("A", path1, keypadDir, 1);
    dirpaths.set([dirkeys[i], dirkeys[j]].toString(), [path1, path2]);

    const rpath1 = bfsPaths(dirkeys[j], dirkeys[i], keypadDir, 1);
    const rpath2 = bfsPaths("A", rpath1, keypadDir, 1);
    dirpaths.set([dirkeys[j], dirkeys[i]].toString(), [rpath1, rpath2]);
  }
}

const numkeys = keypadNum.flat().join("");
const numpaths = new Map();

for (let i = 0; i < numkeys.length; i++) {
  for (let j = i; j < numkeys.length; j++) {
    const path1 = bfsPaths(numkeys[i], numkeys[j], keypadNum, 1);
    const path2 = bfsPaths("A", path1, keypadDir, 1);
    numpaths.set([numkeys[i], numkeys[j]].toString(), [path1, path2]);

    const rpath1 = bfsPaths(numkeys[j], numkeys[i], keypadNum, 1);
    const rpath2 = bfsPaths("A", rpath1, keypadDir, 1);
    numpaths.set([numkeys[j], numkeys[i]].toString(), [rpath1, rpath2]);
  }
}

console.log(dirpaths);
console.log(numpaths);

function calcCosts(pads) {
  const padCosts = new Array(pads).fill(1).map(() => new Map());
  [...dirpaths.entries()].forEach(([p, [p1]]) => padCosts[0].set(p, p1.length));

  for (let i = 1; i < padCosts.length; i++) {
    const paths = i === padCosts.length - 1 ? numpaths : dirpaths;
    for (const [p, [_, p2]] of paths) {
      let cost = 0;
      for (let j = 0; j < p2.length; j++) {
        cost += padCosts[i - 1].get([p2[j - 1] ?? "A", p2[j]].toString());
      }
      padCosts[i].set(p, cost);
    }
  }

  return padCosts;
}

function part1() {
  return chain(codes)
    .map((code) => bfs(code) * Number.parseInt(code))
    .sum()
    .value();
}

function part2() {
  const pads = 3;
  const costs = calcCosts(pads);

  console.log(costs);

  return chain(codes)
    .map(
      (code) =>
        chain(code)
          .reduce(
            (sum, _, i) =>
              sum +
              costs[pads - 1].get([code[i - 1] ?? "A", code[i]].toString()),
            0,
          )
          .value() * Number.parseInt(code),
    )
    .value();
}

// console.log(part1());
console.log(part2());
