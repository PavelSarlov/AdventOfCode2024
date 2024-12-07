import { chain, isNil } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt").map((line) =>
  line.replace(":", "").split(" ").map(BigInt),
);

const operators = ["*", "+"];

function evaluate(test, [x, y, ...rest]) {
  return test < x || isNil(y)
    ? test === x
    : operators.some((op) =>
        evaluate(test, [
          BigInt(`${eval([x, y].map((n) => (op ? `${n}n` : n)).join(op))}`),
          ...rest,
        ]),
      );
}

function part1() {
  return chain(input)
    .filter((line) => {
      const [test, ...rest] = line;

      return evaluate(test, rest);
    })
    .sumBy(([t]) => t)
    .value();
}

function part2() {
  operators.push("");

  return chain(input)
    .filter((line) => {
      const [test, ...rest] = line;

      return evaluate(test, rest);
    })
    .sumBy(([t]) => t)
    .value();
}

console.log(part1());
console.log(part2());
