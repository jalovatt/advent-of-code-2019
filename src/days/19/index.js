import IntCode from '../../common/IntCode';

const printField = (field) => {
  // eslint-disable-next-line no-console
  console.log(field.map(row => row.map(cell => (cell ? '#' : '.')).join('')).join('\n'));
};

class TractorBeam {
  constructor(program, n) {
    this.n = n;
    this.computer = new IntCode(program);
    this.inputPositions = new Array(n * n).fill(null).map((_, i) => [i % n, Math.floor(i / n)]);
  }

  execute = () => {
    const field = new Array(this.n).fill(null).map(() => new Array(this.n));

    // eslint-disable-next-line no-constant-condition
    while (this.inputPositions.length) {
      const pos = this.inputPositions.pop();
      const { output } = this.computer.execute(null, null, [...pos]);

      [field[pos[0]][pos[1]]] = output;
    }

    return field;
  }

  countPoints = (field) => {
    return field.reduce((acc, row) => {
      row.forEach((point) => { acc += point; });
      return acc;
    }, 0);
  }
}

export const part1 = (program, fieldSize) => {
  const tb = new TractorBeam(program, fieldSize);
  const field = tb.execute();
  return tb.countPoints(field);
};

export const part2test = (field, targetSize) => {
  // printField(field);
  const coords = findFitCoords(field, targetSize);
  return [coords.x, coords.y, (coords.x * 10000 + coords.y)];
  // return tb.fit(field, targetSize);
};

const findFitCoords = (field, targetSize) => {
  for (let y = (targetSize * 2); y < field.length; y += 1) {
    const row = field[y];
    if (row.filter(c => !!c).length >= targetSize) {
      const rightCol = row.lastIndexOf(1);

      if (field[y + targetSize - 1]?.[rightCol - targetSize + 1] === 1) {
        const x = field[y + targetSize - 1].indexOf(1);
        return { x, y };
      }
    }
  }

  throw new Error(`This field can't fit a ${targetSize}-unit square`);
};

export const part2 = (program, TARGET_SIZE = 100) => {
  const computer = new IntCode(program);

  const shipWillFitAt = (x, y) => (
    computer.execute(null, null, [x, y]).output[0]
    && computer.execute(null, null, [x + TARGET_SIZE - 1, y]).output[0]
    && computer.execute(null, null, [x, y + TARGET_SIZE - 1]).output[0]
  );

  // To fit the example input
  const SLOPE_CHECK = 33;
  let slopeLower;
  {
    let x = 0;
    while (!slopeLower) {
      if (computer.execute(null, null, [x, SLOPE_CHECK]).output[0]) { slopeLower = SLOPE_CHECK / x; }
      x += 1;
    }
  }

  let slopeUpper;
  {
    let y = 0;
    while (!slopeUpper) {
      if (computer.execute(null, null, [SLOPE_CHECK, y]).output[0]) { slopeUpper = y / SLOPE_CHECK; }
      y += 1;
    }
  }

  const slope = (slopeUpper + slopeLower) / 2;

  let point;
  let x = TARGET_SIZE;
  while (!point) {
    const y = Math.floor(x * slope);
    if (shipWillFitAt(x, y)) { point = { x, y }; }
    x += 1;
  }

  while (true) {
    const possible = [
      { x: point.x - 1, y: point.y },
      { x: point.x - 1, y: point.y - 1 },
      { x: point.x, y: point.y - 1 },
      { x: point.x + 1, y: point.y - 1 },
      { x: point.x - 1, y: point.y + 1},
    ]
      .map(pos => ({ ...pos, fit: shipWillFitAt(pos.x, pos.y) }));

    // console.log('----------');
    // console.log(point);
    // console.log(JSON.stringify(possible, null, 2));

    const willFit = possible.filter(pos => !!pos.fit);
    if (!willFit.length) { break; }

    [point] = willFit.sort((a, b) => (a.x ** 2 + a.y ** 2) - (b.x ** 2 + b.y ** 2));
  }

  return [point.x, point.y, (point.x * 10000 + point.y)];
};
