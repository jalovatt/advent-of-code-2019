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

export const part1 = (instructions, size) => {
  const deck = new Array(size).fill(null).map((v, i) => i);
  const parsed = parseInstructions(instructions);
  return parsed.reduce((acc, cur) => cur(acc), deck);
};
