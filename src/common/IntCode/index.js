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
    1: (mode1, mode2) => {
      const a = this.readByMode(this.cursor + 1, mode1);
      const b = this.readByMode(this.cursor + 2, mode2);
      const writeTo = this.state[this.cursor + 3];

      const val = a + b;

      this.state[writeTo] = val;

      return { step: 4 };
    },
    2: (mode1, mode2) => {
      const a = this.readByMode(this.cursor + 1, mode1);
      const b = this.readByMode(this.cursor + 2, mode2);
      const writeTo = this.state[this.cursor + 3];

      const val = a * b;

      this.state[writeTo] = val;

      return { step: 4 };
    },
    3: () => {
      if (!this.inputs.length) { throw new Error('Couldn\'t get an input value'); }

      const writeTo = this.state[this.cursor + 1];
      this.state[writeTo] = this.inputs.shift();

      return { step: 2 };
    },
    4: (mode1) => {
      const val = this.readByMode(this.cursor + 1, mode1);

      return { output: val, step: 2 };
    },
    5: (mode1, mode2) => {
      const a = this.readByMode(this.cursor + 1, mode1);
      const b = this.readByMode(this.cursor + 2, mode2);

      return (a) ? { next: b } : { step: 3 };
    },
    6: (mode1, mode2) => {
      const a = this.readByMode(this.cursor + 1, mode1);
      const b = this.readByMode(this.cursor + 2, mode2);

      return (a === 0) ? { next: b } : { step: 3 };
    },
    7: (mode1, mode2) => {
      const a = this.readByMode(this.cursor + 1, mode1);
      const b = this.readByMode(this.cursor + 2, mode2);

      const val = (a < b) ? 1 : 0;

      const writeTo = this.state[this.cursor + 3];
      this.state[writeTo] = val;

      return { step: 4 };
    },
    8: (mode1, mode2) => {
      const a = this.readByMode(this.cursor + 1, mode1);
      const b = this.readByMode(this.cursor + 2, mode2);

      const val = (a === b) ? 1 : 0;

      const writeTo = this.state[this.cursor + 3];
      this.state[writeTo] = val;

      return { step: 4 };
    },
    99: null,
  };

  // There must be a better way to do this
  requiresInput = { 3: true }

  throw = (msg) => { throw new Error(`${msg}\n${this.log.slice(-1)}`); }

  loop = () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      this.log.push(`${this.cursor}: ${this.state.slice(this.cursor, this.cursor + 4)}`);

      const current = this.state[this.cursor];
      if (current === null || current === undefined) { this.error(`No code found @ ${this.cursor}`); }

      const parsed = parseOpCode(this.state[this.cursor]);
      if (!parsed) { this.error(`Couldn't parse code @ ${this.cursor}`); }

      const [mode3, mode2, mode1, code] = parsed;

      //  3
      if (this.requiresInput[code] && !this.inputs.length) { break; }

      const op = this.operations[code];
      if (op === undefined) { this.error(`Invalid operation @ ${this.cursor}`); }

      // 99
      if (!op) { this.halted = true; break; }

      const { output, next, step } = op(mode1, mode2, mode3);

      this.cursor = (next !== undefined) ? next : (this.cursor + step);

      if (output !== undefined) {
        this.lastOutput = output;
        this.log.push(`\toutput: ${output}`);
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
    if (this.halted) { this.error('Halted; cannot resume'); }

    this.inputs = inputs;

    this.loop();

    return this;
  };

  readState = () => this.state.join(',');
}

export default IntCode;
