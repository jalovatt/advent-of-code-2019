const parseOpCode = (code) => {
  const digits = code.toString(10).split('');

  const opCode = digits.slice(-2).join('');
  const mode1 = digits[digits.length - 3];
  const mode2 = digits[digits.length - 4];
  const mode3 = digits[digits.length - 5];

  return [mode3, mode2, mode1, opCode].map(v => parseInt(v, 10));
};

class IntCode {
  constructor(program) {
    this.initialState = program.split(',').map(v => parseInt(v, 10));
    this.state = [...this.initialState];
    this.log = [];
    this.inputs = [];
    this.cursor = 0;
  }

  readByMode = (n, mode) => {
    switch (mode) {
      case 1: { return this.state[n]; }
      default: { return this.state[this.state[n]]; }
    }
  }

  operations = {
    1: [
      (mode1, mode2) => {
        const a = this.readByMode(this.cursor + 1, mode1);
        const b = this.readByMode(this.cursor + 2, mode2);
        const writeTo = this.state[this.cursor + 3];

        const val = a + b;

        this.state[writeTo] = val;
      },
      4,
    ],
    2: [
      (mode1, mode2) => {
        const a = this.readByMode(this.cursor + 1, mode1);
        const b = this.readByMode(this.cursor + 2, mode2);
        const writeTo = this.state[this.cursor + 3];

        const val = a * b;

        this.state[writeTo] = val;
      },
      4,
    ],
    3: [
      () => {
        if (!this.inputs.length) { throw new Error('Couldn\'t get an input value'); }

        const writeTo = this.state[this.cursor + 1];
        this.state[writeTo] = this.inputs.shift();
      },
      2,
    ],
    4: [
      (mode1) => {
        const val = this.readByMode(this.cursor + 1, mode1);

        return { output: val };
      },
      2,
    ],
    5: [
      // eslint-disable-next-line consistent-return
      (mode1, mode2) => {
        const a = this.readByMode(this.cursor + 1, mode1);
        const b = this.readByMode(this.cursor + 2, mode2);

        if (a) { return { nextAt: b }; }
      },
      3,
    ],
    6: [
      // eslint-disable-next-line consistent-return
      (mode1, mode2) => {
        const a = this.readByMode(this.cursor + 1, mode1);
        const b = this.readByMode(this.cursor + 2, mode2);

        if (a === 0) { return { nextAt: b }; }
      },
      3,
    ],
    7: [
      (mode1, mode2) => {
        const a = this.readByMode(this.cursor + 1, mode1);
        const b = this.readByMode(this.cursor + 2, mode2);

        const val = (a < b) ? 1 : 0;

        const writeTo = this.state[this.cursor + 3];
        this.state[writeTo] = val;
      },
      4,
    ],
    8: [
      (mode1, mode2) => {
        const a = this.readByMode(this.cursor + 1, mode1);
        const b = this.readByMode(this.cursor + 2, mode2);

        const val = (a === b) ? 1 : 0;

        const writeTo = this.state[this.cursor + 3];
        this.state[writeTo] = val;
      },
      4,
    ],
    99: [],
  };

  loop = () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      this.log.push(`${this.cursor}: ${this.state.slice(this.cursor, this.cursor + 4)}`);

      const current = this.state[this.cursor];
      if (current === null || current === undefined) {
        throw new Error(`No code found @ ${this.cursor}\n${this.log[this.log.length - 1]}`);
      }

      const parsed = parseOpCode(this.state[this.cursor]);
      if (!parsed) { throw new Error(`Couldn't parse code @ ${this.cursor}: ${this.state[this.cursor]}`); }

      const [mode3, mode2, mode1, code] = parsed;

      // TODO: Handle this better
      if (code === 3 && !this.inputs.length) { break; }

      const foundOpCode = this.operations[code];
      if (!foundOpCode) { throw new Error(`Invalid opCode @ ${this.cursor}: ${this.state[this.cursor]}`); }

      const [op, step] = foundOpCode;

      if (!op) {
        this.halted = true;
        break;
      }

      const ret = op(mode1, mode2, mode3);

      this.cursor = ret?.nextAt || (this.cursor + step);

      if (ret?.output !== undefined) {
        this.lastOutput = ret.output;
        this.log.push(`output: ${ret.output}`);
      }
    }
  }

  execute = (noun, verb, inputs) => {
    this.state = [...this.initialState];
    this.inputs = inputs || [];

    if (noun || noun === 0) { this.state[1] = noun; }
    if (verb || verb === 0) { this.state[2] = verb; }

    this.cursor = 0;

    this.started = true;

    this.loop();

    return this;
  };

  resume = (inputs) => {
    this.inputs = inputs;

    this.loop();

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

export default IntCode;
