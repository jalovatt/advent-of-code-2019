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

  execute = () => {
    this.log = [];

    while (!this.computer.halted) {
      const position = `${this.position[0]},${this.position[1]}`;
      const input = this.getInput(position);

      const output = (this.computer.started)
        ? this.computer.resume([input]).output.slice(-2)
        : this.computer.execute(null, null, [input]).output.slice(-2);

      if (this.computer.halted) { break; }

      const [color, direction] = output;

      this.log.push(output);

      if (this.field[position] !== color) {
        this.painted[position] = true;
      }

      this.field[position] = color;

      this.direction = (this.direction + (direction ? 1 : -1) + 4) % 4;

      this.move[this.direction]();
    }
  }

  countPainted = () => Object.keys(this.painted).length;

  print = () => {
    const field = [];

    Object.entries(this.field).forEach(([key, color]) => {
      const [, x, y] = key.match(/([-\d]+),([-\d]+)/);

      if (!field[y]) { field[y] = new Array(40).fill('⬛'); }

      if (color) { field[y][x] = '⬜'; }
    });

    return field.map(row => row.map(v => v || '⬛').join('')).join('\n');
  }
}

export default Robot;
