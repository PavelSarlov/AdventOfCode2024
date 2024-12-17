import { getLines } from "../lib/helpers.js";

const [registers, program] = getLines("input.txt").reduce((r, l) => {
  const reg = l.match(/Register (\w): (\d+)/);
  const prog = l.match(/Program:/);
  if (reg) {
    return [{ ...(r[0] ?? {}), [reg[1]]: BigInt(reg[2]) }];
  }
  if (prog) {
    return [...r, [...l.matchAll(/(\d)/g)].map(([x]) => BigInt(x))];
  }
  return r;
}, []);

function getComboOperand(operand, regs) {
  switch (operand) {
    case 0n:
    case 1n:
    case 2n:
    case 3n:
      return operand;
    case 4n:
      return regs.A;
    case 5n:
      return regs.B;
    case 6n:
      return regs.C;
    case 7n:
      throw "Invalid program";
  }
}

function execInstr(opcode, operand, regs) {
  switch (opcode) {
    case 0n:
      regs.A = regs.A / 2n ** getComboOperand(operand, regs);
      break;
    case 1n:
      regs.B = regs.B ^ operand;
      break;
    case 2n:
      regs.B = getComboOperand(operand, regs) % 8n;
      break;
    case 3n:
      if (regs.A === 0n) break;
      return operand;
    case 4n:
      regs.B = regs.B ^ regs.C;
      break;
    case 5n:
      return `${getComboOperand(operand, regs) % 8n}`;
    case 6n:
      regs.B = regs.A / 2n ** getComboOperand(operand, regs);
      break;
    case 7n:
      regs.C = regs.A / 2n ** getComboOperand(operand, regs);
      break;
  }
}

function part1(regs) {
  const out = [];
  for (let i = 0, o = 1; i < program.length - 1 && o < program.length; ) {
    const result = execInstr(program[i], program[o], regs);

    if (typeof result !== "bigint") {
      i += 2;
      o += 2;
      if (result) {
        out.push(result);
      }
    } else {
      i = Number(result);
      o = i + 1;
    }
  }
  return out.join();
}

function part2() {
  for (
    let i = 0n, A = 0n, best = 0;
    ;
    i++, A = i * 8n ** 14n + BigInt("0o4165110264632")
  ) {
    const res = part1({ ...registers, A });
    if (res === program.join()) {
      return A;
    }
    if (res.split(",").length > best) {
      // console.log(A, A.toString(8), best, program.length);
      best = res.split(",").length;
    }
  }
}

console.log(part1({ ...registers }));
console.log(part2());
