import IntCode from '../../common/IntCode';

export const part1 = (program, fieldSize, printField) => {
  const computer = new IntCode(program);

  let count = 0;

  const field = [];
  for (let y = 0; y < fieldSize; y += 1) {
    if (printField && !field[y]) { field[y] = []; }

    for (let x = 0; x < fieldSize; x += 1) {
      const { output } = computer.execute(null, null, [x, y]);

      count += output[0];

      if (printField) {
        field[y][x] = output[0] ? '#' : '.';
      }
    }
  }

  if (printField) {
    // eslint-disable-next-line no-console
    console.log(field.map(row => row.join('')).join('\n'));
  }

  return count;
};

const printFieldAt = (computer, xBase, yBase, size) => {
  const PADDING = 20;
  const field = [];
  for (let y = yBase - PADDING; y < (yBase + size + PADDING); y += 1) {
    if (!field[y]) { field[y] = []; }
    for (let x = xBase - PADDING; x < (xBase + size + PADDING); x += 1) {
      const [val] = computer.execute(null, null, [x, y]).output;

      field[y][x] = (x >= xBase && x < xBase + size && y >= yBase && y < yBase + size && 'O')
        || (val && '#')
        || '.';
    }
  }

  return field
    .slice(yBase - PADDING, yBase + size + PADDING + 1)
    .map(row => row.slice(xBase - PADDING, xBase + size + PADDING + 1).join(''))
    .join('\n');
};

export const part2 = (program, TARGET_SIZE = 100, printField) => {
  const computer = new IntCode(program);

  const shipWillFitAt = (x, y) => (
    computer.execute(null, null, [x + TARGET_SIZE - 1, y]).output[0]
    && computer.execute(null, null, [x, y + TARGET_SIZE - 1]).output[0]
    && computer.execute(null, null, [x, y]).output[0]
  );

  // To fit the example input
  const CHECK = 20;
  let slopeLower;
  {
    let x = 0;
    while (!slopeLower) {
      if (computer.execute(null, null, [x, CHECK]).output[0]) { slopeLower = CHECK / x; }
      x += 1;
    }
  }

  let slopeUpper;
  {
    let y = 0;
    while (!slopeUpper) {
      if (computer.execute(null, null, [CHECK, y]).output[0]) { slopeUpper = y / CHECK; }
      y += 1;
    }
  }

  const slope = (slopeUpper + slopeLower) / 2;

  let point;
  let x = 2 * TARGET_SIZE;
  while (!point) {
    const y = Math.floor(x * slope);
    if (shipWillFitAt(x, y)) { point = { x, y }; }
    x += TARGET_SIZE;
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const next = [
      { x: point.x - 2, y: point.y - 2 },
      { x: point.x - 1, y: point.y - 2 },
      { x: point.x - 2, y: point.y - 1 },
      { x: point.x - 1, y: point.y - 1 },
      { x: point.x - 1, y: point.y },
      { x: point.x, y: point.y - 1 },
    ]
      .find(pos => shipWillFitAt(pos.x, pos.y));

    if (!next) { break; }
    point = next;
  }

  if (printField) {
    const out = printFieldAt(computer, point.x, point.y, TARGET_SIZE);
    // eslint-disable-next-line global-require
    require('fs').writeFileSync(`${__dirname}/printout.txt`, out);
    // eslint-disable-next-line no-console
    console.log(`printed field at ${point.x},${point.y} to ./printout.txt`);
  }

  return [point.x, point.y, (point.x * 10000 + point.y)];
};
