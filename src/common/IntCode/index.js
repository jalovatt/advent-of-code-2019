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
    this.inputs = [];

    this.cursor = 0;
    this.relativeBase = 0;

    this.output = [];
    this.maxStoredOutput = 1000;

    this.log = [];
    this.shouldLog = true;
  }

  operations = {
    // Add
    1: (mode1, mode2, mode3) => {
      const a = this.readByMode(this.cursor + 1, mode1);
      const b = this.readByMode(this.cursor + 2, mode2);
      const writeTo = this.writeIndexByMode(this.cursor + 3, mode3);

      this.state[writeTo] = a + b;

      return { step: 4 };
    },
    // Multiply
    2: (mode1, mode2, mode3) => {
      const a = this.readByMode(this.cursor + 1, mode1);
      const b = this.readByMode(this.cursor + 2, mode2);
      const writeTo = this.writeIndexByMode(this.cursor + 3, mode3);

      this.state[writeTo] = a * b;

      return { step: 4 };
    },
    // Input
    3: (mode1) => {
      const writeTo = this.writeIndexByMode(this.cursor + 1, mode1);

      this.state[writeTo] = this.inputs.shift();

      return { step: 2 };
    },
    // Output
    4: (mode1) => {
      const val = this.readByMode(this.cursor + 1, mode1);

      this.pushOutput(val);

      return { step: 2 };
    },
    // Jump if true
    5: (mode1, mode2) => {
      const a = this.readByMode(this.cursor + 1, mode1);
      const b = this.readByMode(this.cursor + 2, mode2);

      return (a) ? { next: b } : { step: 3 };
    },
    // Jump if false
    6: (mode1, mode2) => {
      const a = this.readByMode(this.cursor + 1, mode1);
      const b = this.readByMode(this.cursor + 2, mode2);

      return (a === 0) ? { next: b } : { step: 3 };
    },
    // Less than
    7: (mode1, mode2, mode3) => {
      const a = this.readByMode(this.cursor + 1, mode1);
      const b = this.readByMode(this.cursor + 2, mode2);
      const writeTo = this.writeIndexByMode(this.cursor + 3, mode3);

      this.state[writeTo] = (a < b) ? 1 : 0;

      return { step: 4 };
    },
    // Equals
    8: (mode1, mode2, mode3) => {
      const a = this.readByMode(this.cursor + 1, mode1);
      const b = this.readByMode(this.cursor + 2, mode2);
      const writeTo = this.writeIndexByMode(this.cursor + 3, mode3);

      this.state[writeTo] = (a === b) ? 1 : 0;

      return { step: 4 };
    },
    // Add to relative base
    9: (mode1) => {
      this.relativeBase += this.readByMode(this.cursor + 1, mode1);

      return { step: 2 };
    },
  };

  throw = (msg) => { throw new Error(`${msg}\n${this.log.slice(-1)}`); }

  pushLog = (msg) => {
    if (this.shouldLog) { this.log.push(msg); }
  }

  pushOutput = (output) => {
    this.output.push(output);
    if (this.output.length > this.maxStoredOutput) { this.output.shift(); }

    this.pushLog(`output: ${output}`);
  }

  loop = () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      this.pushLog(`${this.cursor}: ${this.state.slice(this.cursor, this.cursor + 4)}`);

      const current = this.state[this.cursor];
      if (current === null || current === undefined) { this.throw(`No code found @ ${this.cursor}`); }

      const parsed = parseOpCode(this.state[this.cursor]);
      if (!parsed) { this.throw(`Couldn't parse code @ ${this.cursor}`); }

      const [mode3, mode2, mode1, code] = parsed;

      //  Write
      if (code === 3 && !this.inputs.length) { this.pushLog('pausing for input'); break; }

      // Halt
      if (code === 99) { this.halted = true; break; }

      // Break on output match
      if (code === 4 && this.breakOnOutput?.(this.output)) { break; }

      const op = this.operations[code];
      if (op === undefined) { this.throw(`Invalid operation @ ${this.cursor}`); }

      const { next, step } = op(mode1, mode2, mode3);

      this.cursor = (next !== undefined) ? next : (this.cursor + step);
    }
  }

  execute = (noun, verb, inputs = []) => {
    this.state = [...this.initialState];
    this.inputs = inputs;

    if (noun || noun === 0) { this.state[1] = noun; }
    if (verb || verb === 0) { this.state[2] = verb; }

    this.cursor = 0;
    this.relativeBase = 0;

    this.output = [];

    this.started = true;

    this.loop();

    return this;
  };

  resume = (inputs) => {
    if (this.halted) { this.throw('Halted; cannot resume'); }

    if (inputs) { inputs.forEach(v => this.inputs.push(v)); }

    this.loop();

    return this;
  };

  readByMode = (n, mode) => {
    let index;
    switch (mode) {
      case 2: { index = this.relativeBase + this.state[n]; break; } // relative
      case 1: { index = n; break; } // immediate
      default: { index = this.state[n]; break; } // position
    }

    if (index < 0) {
      this.throw(`Attempt to read negative index: ${index}`);
    }

    return this.state[index] || 0;
  }

  writeIndexByMode = (n, mode) => {
    if (mode === 1) { this.throw('Attempted to write in immediate mode'); }

    let index;
    switch (mode) {
      case 2: { index = (this.relativeBase + this.state[n]); break; }
      default: { index = this.state[n]; break; }
    }

    if (index < 0) {
      this.throw(`Attempt to write negative index: ${index}`);
    }

    return index || 0;
  }

  readState = () => this.state.join(',');
}

export default IntCode;
