import { isNil } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt");

const wires = input
  .filter((l) => l.match(/: /))
  .reduce(
    (res, l) => ({ ...res, [l.split(": ")[0]]: Number(l.split(": ")[1]) }),
    {},
  );
const gates = input
  .filter((l) => l.match(/AND|OR/))
  .map((l) => l.split(/->| /).filter((x) => x));

function apply(op, x, y) {
  switch (op) {
    case "AND":
      return x & y;
    case "OR":
      return x | y;
    case "XOR":
      return x ^ y;
  }
}

function getNumberForWire(wire, wires) {
  return Object.entries(wires)
    .filter(([k]) => k.startsWith(wire))
    .sort()
    .reduce((num, [, v], i) => (BigInt(v) << BigInt(i)) + num, BigInt(0));
}

function calcGates() {
  const res = { ...wires };
  const q = [...gates];

  while (q.length) {
    const [x, op, y, z] = q.shift();

    if (isNil(res[x]) || isNil(res[y])) {
      q.push([x, op, y, z]);
      continue;
    }

    res[z] = apply(op, res[x], res[y]);
  }

  return res;
}

function part1() {
  const g = calcGates();
  return getNumberForWire("z", g);
}

function getRepr(gate) {
  if (gate.match(/^(x|y)/)) {
    return gate;
  }
  const [x, op, y] = gates.find(([, , , z]) => z === gate);
  return `(${getRepr(x)} ${op} ${getRepr(y)})`;
}

function part2() {
  let g = calcGates();

  let x = getNumberForWire("x", g);
  let y = getNumberForWire("y", g);
  let z = getNumberForWire("z", g);

  // const xorCounts = Object.keys(g)
  //   .filter((gate) => !gate.match(/^(x|y)/))
  //   .map((gate) => `${gate} ${[...getRepr(gate).matchAll(/XOR/g)].length}`)
  //   .sort();
  // xorCounts.forEach((x) => console.log(x));

  // console.log("0" + x.toString(2));
  // console.log("0" + y.toString(2));
  // console.log(z.toString(2));
  // console.log(((x + y) ^ z).toString(2));

  // each bit should be result of its index + 1 XOR operations

  // qnw z15 cqr z20 vkg z37 nfj ncd

  return "qnw z15 cqr z20 vkg z37 nfj ncd".split(" ").sort().join();
}

console.log(part1());
console.log(part2());
