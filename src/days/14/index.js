import DAG from '../../common/DAG';

const parseReactions = reactionList => reactionList.split('\n').reduce((acc, cur) => {
  const [, lhs, rhs] = cur.match(/(.+) => (.+)/);

  const [, qOut, typeOut] = rhs.match(/(\d+) ([a-zA-Z]+)/);

  if (!acc[typeOut]) { acc[typeOut] = acc.upsert(typeOut); }
  acc.upsert(typeOut, parseInt(qOut, 10));

  lhs.match(/(\d+ [a-zA-Z]+)/g).forEach((str) => {
    const [q, type] = str.split(' ');

    acc.connect(type, typeOut, parseInt(q, 10) / parseInt(qOut, 10));
  });

  return acc;
}, new DAG());

const totalOre = (reactions, FUEL = 1) => {
  const needed = { FUEL };

  reactions.forEachInOrder((node) => {
    if (!node.parentEdges.length) { return; }
    const quantity = Math.ceil((needed[node.name] || 0) / node.value) * node.value;

    node.parentEdges.forEach((edge) => {
      const quantityOut = (needed[edge.parent.name] || 0) + (edge.value * quantity);
      needed[edge.parent.name] = quantityOut;
    });

    if (node.parentEdges.length) { needed[node.name] = 0; }
  }, true);

  return needed.ORE;
};

const exponentialSearchLessThan = (cb, target, lowerLimit = 1) => {
  let current = lowerLimit;
  while (cb(current) < target) {
    current *= 2;
  }

  const bounds = [current / 2, current];

  let newBound;
  let result;
  while (bounds[0] < (bounds[1] - 1)) {
    newBound = Math.floor((bounds[0] + bounds[1]) / 2);
    result = cb(newBound);

    if (result > target) {
      bounds[1] = newBound;
    } else if (result < target) {
      bounds[0] = newBound;
    }
  }

  return bounds[0];
};

export const part1 = (reactionList) => {
  const reactions = parseReactions(reactionList);
  return totalOre(reactions);
};

export const part2 = (reactionList) => {
  const reactions = parseReactions(reactionList);
  const ORE = 1000000000000;

  return exponentialSearchLessThan(n => totalOre(reactions, n), ORE);
};
