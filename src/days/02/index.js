const opCodes = {
  1: [(a, b) => a + b, 4],
  2: [(a, b) => a * b, 4],
  99: [],
};

class Intcode {
  constructor(program) {
    this.initialState = program.split(',').map(v => parseInt(v, 10));
    this.state = [...this.initialState];
  }

  execute = (noun, verb) => {
    this.state = [...this.initialState];

    if (noun !== undefined) { this.state[1] = noun; }
    if (verb !== undefined) { this.state[2] = verb; }

    let cursor = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const [op, step] = opCodes[this.state[cursor]];

      if (!op) { break; }

      const posA = this.state[cursor + 1];
      const posB = this.state[cursor + 2];
      const writeTo = this.state[cursor + 3];

      const a = this.state[posA];
      const b = this.state[posB];

      const val = op(a, b);

      this.state[writeTo] = val;

      cursor += step;
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

  readOutput = () => parseInt(this.state[0], 10);
}

export default Intcode;
