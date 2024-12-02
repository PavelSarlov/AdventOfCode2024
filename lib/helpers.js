import fs from "fs";
import lodash from "lodash";

export function getLines(path) {
  return fs.readFileSync(path).toString().split("\n").slice(0, -1);
}

export function transpose(pattern) {
  let transposed = [];
  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      transposed[j] = transposed[j] || "";
      transposed[j] += pattern[i][j];
    }
  }
  return transposed;
}

export function getPolygonArea(vertices) {
  return Math.abs(
    vertices
      .map(
        (_, i) =>
          vertices[i][0] * vertices[(i + 1) % vertices.length][1] -
          vertices[i][1] * vertices[(i + 1) % vertices.length][0],
      )
      .reduce((a, b) => a + b) / 2,
  );
}

export function sumArray(a, b) {
  return lodash.zip(a, b).map(([x, y]) => x + y);
}

export function subArray(a, b) {
  return lodash.zip(a, b).map(([x, y]) => x - y);
}

export function multiplyArray(arr, y) {
  return arr.map((x) => x * y);
}
