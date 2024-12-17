import { getLines } from "../lib/helpers.js";

const [registers, program] = getLines("input.txt").reduce((r, l) => {
  const reg = l.match(/Register (\w): (\d+)/);
  const prog = l.match(/Program:/);
  if (reg) {
    return [{ ...(r[0] ?? {}), [reg[1]]: Number(reg[2]) }];
  }
  if (prog) {
    return [...r, [...l.matchAll(/(\d)/g)].map(([x]) => Number(x))];
  }
  return r;
}, []);

function getComboOperand(operand, regs) {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return regs.A;
    case 5:
      return regs.B;
    case 6:
      return regs.C;
    case 7:
      throw "Invalid program";
  }
}

function execInstr(opcode, operand, regs) {
  switch (opcode) {
    case 0:
      regs.A = Number.parseInt(regs.A / 2 ** getComboOperand(operand, regs));
      break;
    case 1:
      regs.B = regs.B ^ operand;
      break;
    case 2:
      regs.B = getComboOperand(operand, regs) % 8;
      break;
    case 3:
      if (regs.A === 0) break;
      return operand;
    case 4:
      regs.B = regs.B ^ regs.C;
      break;
    case 5:
      return `${getComboOperand(operand, regs) % 8}`;
    case 6:
      regs.B = Number.parseInt(regs.A / 2 ** getComboOperand(operand, regs));
      break;
    case 7:
      regs.C = Number.parseInt(regs.A / 2 ** getComboOperand(operand, regs));
      break;
  }
}

function part1(regs) {
  const out = [];
  for (let i = 0, o = 1; i < program.length - 1 && o < program.length; ) {
    const result = execInstr(program[i], program[o], regs);

    if (typeof result !== "number") {
      i += 2;
      o += 2;
      if (result) {
        out.push(result);
      }
    } else {
      i = result;
      o = i + 1;
    }
  }
  return out.join();
}

function part2() {
  // for (let A = 8 ** 15; A <= 8 ** 15 + 20; A++) {
  //   console.log(A, program.join(), part1({ ...registers, A }));
  // }

  for (let i = 0; i < 8; i++) {
    console.log(i, i ^ 5);
  }
}

console.log(part1({ ...registers }));
// console.log(program.length, part2().split(",").length);
part2();
