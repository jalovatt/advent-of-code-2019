/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
import IntCode from '../../common/IntCode';

const keyFromPos = (x, y) => `${x},${y}`;

const posFromKey = (key) => {
  const [, x, y] = key.match(/([-\d]+),([-\d]+)/);
  return { x: parseInt(x, 10), y: parseInt(y, 10) };
};

class Field {
  constructor() {
    this.tiles = { '0,0': { value: '0', distanceFromOrigin: 0 } };
    this.origin = { x: 0, y: 0 };
    this.tankPos = null;
  }

  get = pos => this.tiles[keyFromPos(pos.x, pos.y)]

  set = (pos, value, distanceFromOrigin) => {
    this.tiles[keyFromPos(pos.x, pos.y)] = { value, distanceFromOrigin };
  }

  print = () => {
    const min = { x: 0, y: 0 };
    const max = { x: 0, y: 0 };

    const arr = [];

    Object.entries(this.tiles).forEach(([key, val]) => {
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
      let rowArr = [];
      for (let col = min.x; col <= max.x; col += 1) {
        rowArr.push(arr[row][col]);
      }

      rowArr = rowArr.map(v => (v ? v.value : ' '));
      out.push(rowArr.join(''));
    }

    console.log(JSON.stringify(out, null, 2));
  };
}

class Robot {
  constructor(program, field) {
    this.computer = new IntCode(program);
    this.field = field;
    this.pos = { x: 0, y: 0 };
    this.distanceFromOrigin = 0;
    this.maxDistanceFromOrigin = 0;
  }

  /*
    Attempts:
    - Purely random
    - Random avoiding known walls
    - Random avoiding known walls, prioritizing unexplored squares

    Directions:
      1   North
      2   South
      3   West
      4   East
  */
  getNextInput = () => {
    const choices = [
      { tile: this.field.get({ x: this.pos.x, y: this.pos.y - 1 }), direction: 1 },
      { tile: this.field.get({ x: this.pos.x, y: this.pos.y + 1 }), direction: 2 },
      { tile: this.field.get({ x: this.pos.x - 1, y: this.pos.y }), direction: 3 },
      { tile: this.field.get({ x: this.pos.x + 1, y: this.pos.y }), direction: 4 },
    ];

    const unexplored = choices.filter(choice => !choice.tile);

    if (unexplored.length) {
      const dest = unexplored[Math.floor(Math.random() * unexplored.length)];
      return dest.direction;
    }

    const best = Object.values(choices).filter(v => v.tile.value !== '#')
      .reduce((acc, choice) => ((choice.tile.distanceFromOrigin < acc.tile.distanceFromOrigin)
        ? choice
        : acc));

    return best.direction;
  }

  explore = (breakAtTank) => {
    const LIMIT = 4000;
    let n = 0;
    while (n < LIMIT && (!breakAtTank || !this.tankPos)) {
      n += 1;
      const input = this.getNextInput();
      this.update(input);
    }

    return n;
  }

  update = (input) => {
    const { output } = (this.computer.started)
      ? this.computer.resume([input])
      : this.computer.execute(null, null, [input]);

    this.computer.output = [];

    if (output[0] === 0) { this.updateField(this.applyMove(input), '#'); return; }

    this.pos = this.applyMove(input);

    const next = this.field.get(this.pos);
    this.distanceFromOrigin = next
      ? next.distanceFromOrigin
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
    if (!this.field.get(pos)) {
      this.field.set(pos, value, this.distanceFromOrigin);
    }
  }
}

export const findTank = (program) => {
  const robot = new Robot(program);
  const cycles = robot.explore(true);

  console.log(`Found the tank in ${cycles} cycles`);
  return robot.distanceFromOrigin;
};

export const timeToFill = (program) => {
  const robot = new Robot(program, new Field());
  robot.explore(true);

  const field = new Field();
  field.origin = { ...robot.tankPos };

  robot.field = field;
  robot.distanceFromOrigin = 0;
  robot.maxDistanceFromOrigin = 0;

  robot.explore();

  return robot.maxDistanceFromOrigin;
};
