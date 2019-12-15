/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
import IntCode from '../../common/IntCode';

const keyFromPos = (x, y) => `${x},${y}`;

const posFromKey = (key) => {
  const [, x, y] = key.match(/([-\d]+),([-\d]+)/);
  return { x: parseInt(x, 10), y: parseInt(y, 10) };
};

class Robot {
  constructor(program, field) {
    this.computer = new IntCode(program);
    this.field = field || { '0,0': { value: '0', distanceFromOrigin: 0 } };
    this.pos = { x: 0, y: 0 };
    this.tankPos = null;
    this.distanceFromOrigin = 0;
    this.maxDistanceFromOrigin = 0;
  }

  /*
    Attempts:
    - Purely random
    - Random avoiding known walls
    - Random avoiding known walls, prioritizing unexplored squares
  */
  getNextInput = () => {
    const tiles = {
      north: this.field[keyFromPos(this.pos.x, this.pos.y - 1)],
      south: this.field[keyFromPos(this.pos.x, this.pos.y + 1)],
      east: this.field[keyFromPos(this.pos.x + 1, this.pos.y)],
      west: this.field[keyFromPos(this.pos.x - 1, this.pos.y)],
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

  execute = (breakAtTank) => {
    const LIMIT = 10000;
    let n = 0;
    while (n < LIMIT && (!breakAtTank || !this.tankPos)) {
      n += 1;
      const input = this.getNextInput();
      this.update(input);
    }
  }

  update = (input) => {
    const { output } = (this.computer.started)
      ? this.computer.resume([input])
      : this.computer.execute(null, null, [input]);

    this.computer.output = [];

    if (output[0] === 0) { this.updateField(this.applyMove(input), '#'); return; }

    this.pos = this.applyMove(input);

    const key = keyFromPos(this.pos.x, this.pos.y);
    this.distanceFromOrigin = this.field[key]
      ? this.field[key].distanceFromOrigin
      : this.distanceFromOrigin + 1;

    if (output[0] === 1) {
      this.updateField(this.pos, '.');
    } else if (output[0] === 2) {
      this.updateField(this.pos, 'X');
      this.tankPos = this.pos;
    }

    this.maxDistanceFromOrigin = Math.max(this.distanceFromOrigin, this.maxDistanceFromOrigin);
  };

  applyMove = (direction) => {
    let { x, y } = this.pos;
    switch (direction) {
      case 1: { y -= 1; break; }
      case 2: { y += 1; break; }
      case 3: { x -= 1; break; }
      case 4: { x += 1; break; }
      default: { break; }
    }

    return { x, y };
  };

  updateField = (pos, value) => {
    const key = keyFromPos(pos.x, pos.y);
    this.field[key] = this.field[key] || { value, distanceFromOrigin: this.distanceFromOrigin };
  }
}

const printField = (field) => {
  const min = { x: 0, y: 0 };
  const max = { x: 0, y: 0 };

  const arr = [];

  Object.entries(field).forEach(([key, val]) => {
    if (!key) { console.error('bad entry:', key, val); return; }
    const { x, y } = posFromKey(key);

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

export const findTank = (program) => {
  const field = {};

  const NUM_ROBOTS = 20;
  let n = 0;
  while (n < NUM_ROBOTS) {
    n += 1;
    const robot = new Robot(program, field);
    robot.execute(true);
    if (robot.tankPos) {
      console.log(`robot ${n} found the tank!`);
      return robot.distanceFromOrigin;
    }
  }

  console.log('no robots found the tank :(');
  return -1;
};

export const solve = (program) => {
  const field = {};

  const NUM_ROBOTS = 20;
  let n = 0;
  while (n < NUM_ROBOTS) {
    n += 1;
    const robot = new Robot(program, field);
    robot.execute();
    console.log(`robot ${n} finished. max distance: ${robot.maxDistanceFromOrigin}.`);
  }

  printField(field);
};
