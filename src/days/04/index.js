const twoAdjacentDigits = (password, strict) => {
  const twos = password.match(/(\d)\1{1}/g);

  if (twos && !strict) { return true; }

  const threes = password.match(/(\d)\1{2}/g);

  if (!twos) { return false; }
  if (!threes) { return true; }

  return twos.some(a => !threes.some(b => a[0] === b[0]));
};

const digitsIncrease = password => !password.split('').some((d, i) => d > (password[i + 1] || 9));

export const validate = (password, strict) => {
  const str = password.toString(10);

  return (
    (str.length === 6)
    && twoAdjacentDigits(str, strict)
    && digitsIncrease(str)
  );
};

export const passwordCount = ([start, end], strict) => {
  let count = 0;
  for (let i = start; i <= end; i += 1) {
    if (validate(i, strict)) { count += 1; }
  }

  return count;
};
