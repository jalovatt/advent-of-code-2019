// eslint-disable-next-line max-classes-per-file
import IntCode from '../../common/IntCode';

export const sumIntersections = (view) => {
  let total = 0;
  for (let row = 0; row < view.length; row += 1) {
    for (let column = 0; column < view[row].length; column += 1) {
      if (view[row][column] === '#') {
        const adjacent = [
          view[row - 1]?.[column],
          view[row + 1]?.[column],
          view[row][column - 1],
          view[row][column + 1],
        ].filter(v => v === '#');

        if (adjacent.length > 2) { total += row * column; }
      }
    }
  }

  return total;
};

class Robot {
  constructor(field) {
    this.field = field;
    this.pos = this.findStart();
    this.direction = 0;
  }

  findStart = () => {
    for (let row = 0; row < this.field.length; row += 1) {
      for (let column = 0; column < this.field[row].length; column += 1) {
        if (this.field[row][column] === '^') { return { x: column, y: row }; }
      }
    }

    return null;
  }

  nextPos = (direction) => {
    const pos = { ...this.pos };
    switch (direction) {
      case 0: { pos.y -= 1; break; }
      case 1: { pos.x += 1; break; }
      case 2: { pos.y += 1; break; }
      case 3: { pos.x -= 1; break; }
      default: { break; }
    }

    return pos;
  }

  newDirection = direction => (this.direction + direction + 4) % 4;

  findTurn = () => {
    const r = this.newDirection(1);
    const l = this.newDirection(-1);

    const posR = this.nextPos(r);
    const posL = this.nextPos(l);

    if (this.field[posR.y]?.[posR.x] === '#') { return 1; }
    if (this.field[posL.y]?.[posL.x] === '#') { return -1; }

    // No choices; end of the scaffold
    return 0;
  }

  countMoves = () => {
    let moves = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const nextPos = this.nextPos(this.direction);
      if (this.field[nextPos.y]?.[nextPos.x] !== '#') { break; }

      moves += 1;
      this.pos = nextPos;
    }

    return moves;
  }

  computeDirectInstructions = () => {
    const instructions = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const turn = this.findTurn();
      if (!turn) { break; }

      this.direction = this.newDirection(turn);
      instructions.push((turn === 1) ? 'R' : 'L');

      const moves = this.countMoves();
      instructions.push(moves);
    }

    return instructions;
  }
}

class ControlSystem {
  constructor(program) {
    this.computer = new IntCode(program);
  }

  execute = (liveFeed) => {
    if (!liveFeed) { return this.update().pop(); }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const output = this.update();

      if (this.computer.halted) {
        return output.pop();
      }

      const view = output.map(v => String.fromCharCode(v)).join('');
      // eslint-disable-next-line no-console
      console.log(view);
    }
  }

  update = () => {
    const { output } = (this.computer.started)
      ? this.computer.resume()
      : this.computer.execute(null, null, this.getInput());

    this.computer.output = [];

    return output;
  }

  convertOutput = output => output.map(v => String.fromCharCode(v))
    .join('').split('\n').map(row => row.split(''));

  /*
    The ASCII definitions of the main routine and the movement functions may each
    contain at most 20 characters, not counting the newline.
  */
  getInput = () => {
    const A = 65;
    const B = 66;
    const C = 67;
    const R = 82;
    const L = 76;
    const Y = 121;
    const comma = 44;
    const newLine = 10;

    const instructions = [
      [A, A, B, C, B, C, B, C, B, A],
      [R, '6', L, '12', R, '6'],
      [L, '12', R, '6', L, '8', L, '12'],
      [R, '12', L, '10', L, '10'],
      [Y, newLine],
    ];

    const joined = instructions.reduce((acc, cur) => acc.concat([newLine], cur));

    const withCommas = joined.reduce((acc, cur, i) => {
      if (i !== 0 && cur !== newLine && acc[acc.length - 1] !== newLine) { acc.push(comma); }

      if (typeof cur === 'number') {
        acc.push(cur);
      } else {
        const digits = cur.toString(10).split('').map(c => c.charCodeAt(0));
        digits.forEach(digit => acc.push(digit));
      }

      return acc;
    }, []);

    return withCommas;
  }
}

export const part1 = (input) => {
  const system = new ControlSystem(input);
  system.computer.maxStoredOutput = 3000;

  const output = system.update();
  return sumIntersections(system.convertOutput(output));
};

export const crawlScaffold = (input) => {
  const system = new ControlSystem(input);
  system.computer.maxStoredOutput = 3000;

  const output = system.update();
  const bot = new Robot(system.convertOutput(output));
  const instructions = bot.computeDirectInstructions();

  return instructions.join(',');
};

export const part2 = (input) => {
  const system = new ControlSystem(input);

  system.computer.initialState[0] = 2;
  system.computer.shouldLog = false;

  return system.execute();
};

export const part2Live = (input) => {
  const system = new ControlSystem(input);

  system.computer.initialState[0] = 2;
  system.computer.maxStoredOutput = 3000;
  system.computer.breakOnOutput = output => (
    (output[output.length - 1] === 10 && output[output.length - 2] === 10)
  );
  system.computer.shouldLog = false;

  const final = system.execute(true);

  // eslint-disable-next-line no-console
  console.log(`Dust collected: ${final}`);

  return final;
};
