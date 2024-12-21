import { chain } from "lodash-es";
import { getLines, sumArray } from "../lib/helpers.js";

const codes = getLines("input.txt");
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

function bfs(code, n = 3) {
  const start = ["", 0, ...Array(n).fill("A")];
  const q = [];
  q.push(start);

  const seen = new Set();

  let l = 0;
  const costs = new Map();

  while (q.length) {
    let [out, d, ...pads] = q.shift();

    costs.set(out, Math.min(d, costs.get(out) ?? Infinity));

    if (out === code) {
      return [d, costs];
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

function part1() {
  return chain(codes)
    .map((code) => bfs(code)[0] * Number.parseInt(code))
    .sum()
    .value();
}

function part2() {
  return chain(codes)
    .map((code) => bfs(code, 5))
    .value();
}

// console.log(part1());
console.log(part2());
