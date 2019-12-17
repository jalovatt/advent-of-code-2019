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

class ControlSystem {
  constructor(program) {
    this.computer = new IntCode(program);
    this.lastOutput = [];
  }

  execute = (liveFeed) => {
    this.update();

    if (liveFeed) {
      const final = this.lastOutput.pop();
      const screens = this.lastOutput.map(v => String.fromCharCode(v)).join('').split('\n\n');
      screens.forEach((screen) => {
        console.log(screen);
        const now = new Date().getTime();
        while (new Date().getTime() - now < 200) {
          // do nothing
        }
      });

      console.log(`Dust collected: ${final}`);
    }
  }

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
      [A, B, C],
      [R, '6', L, '12'],
      [R, '0'],
      [L, '0'],
      [Y, newLine],
    ];

    const joined = instructions.reduce((acc, cur) => {
      return acc.concat([newLine], cur);
    });

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

  update = () => {
    const { output } = (this.computer.started)
      ? this.computer.resume(this.getInput())
      : this.computer.execute(null, null, this.getInput());

    this.lastOutput = output;
  }

  convertOutput = () => this.lastOutput.map(v => String.fromCharCode(v))
    .join('').split('\n').map(row => row.split(''));

  print = () => {
    const view = this.convertOutput();
    console.log(view.map(row => row.join('')).join('\n'));
  }
}

export const part1 = (input) => {
  const system = new ControlSystem(input);

  system.execute();
  system.print();
  return sumIntersections(system.convertOutput());
};

export const part2 = (input) => {
  const system = new ControlSystem(input);
  system.computer.initialState[0] = 2;

  system.execute(true);
  // system.print();
};
