const basePattern = [0, 1, 0, -1];

const getPattern = (n, length) => {
  const rawPattern = [];
  basePattern.forEach((digit) => {
    for (let i = 0; i < n; i += 1) {
      rawPattern.push(digit);
    }
  });

  const times = Math.ceil(length / rawPattern.length) + 1;

  const pattern = new Array(times).fill(rawPattern).flat();
  pattern.shift();
  return pattern;
};

// eslint-disable-next-line import/prefer-default-export
export const iterate = (input, n) => {
  // console.log('--------');
  const inputDigits = input.split('').map(v => parseInt(v, 10));
  let outputDigits = [...inputDigits];

  for (let i = 0; i < n; i += 1) {
    // console.log(`loop start with: ${outputDigits.join('')}`);
    const currentDigits = [];
    // eslint-disable-next-line no-loop-func
    outputDigits.forEach((v, index) => {
      let pattern = getPattern(index + 1, outputDigits.length);
      // console.log(`\tpattern @ ${index} = ${pattern.join(', ')}`);

      const value = outputDigits.reduce((acc, cur, innerIndex) => {
        return acc + (cur * pattern[innerIndex]);
      }, 0);

      currentDigits.push(Math.abs(value) % 10);
    });

    outputDigits = currentDigits;
    // console.log(`loop ended with: ${outputDigits.join('')}`);
    console.log(`finished iteration ${i}`);
  }

  return outputDigits.join('');
};

export const findFirstEight = (input, n) => {
  const output = iterate(input, n);
  return output.toString(10).slice(0, 8);
};

export const part2 = (input, n) => {
  const inputArr = input.split('');
  const fullInputDigits = inputArr.reduce((acc, cur, index) => {
    for (let i = 0; i < 10000; i += 1) {
      acc[index + i * inputArr.length] = cur;
    }
    return acc;
  }, []);

  const fullInputStr = fullInputDigits.join('');
  const output = iterate(fullInputStr, 100);

  const place = parseInt(input.slice(0, 7), 10);
  console.log(input.slice(0, 10), place, output.length);
  const str = output.slice(place, place + 8);
  return str;
};
