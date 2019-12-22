import IntCode from '../../common/IntCode';
import loadText from '../../utilities/loadText';

const program = loadText('input.txt');

const printField = (field) => {
  // eslint-disable-next-line no-console
  console.log(field.map(row => row.map(cell => (cell ? '#' : '.')).join('')).join('\n'));
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

class TractorBeam {
  constructor(n) {
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

export const part1 = (fieldSize) => {
  const tb = new TractorBeam(fieldSize);
  const field = tb.execute();
  return tb.countPoints(field);
};

export const part2test = (field, targetSize) => {
  // printField(field);
  const coords = findFitCoords(field, targetSize);
  return [coords.x, coords.y, (coords.x * 10000 + coords.y)];
  // return tb.fit(field, targetSize);
};

export const part2 = () => {
  const tb = new TractorBeam(300);
  const field = tb.execute();
  const coords = findFitCoords(field, 100);
  return [coords.x, coords.y, (coords.x * 10000 + coords.y)];
};
