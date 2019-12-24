const WIDTH = 5;

export class Field {
  constructor(initialStr) {
    this.initialState = initialStr.split('').map(c => (c === '#' ? 1 : 0));
    this.state = [...this.initialState];
  }

  print = () => {
    const out = [];
    for (let i = 0; i < this.state.length; i += WIDTH) {
      out.push(this.state.slice(i, i + WIDTH).map(c => (c ? '#' : '.')).join(''));
    }

    return out.join('');
  }

  step = (steps = 1) => {
    while (steps) {
      const next = [];
      for (let i = 0; i < this.state.length; i += 1) {
        // if adjacent === 1 or (not current && adjacent === 2) { spawn }
        const adjacent = (
          ((i % WIDTH !== 0) ? this.state[i - 1] : 0)
          + (((i + 1) % WIDTH !== 0) ? this.state[i + 1] : 0)
          + (this.state[i - WIDTH] ?? 0)
          + (this.state[i + WIDTH] ?? 0)
        );

        next[i] = (adjacent === 1 || (!this.state[i] && adjacent === 2)) ? 1 : 0;
      }

      this.state = next;

      // eslint-disable-next-line no-param-reassign
      steps -= 1;
    }
  }

  biodiversity = () => {
    return Array.prototype.reduce.call(this.state, (acc, cur, i) => acc + (cur ? 2 ** i : 0), 0);
  }

  simulate = () => {
    const previous = {};
    let steps = 0;
    while (!previous[this.state]) {
      previous[this.state] = true;
      this.step();

      steps += 1;
    }

    return steps;
  }
}

export const part1 = (initialStr) => {
  const field = new Field(initialStr);

  field.simulate();
  return field.biodiversity();
};

export const part2 = () => {};
