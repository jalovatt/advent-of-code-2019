import IntCode from '../../common/IntCode';
import loadText from '../../utilities/loadText';

const program = loadText('input.txt');

class TractorBeam {
  constructor(n) {
    this.n = n;
    this.computer = new IntCode(program);
    this.inputPositions = new Array(n * n).fill(null).map((_, i) => [i % n, Math.floor(i / n)]);
  }

  execute = () => {
    const field = new Array(this.n).fill(null).map(_ => new Array(this.n));

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

  fit = (field, targetSize) => {
    for (let x = targetSize * 2; x < (field.length - targetSize); x += 1) {
      // for (let y = targetSize * 2; y < (field.length - targetSize); y += 1) {
        if (field[x][x]
          && field[x][x + targetSize]
          && field[x + targetSize][x]
        ) {
          return
        }
      // }
    }
  }

  print = (field) => {
    console.log(field.map(row => row.map(cell => (cell ? '#' : '.')).join('')).join('\n'));
  }
}
export const part1 = (fieldSize) => {
  const tb = new TractorBeam(fieldSize);
  const field = tb.execute();
  return tb.countPoints(field);
};

export const part2 = (targetSize) => {
  const tb = new TractorBeam(targetSize * 4);
  const field = tb.execute();
  tb.print(field);
  // return tb.fit(field, targetSize);
};
