const newDigit = (digits, currentPos) => {
  let value = 0;

  const step = (currentPos + 1) * 4;
  const subtractOffset = 2 * (currentPos + 1);

  for (let i = currentPos; i < digits.length; i += step) {
    const sliceOffset = i + currentPos + 1;

    value += digits.slice(i, sliceOffset)
      .reduce((acc, v) => acc + v, 0);
    value -= digits.slice(i + subtractOffset, sliceOffset + subtractOffset)
      .reduce((acc, v) => acc + v, 0);
  }

  return Math.abs(value) % 10;
};

export const part1 = (input, n) => {
  const digits = input.split('').map(v => parseInt(v, 10));

  for (let iter = 0; iter < n; iter += 1) {
    for (let i = 0; i < digits.length; i += 1) {
      digits[i] = newDigit(digits, i);
    }
  }

  return digits.join('');
};

export const part2 = (input) => {
  const startOffset = parseInt(input.slice(0, 7), 10);

  const digits = input.split('').reduce((acc, cur, index) => {
    const value = parseInt(cur, 10);

    for (let i = 0; i < 10000; i += 1) {
      acc[index + i * input.length] = value;
    }
    return acc;
  }, []).slice(startOffset);

  for (let iter = 0; iter < 100; iter += 1) {
    let sum = digits.reduce((acc, v) => acc + v, 0);
    for (let i = 0; i < digits.length; i += 1) {
      const value = digits[i];

      digits[i] = sum % 10;
      sum -= value;
    }
  }

  return digits.slice(0, 8).join('');
};
