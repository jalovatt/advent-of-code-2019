const opCodes = {
  1: (a, b) => a + b,
  2: (a, b) => a * b,
};

export const run = (programIn) => {
  const program = programIn.map(v => parseInt(v, 10));
  let cursor = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const op = opCodes[program[cursor]];

    if (!op) { break; }

    const posA = program[cursor + 1];
    const posB = program[cursor + 2];
    const writeTo = program[cursor + 3];

    const a = program[posA];
    const b = program[posB];

    const val = op(a, b);

    program[writeTo] = val;

    cursor += 4;
  }

  return program.join(',');
};

export const solve = (programIn) => {
  const program = [...programIn];

  program[1] = 12;
  program[2] = 2;

  const final = run(program);

  return final.split(',')[0];
};
