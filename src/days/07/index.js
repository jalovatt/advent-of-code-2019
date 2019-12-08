import IntCode from '../../common/IntCode';

// Heap's algorithm
// https://stackoverflow.com/a/37580979
const permutations = (arr) => {
  const result = [arr.slice()];
  const c = new Array(arr.length).fill(0);
  let i = 1;
  let k;
  let swap;

  while (i < arr.length) {
    if (c[i] < i) {
      k = i % 2 && c[i];

      swap = arr[i];
      // eslint-disable-next-line no-param-reassign
      arr[i] = arr[k];
      // eslint-disable-next-line no-param-reassign
      arr[k] = swap;

      result.push(arr.slice());

      c[i] += 1;
      i = 1;
    } else {
      c[i] = 0;
      i += 1;
    }
  }
  return result;
};

export const findMaxDirectSignal = (program) => {
  const perms = permutations([0, 1, 2, 3, 4]);
  const thrusters = new Array(5).fill(null).map(() => new IntCode(program));

  return perms.reduce((maxSignal, settings) => {
    const signal = thrusters.reduce((input, thruster, i) => (
      thruster.execute(null, null, [settings[i], input]).lastOutput
    ), 0);

    // eslint-disable-next-line no-param-reassign
    if (signal > maxSignal) { maxSignal = signal; }

    return maxSignal;
  }, 0);
};

export const findMaxFeedbackSignal = (program) => {
  const perms = permutations([5, 6, 7, 8, 9]);

  return perms.reduce((maxSignal, settings) => {
    const thrusters = new Array(5).fill(null).map(() => new IntCode(program));

    let i = 0;
    let output = 0;

    // Definitely needed help for this
    // https://www.reddit.com/r/adventofcode/comments/e7a4nj/2019_day_7_solutions/f9wrc84?utm_source=share&utm_medium=web2x
    while (!thrusters[4].halted) {
      const thruster = thrusters[i];

      output = (!thruster.started)
        ? thruster.execute(null, null, [settings[i], output]).lastOutput
        : thruster.resume([output]).lastOutput;

      i = (i + 1) % thrusters.length;
    }

    const signal = thrusters[4].lastOutput;

    // eslint-disable-next-line no-param-reassign
    if (signal > maxSignal) { maxSignal = signal; }

    return maxSignal;
  }, 0);
};
