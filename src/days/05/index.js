const parseOpCode = (code) => {
  const digits = code.toString(10).split('');

  const opCode = digits.slice(-2).join('');
  const mode1 = digits[digits.length - 3];
  const mode2 = digits[digits.length - 4];
  const mode3 = digits[digits.length - 5];

  return [mode3, mode2, mode1, opCode].map(v => parseInt(v, 10));
};

class Intcode {
  constructor(program) {
    this.initialState = program.split(',').map(v => parseInt(v, 10));
    this.state = [...this.initialState];
  }

  readByMode = (n, mode) => {
    switch (mode) {
      case 1: { return this.state[n]; }
      default: { return this.state[this.state[n]]; }
    }
  }

  operations = {
    1: [
      (cursor, input, mode1, mode2) => {
        const a = this.readByMode(cursor + 1, mode1);
        const b = this.readByMode(cursor + 2, mode2);
        const writeTo = this.state[cursor + 3];

        const val = a + b;

        this.state[writeTo] = val;
      },
      4,
    ],
    2: [
      (cursor, input, mode1, mode2) => {
        const a = this.readByMode(cursor + 1, mode1);
        const b = this.readByMode(cursor + 2, mode2);
        const writeTo = this.state[cursor + 3];

        const val = a * b;

        this.state[writeTo] = val;
      },
      4,
    ],
    3: [
      (cursor, input) => {
        const writeTo = this.state[cursor + 1];
        this.state[writeTo] = input;
      },
      2,
    ],
    4: [
      (cursor, input, mode1) => {
        const val = this.readByMode(cursor + 1, mode1);

        return { output: val };
      },
      2,
    ],
    5: [
      (cursor, input, mode1, mode2) => {
        const a = this.readByMode(cursor + 1, mode1);
        const b = this.readByMode(cursor + 2, mode2);

        if (a) { return { nextAt: b }; }
      },
      3,
    ],
    6: [
      (cursor, input, mode1, mode2) => {
        const a = this.readByMode(cursor + 1, mode1);
        const b = this.readByMode(cursor + 2, mode2);

        if (a === 0) { return { nextAt: b }; }
      },
      3,
    ],
    7: [
      (cursor, input, mode1, mode2) => {
        const a = this.readByMode(cursor + 1, mode1);
        const b = this.readByMode(cursor + 2, mode2);

        const val = (a < b) ? 1 : 0;

        const writeTo = this.state[cursor + 3];
        this.state[writeTo] = val;
      },
      4,
    ],
    8: [
      (cursor, input, mode1, mode2) => {
        const a = this.readByMode(cursor + 1, mode1);
        const b = this.readByMode(cursor + 2, mode2);

        const val = (a === b) ? 1 : 0;

        const writeTo = this.state[cursor + 3];
        this.state[writeTo] = val;
      },
      4,
    ],
    99: [],
  };

  execute = (noun, verb, input) => {
    this.state = [...this.initialState];
    this.log = [];

    if (noun || noun === 0) { this.state[1] = noun; }
    if (verb || verb === 0) { this.state[2] = verb; }

    let cursor = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      this.log.push(`${cursor}: ${this.state.slice(cursor, cursor + 4)}`);

      const parsed = parseOpCode(this.state[cursor]);
      if (!parsed) { throw new Error(`Couldn't parse code @ ${cursor}: ${this.state[cursor]}`); }

      const [mode3, mode2, mode1, code] = parsed;

      const foundOpCode = this.operations[code];
      if (!foundOpCode) { throw new Error(`Invalid opCode @ ${cursor}: ${this.state[cursor]}`); }

      const [op, step] = foundOpCode;

      if (!op) { break; }

      const ret = op(cursor, input, mode1, mode2, mode3);

      if (ret?.output !== undefined) {
        this.lastOutput = ret.output;
        this.log.push(`output: ${ret.output}`);
      }

      cursor = ret?.nextAt || (cursor + step);
    }

    return this;
  };

  findValuesFor = (val) => {
    for (let noun = 0; noun < 100; noun += 1) {
      for (let verb = 0; verb < 100; verb += 1) {
        const got = this.execute(noun, verb).readOutput();

        if (got === val) { return (noun * 100 + verb); }
      }
    }

    return null;
  };

  readState = () => this.state.join(',');
}

export default Intcode;
