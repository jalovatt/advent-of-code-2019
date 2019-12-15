import IntCode from '../../common/IntCode';

class Robot {
  constructor(program) {
    this.computer = new IntCode(program);
    this.field = { '0,0': '0' };
    this.pos = { x: 0, y: 0 };
    this.tankPos = null;
    this.distanceFromOrigin = 0;
    this.maxDistanceFromOrigin = 0;
  }

  /*
    Attempts:
    - Purely random
    - Random minus walls
    - Random minus walls, prioritizing unexplored squares
  */
  getNextInput = () => {
    const tiles = {
      north: this.field[`${this.pos.x},${this.pos.y - 1}`],
      south: this.field[`${this.pos.x},${this.pos.y + 1}`],
      east: this.field[`${this.pos.x + 1},${this.pos.y}`],
      west: this.field[`${this.pos.x - 1},${this.pos.y}`],
    };

    const legal = [
      tiles.north?.value !== '#' && 1,
      tiles.south?.value !== '#' && 2,
      tiles.west?.value !== '#' && 3,
      tiles.east?.value !== '#' && 4,
    ].filter(v => !!v);

    const unexplored = [
      !tiles.north && 1,
      !tiles.south && 2,
      !tiles.west && 3,
      !tiles.east && 4,
    ].filter(v => !!v);

    const move = (unexplored.length)
      ? unexplored[Math.floor(Math.random() * unexplored.length)]
      : legal[Math.floor(Math.random() * legal.length)];
    return move;
  }

  execute = () => {
    const LIMIT = 10000;
    let n = 0;
    while (n < LIMIT) {
      n += 1;
      const input = this.getNextInput();

      const output = this.update(input);

      switch (output) {
        case 1: {
          this.pos = this.applyMove(input);
          const key = `${this.pos.x},${this.pos.y}`;
          this.distanceFromOrigin = this.field[key] ? this.field[key].distanceFromOrigin : this.distanceFromOrigin + 1;
          this.maxDistanceFromOrigin = Math.max(this.distanceFromOrigin, this.maxDistanceFromOrigin);
          this.updateField(this.pos, '.');
          break;
        }
        case 2: {
          this.pos = this.applyMove(input);
          const key = `${this.pos.x},${this.pos.y}`;
          this.distanceFromOrigin = this.field[key] ? this.field[key].distanceFromOrigin : this.distanceFromOrigin + 1;
          this.maxDistanceFromOrigin = Math.max(this.distanceFromOrigin, this.maxDistanceFromOrigin);
          this.updateField(this.pos, 'X');
          this.tankPos = this.pos;
          break;
        }
        default: {
          this.updateField(this.applyMove(input), '#');
          break;
        }
      }
    }

    console.log(`stopped after ${n}. tank:`, this.tankPos, this.tankPos && this.field[`${this.tankPos.x},${this.tankPos.y}`]);
  }

  update = (input) => {
    const { output } = (this.computer.started)
      ? this.computer.resume([input])
      : this.computer.execute(null, null, [input]);

    this.computer.output = [];

    return output[0];
  };

  applyMove = (direction) => {
    const pos = { ...this.pos };
    switch (direction) {
      case 1: { pos.y -= 1; break; }
      case 2: { pos.y += 1; break; }
      case 3: { pos.x -= 1; break; }
      case 4: { pos.x += 1; break; }
      default: { break; }
    }

    return pos;
  };

  updateField = (pos, value) => {
    const key = `${pos.x},${pos.y}`;
    this.field[key] = this.field[key] || { value, distanceFromOrigin: this.distanceFromOrigin };
  }
}

const printField = (field) => {
  const min = { x: 0, y: 0 };
  const max = { x: 0, y: 0 };

  const arr = [];

  Object.entries(field).forEach(([pos, val]) => {
    let [, x, y] = pos.match(/([-\d]+),([-\d]+)/);
    x = parseInt(x, 10);
    y = parseInt(y, 10);

    min.x = Math.min(min.x, x);
    max.x = Math.max(max.x, x);
    min.y = Math.min(min.y, y);
    max.y = Math.max(max.y, y);

    if (!arr[y]) { arr[y] = []; }
    arr[y][x] = val;
  });

  const out = [];
  for (let row = min.y; row <= max.y; row += 1) {
    const rowArr = [];
    for (let col = min.x; col <= max.x; col += 1) {
      rowArr.push(arr[row][col]);
    }

    out.push(rowArr.map(v => (v ? v.value : ' ')).join(''));
  }

  console.log(JSON.stringify(out, null, 2));
};

const addFieldValues = (field, other) => {
  Object.entries(other).forEach(([key, val]) => field[key] = field[key] || val);
};

// eslint-disable-next-line import/prefer-default-export
export const solve = (program) => {
  const field = {};

  const NUM_ROBOTS = 4;
  let n = 0;
  while (n < NUM_ROBOTS) {
    n += 1;
    const robot = new Robot(program);
    robot.execute();
    addFieldValues(field, robot.field);
    console.log(`robot ${NUM_ROBOTS - n} finished. max distance: ${robot.maxDistanceFromOrigin}.`);
  }

  printField(field);
  // console.dir(robot.field);
  // console.dir(robot.tankPos);
};
