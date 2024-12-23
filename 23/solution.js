import { chain } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const connections = new Set(getLines("input.txt"));
const pcs = [
  ...[...connections].reduce(
    (pcs, conn) => conn.split("-").map((pc) => pcs.add(pc)) && pcs,
    new Set(),
  ),
].reduce(
  (edges, pc) =>
    edges.set(
      pc,
      [...connections].filter((conn) => conn.match(pc)),
    ),
  new Map(),
);

function hasConn(x, y) {
  return connections.has(`${x}-${y}`) || connections.has(`${y}-${x}`);
}

function part1() {
  const pcsArray = [...pcs.keys()];
  const triConns = new Set();

  for (let i = 0; i < pcsArray.length; i++) {
    for (let j = i + 1; j < pcsArray.length; j++) {
      for (let k = j + 1; k < pcsArray.length; k++) {
        if (
          hasConn(pcsArray[i], pcsArray[j]) &&
          hasConn(pcsArray[j], pcsArray[k]) &&
          hasConn(pcsArray[i], pcsArray[k])
        ) {
          triConns.add(`${pcsArray[i]}-${pcsArray[j]}-${pcsArray[k]}`);
        }
      }
    }
  }

  return [...triConns].filter((conn) => conn.match(/(^t|-t)/)).length;
}

function part2() {
  const connsArray = [...pcs.keys()].map((pc) => [pc]);

  for (const pc of pcs.keys()) {
    for (const conn of connsArray) {
      if (conn.every((node) => hasConn(pc, node))) {
        conn.push(pc);
      }
    }
  }

  return chain(connsArray)
    .maxBy((conn) => conn.length)
    .sort()
    .join()
    .value();
}

console.log(part1());
console.log(part2());
