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

const SIZE = 119315717514047;
const ITERATIONS = 101741582076661;

const reversePos = (pos) => SIZE - 1 - pos;
const cachedInstructions = {
  'deal into new stack': reversePos,
};

// .reduce((acc, cur) => { acc.unshift(cur); return acc; }, [])
const parseInstructions2 = (instructions) => {
  return instructions.split('\n').map((line => {
    if (cachedInstructions[line]) { return cachedInstructions[line]; }
    if (line.match('cut')) {

      let n = parseInt(line.match(/([-\d]+)$/)[1], 10);
      cachedInstructions[line] = (card) => {
        if (n < 0) { n = SIZE - n; }
        if (card >= n) {
          return card - n;
        }

        return card + (SIZE - 1 - n);
      };

      return cachedInstructions[line];
    }

    const n = parseInt(line.match(/([-\d]+)$/)[1], 10);
    cachedInstructions[line] = (card) => {
      return (card * n) % SIZE;
    };

    return cachedInstructions[line];
  }));
};

const findLoopSize = (parsed, card) => {
  let n = 0;
  let cur = card;

  do {
    if (n === 1000) { throw new Error('hit limit'); }
    cur = parsed.reduce((acc, cur) => cur(acc), cur);
    console.log(cur);
    n += 1;
  } while (cur !== card);

  return n;
};

export const part1 = (instructions, size) => {
  const deck = new Array(size).fill(null).map((v, i) => i);
  const parsed = parseInstructions(instructions);
  return parsed.reduce((acc, cur) => cur(acc), deck);
};

export const part2 = (instructions, card) => {
  const parsed = parseInstructions2(instructions, card);

  const loopSize = findLoopSize(parsed, card);
  // const needed = ITERATIONS % loopSize;

  // for (let i = 0; i < needed; i += 1) {
  //   card = parsed.reduce((acc, cur) => cur(acc), card);
  // }
  console.log(loopSize);
};
