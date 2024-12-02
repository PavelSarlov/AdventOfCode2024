import { isNil, negate } from "lodash-es";
import { sign } from "mathjs";
import { getLines } from "../lib/helpers.js";

const reports = getLines("input.txt").map((line) =>
  line.split(/\s+/).map(Number),
);

function isSafe(report) {
  let initSign = sign(report[0] - report[1]);

  if (initSign === 0) {
    return false;
  }

  const safe = report.reduce((res, lvl, i) => {
    const diff = i > 0 ? report[i - 1] - lvl : undefined;
    const currSign = sign(diff ?? 0);

    return (
      res &&
      (isNil(diff) ||
        (currSign === initSign && 1 <= Math.abs(diff) && Math.abs(diff) <= 3))
    );
  }, true);

  return safe;
}

const unsafeReports = reports.filter(negate(isSafe));

function part1() {
  return reports.length - unsafeReports.length;
}

function part2() {
  const safeReports = unsafeReports.filter((report) => {
    for (let i = 0; i < report.length; i++) {
      const subReport = report.slice();
      subReport.splice(i, 1);
      if (isSafe(subReport)) {
        return true;
      }
    }
    return false;
  });

  return part1() + safeReports.length;
}

console.log(part1());
console.log(part2());
