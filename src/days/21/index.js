import IntCode from '../../common/IntCode';

const instructions1 = [
  'NOT A J',
  'NOT C T',
  'AND D T',
  'OR T J',
  'WALK\n',
];

// I won't lie, I needed some logic hints from the Reddit solution thread here
const instructions2 = [
  'NOT A J',
  'NOT B T',
  'OR T J',
  'NOT C T',
  'OR T J',
  'AND D J',
  'NOT E T',
  'AND H T',
  'OR E T',
  'AND T J',
  'RUN\n',
];

class SpringDroid {
  constructor(program, instructions) {
    this.computer = new IntCode(program);
    this.instructions = instructions;
  }

  execute = () => {
    this.computer.execute(null, null, this.getInput());

    const { output } = this.computer;

    if (output[output.length - 1] < 128) {
      // eslint-disable-next-line no-console
      console.log(this.print());
      return false;
    }

    return output[output.length - 1];
  }

  getInput = () => {
    const joined = this.instructions.join('\n');
    return joined.split('').map(c => c.charCodeAt(0));
  }

  print = () => this.computer.output.map(v => (v < 128 ? String.fromCharCode(v) : v)).join('');
}

export const part1 = (input) => {
  const droid = new SpringDroid(input, instructions1);

  return droid.execute();
};

export const part2 = (input) => {
  const droid = new SpringDroid(input, instructions2);

  return droid.execute();
};
