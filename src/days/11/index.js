import IntCode from '../../common/IntCode';

const DIR_N = 0;
const DIR_E = 1;
const DIR_S = 2;
const DIR_W = 3;

class Robot {
  constructor(program, starting = 0) {
    this.computer = new IntCode(program);
    this.field = { '0,0': starting };
    this.painted = {};
    this.position = [0, 0];
    this.direction = 0;
  }

  move = {
    [DIR_N]: () => { this.position[1] -= 1; },
    [DIR_E]: () => { this.position[0] += 1; },
    [DIR_S]: () => { this.position[1] += 1; },
    [DIR_W]: () => { this.position[0] -= 1; },
  }

  getInput = position => this.field[position] ?? 0;

  updateComputer = (position) => {
    const input = this.getInput(position);

    const output = (this.computer.started)
      ? this.computer.resume([input]).output.slice(-2)
      : this.computer.execute(null, null, [input]).output.slice(-2);

    this.log.push(output);

    return (!output || this.computer.halted)
      ? null
      : output;
  }

  execute = () => {
    this.log = [];

    while (!this.computer.halted) {
      const position = `${this.position[0]},${this.position[1]}`;

      const output = this.updateComputer(position);
      if (!output) { break; }

      const [color, direction] = output;

      if (this.field[position] !== color) {
        this.field[position] = color;
        this.painted[position] = true;
      }

      this.direction = (this.direction + (direction ? 1 : -1) + 4) % 4;

      this.move[this.direction]();
    }
  }

  countPainted = () => Object.keys(this.painted).length;

  print = () => Object.entries(this.field).reduce((acc, [key, color]) => {
    if (!color) { return acc; }

    const [, x, y] = key.match(/([-\d]+),([-\d]+)/);

    if (!acc[y]) { acc[y] = new Array(40).fill('⬛'); }
    acc[y][x] = '⬜';

    return acc;
  }, []).map(row => row.join('')).join('\n');
}

export default Robot;
