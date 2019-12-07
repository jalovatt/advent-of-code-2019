import IntCode from '../../common/IntCode';

// https://stackoverflow.com/a/37580979
// TODO: Refactor so I can understand what it's doing;

const permutations = (arr) => {
  const result = [arr.slice()];
  const c = new Array(arr.length).fill(0);
  let i = 1;
  let k;
  let p;

  while (i < arr.length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = arr[i];
      arr[i] = arr[k];
      arr[k] = p;
      c[i] += 1;
      i = 1;
      result.push(arr.slice());
    } else {
      c[i] = 0;
      i += 1;
    }
  }
  return result;
}

export default (program) => {
  const perms = permutations([0, 1, 2, 3, 4]);
  const thrusters = new Array(5).fill(null).map(() => new IntCode(program));

  return perms.reduce((maxSignal, settings) => {
    const signal = thrusters.reduce((input, thruster, i) => {
      return thruster.execute(null, null, [settings[i], input]).lastOutput;
    }, 0);

    if (signal > maxSignal) { maxSignal = signal; }

    return maxSignal;
  }, 0);
};
