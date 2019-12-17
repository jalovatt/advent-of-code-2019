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

  execute = (n) => {
    let LIMIT = n;
    let output;
    while (LIMIT) {
      LIMIT -= 1;

      this.lastOutput = this.update();
    }
  }

  update = (input) => {
    const { output } = (this.computer.started)
      ? this.computer.resume()
      : this.computer.execute(null, null);

    return output;
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

  system.execute(1);
  return sumIntersections(system.convertOutput());
};

export const part2 = () => {};
