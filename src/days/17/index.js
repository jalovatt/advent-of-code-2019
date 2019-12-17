import IntCode from '../../common/IntCode';

export const sumIntersections = (view) => {
  let total = 0;
  for (let row = 0; row < view.length; row += 1) {
    for (let column = 0; column < view[row].length; column += 1) {
      if (view[row][column] === '#') {
        const adjacent = [
          view[row - 1]?.[column],
          view[row + 1]?.[column],
          view[row][column - 1],
          view[row][column + 1],
        ].filter(v => v === '#');

        if (adjacent.length > 2) { total += row * column; }
      }
    }
  }

  return total;
};

class ControlSystem {
  constructor(program) {
    this.computer = new IntCode(program);
    this.lastOutput = [];
  }

  execute = (n, liveFeed) => {
    let LIMIT = n;
    while (LIMIT) {
      LIMIT -= 1;

      this.update();

      if (liveFeed) {
        const screens = this.lastOutput.map(v => String.fromCharCode(v)).join('').split('\n\n');
        screens.forEach((screen) => {
          console.log(screen);
          const now = new Date().getTime();
          while (new Date().getTime() - now < 200) {
            // do nothing
          }
        });
      }
    }
  }

  /*
    The ASCII definitions of the main routine and the movement functions may each
    contain at most 20 characters, not counting the newline.
  */
  getInput = () => {
    // const sequence = [65, 44, 66, 44, 67, 10];

    // // R , 6 , L , 1 2 , \n
    // const a = [82, 44, 54, 44, 76, 44, 49, 50, 10];
    // const b = [82, 44, 48, 10];
    // const c = [76, 44, 48, 10];
    // const feed = [121, 10];

    // const expected = sequence.concat(a, b, c, feed);
    // return sequence.concat(a, b, c, feed);
    const instructions = [
      ['A', 'B', 'C'],
      ['R', 6, 'L', 12],
      ['R', 0],
      ['L', 0],
    ];

    const joined = instructions.reduce((acc, cur) => {
      return acc.concat(['\n'], cur);
    });

    // console.log(joined);

    const converted = joined.reduce((acc, v) => {
      if (typeof v === 'string') {
        acc.push(v.charCodeAt(0));
      } else {
        const digits = v.toString(10).split('');
        acc = acc.concat(digits.map(v => parseInt(v.charCodeAt(0), 10)));
      }

      return acc;
    }, []);

    const withCommas = converted.reduce((acc, cur) => {
      if (cur !== 10 && acc[acc.length - 1] !== 10) { acc.push(44); }
      acc.push(cur);

      return acc;
    }, []);

    withCommas.shift();
    withCommas.push(10);
    withCommas.push(121);
    withCommas.push(10);
    console.log(withCommas);

    return withCommas;
    // const b = ['L', 0, '\n'];
    // const c = ['L', 0, '\n'];
    // const feed = [121, '\n'];

    // const full = sequence.concat(a, b, c, feed)
    //   .reduce((acc, cur) => {
    //     acc.push(cur);
    //     acc.push(',');

    //     return acc;
    //   }, [])
    //   .map(v => parseInt((typeof v === 'string'
    //     ? v.charCodeAt(0)
    //     : v), 10
    //   ));

    // full.pop();

    // console.log(full.join(','));
    // return full;

    // A , B , C \n
  }

  update = () => {
    const { output } = (this.computer.started)
      ? this.computer.resume(this.getInput())
      : this.computer.execute(null, null, this.getInput());

    this.lastOutput = output;
  }

  convertOutput = () => this.lastOutput.map(v => String.fromCharCode(v))
    .join('').split('\n').map(row => row.split(''));

  print = () => {
    const view = this.convertOutput();
    console.log(view.map(row => row.join('')).join('\n'));
  }
}

export const part1 = (input) => {
  const system = new ControlSystem(input);

  system.execute(1);
  system.print();
  return sumIntersections(system.convertOutput());
};

export const part2 = (input) => {
  const system = new ControlSystem(input);
  system.computer.initialState[0] = 2;

  system.execute(1, true);
  // system.print();
};
