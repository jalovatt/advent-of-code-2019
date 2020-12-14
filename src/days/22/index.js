/* global BigInt */

export const newStack = (deck) => {
  const out = [];
  while (deck.length) { out.push(deck.pop()); }

  return out;
};

export const cutCards = (deck, n) => {
  return deck.slice(n).concat(deck.slice(0, n));
};

export const withIncrement = (deck, n) => {
  const out = [];

  let i = 0;
  let pos = 0;
  while (i < deck.length) {
    out[pos % deck.length] = deck[i];

    i += 1;
    pos += n;
  }

  return out;
};

const parseInstructions = (instructions) => {
  return instructions.split('\n').map((line) => {
    if (line.match('stack')) { return newStack; }
    if (line.match('cut')) {
      const n = parseInt(line.match(/([-\d]+)$/)[1], 10);
      return (deck) => cutCards(deck, n);
    }

    const n = parseInt(line.match(/([-\d+]+)$/)[1], 10);
    return (deck) => withIncrement(deck, n);
  });
};

const SIZE = 119315717514047n;
const ITERATIONS = 101741582076661n;

/*
  After a year I finally found an explanation that made enough sense for me to
  feel comfortable that I wasn't just copying someone else's solution.

  https://codeforces.com/blog/entry/72593
*/
const parseInstructions2 = (instructions) => {
  return instructions.split('\n').map((line => {
    if (line.match('deal into')) {
      /*
        f(x) = SIZE - x - 1
             = -1*x - 1 (mod m)
      */
      return [BigInt(-1), BigInt(-1)];
    }

    if (line.match('cut')) {
      /*
        f(x) = x - n (mod m)
             = 1*x - 1*n
      */
      const n = parseInt(line.match(/([-0-9]+)/)[1], 10);
      return [BigInt(1), BigInt(-n)];
    }

    /*
      Deal with increment

      f(x) = n*x (mod m)
           = n*x - 0
    */
    const n = parseInt(line.match(/([-0-9]+)/)[1], 10);
    return [BigInt(n), BigInt(0)];
  }));
};

/*
  Composing linear congruential functions

  Given:
    f(x) = ax + b (mod m)
    g(x) = cx + d (mod m)

    =>

    g(f(x)) = c(ax + b) + d (mod m)
            = a*c*x + b*c + d (mod m)

  For tuples of [a, b]:

    (a,b);(c,d) => (a*c mod m, b*c + d mod m)
*/
const composeInstructions = (f, g) => {
  const [a, b] = f;
  const [c, d] = g;

  return [(a * c) % SIZE, (b * c + d) % SIZE];
};

/*
  Exponentiation by squaring to efficiently compose a large number of operations
  https://en.wikipedia.org/wiki/Exponentiation_by_squaring
*/
const composeInstructionToPower = (instruction, pow) => {
  let f = instruction;
  let g = [1n, 0n];
  let k = pow;

  while (k > 0n) {
    if (k % 2n) {
      g = composeInstructions(g, instruction);
    }

    k /= 2n;
    f = composeInstructions(f, f);
  }

  return g;
};

// https://en.wikipedia.org/wiki/Modular_exponentiation#Right-to-left_binary_method
const modPow = (x, n, m) => {
  if (m === 1n) { return 0; }

  let result = 1n;
  x %= m;

  while (n > 0n) {
    if (n % 2n) {
      result = (result * x) % m;
    }

    n >>= 1n;

    x = (x * x) % m;
  }

  return result;
};

/*
  If m is prime:

    1/a mod m
    =>
    a^(m - 2) mod m

  Regular division:

    a/b = a * 1/b
*/
const modDivide = (a, b, m) => (a * modPow(b, m - 2n, m)) % m;

/*
  What position does card x end up in:
  f^k(x) = Ax + B (mod m)

  =>

  What card is in position x:
  f^-k(x) = (x - B) / A (mod m)

*/
const getSolutionFn = (instruction) => {
  const [a, b] = instruction;

  return (x) => modDivide(x - b, a, SIZE);
};

export const part1 = (instructions, size) => {
  const deck = new Array(size).fill(null).map((v, i) => i);
  const parsed = parseInstructions(instructions);
  return parsed.reduce((acc, cur) => cur(acc), deck);
};

/*
  13589861979965n too low
*/
export const part2 = (instructions, card) => {
  const parsed = parseInstructions2(instructions);
  const params = parsed.reduce(composeInstructions);
  const final = composeInstructionToPower(params, ITERATIONS);

  console.log(card, final);

  const solutionFn = getSolutionFn(final);

  return solutionFn(BigInt(card));
};
