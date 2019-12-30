/* eslint-disable max-classes-per-file */
const WIDTH = 5;
const LENGTH = 25;

export class Field {
  constructor(initialStr) {
    this.initialState = initialStr.split('').map(c => (c === '#' ? 1 : 0));
    this.state = [...this.initialState];
  }

  print = () => {
    const out = [];
    for (let i = 0; i < LENGTH; i += WIDTH) {
      out.push(this.state.slice(i, i + WIDTH).map(c => (c ? '#' : '.')).join(''));
    }

    return out.join('');
  }

  step = (steps = 1) => {
    while (steps) {
      const next = [];
      for (let i = 0; i < LENGTH; i += 1) {
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

  biodiversity = () => Array.prototype.reduce
    .call(this.state, (acc, cur, i) => acc + (cur ? 2 ** i : 0), 0);

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

export class RecursiveField {
  constructor(initialStr) {
    this.initialState = initialStr.split('').map(c => (c === '#' ? 1 : 0));
    this.state = { 0: [...this.initialState] };
  }

  cachedAdjacentCells = [];

  adjacentCells = (cell) => {
    if (this.cachedAdjacentCells[cell]) { return this.cachedAdjacentCells[cell]; }

    const cells = [];

    if (cell % WIDTH !== 0) { cells.push([0, cell - 1]); }
    if ((cell + 1) % WIDTH !== 0) { cells.push([0, cell + 1]); }
    if (cell >= WIDTH) { cells.push([0, cell - WIDTH]); }
    if (cell + WIDTH < LENGTH) { cells.push([0, cell + WIDTH]); }

    if (cell % WIDTH === 0) { cells.push([-1, 11]); }
    if ((cell + 1) % WIDTH === 0) { cells.push([-1, 13]); }

    if (cell === 11) {
      cells.push(
        [1, 0],
        [1, 5],
        [1, 10],
        [1, 15],
        [1, 20],
      );
    }
    if (cell === 13) {
      cells.push(
        [1, 4],
        [1, 9],
        [1, 14],
        [1, 19],
        [1, 24],
      );
    }

    if (cell < WIDTH) { cells.push([-1, 7]); }
    if (cell + WIDTH >= LENGTH) { cells.push([-1, 17]); }

    if (cell === 7) {
      cells.push(
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
      );
    }
    if (cell === 17) {
      cells.push(
        [1, 20],
        [1, 21],
        [1, 22],
        [1, 23],
        [1, 24],
      );
    }

    this.cachedAdjacentCells[cell] = cells.filter(([, i]) => i !== 12);
    return this.cachedAdjacentCells[cell];
  }

  adjacentSum = (cell, depth) => {
    const cells = this.adjacentCells(cell, depth);

    return cells.reduce((acc, [d, i]) => acc + (this.state[depth + d]?.[i] ?? 0), 0);
  };

  nextStateForDepth = (depth) => {
    const out = [];
    for (let i = 0; i < LENGTH; i += 1) {
      const adjacent = (i !== 12) ? this.adjacentSum(i, depth) : 0;

      out[i] = (adjacent === 1 || (!this.state[depth]?.[i] && adjacent === 2)) ? 1 : 0;
    }

    return out;
  }

  step = (steps = 1) => {
    while (steps) {
      const next = {};
      const depths = Object.keys(this.state);
      const { 0: minDepth, [depths.length - 1]: maxDepth } = depths
        .map(d => parseInt(d, 10))
        .sort((a, b) => a - b);

      for (let depth = minDepth; depth <= maxDepth; depth += 1) {
        next[depth] = this.nextStateForDepth(depth);
      }

      const newMin = this.nextStateForDepth(minDepth - 1);
      if (newMin.filter(v => !!v).length) { next[minDepth - 1] = newMin; }

      const newMax = this.nextStateForDepth(maxDepth + 1);
      if (newMax.filter(v => !!v).length) { next[maxDepth + 1] = newMax; }

      this.state = next;

      // eslint-disable-next-line no-param-reassign
      steps -= 1;
    }
  }

  print = () => {
    const out = [];
    const depths = Object.keys(this.state).map(v => parseInt(v, 10)).sort((a, b) => a - b);

    depths.forEach((depth) => {
      out.push(`\nDepth ${depth}:`);

      for (let i = 0; i < LENGTH; i += WIDTH) {
        out.push(this.state[depth].slice(i, i + WIDTH).map(c => (c ? '#' : '.')).join(''));
      }
    });

    return out.join('\n');
  }

  countBugs = () => Object.values(this.state)
    .reduce((acc, cur) => acc + cur.filter(v => !!v).length, 0);
}

export const part1 = (initialStr) => {
  const field = new Field(initialStr);

  field.simulate();
  return field.biodiversity();
};

export const part2 = (initialStr, steps) => {
  const field = new RecursiveField(initialStr);
  field.step(steps);

  // console.log(`After ${steps} steps there are ${Object.keys(field.state).length} levels`);

  return field.countBugs();
};
