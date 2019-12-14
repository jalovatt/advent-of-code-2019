/* eslint-disable max-classes-per-file */
class Edge {
  constructor(parent, child, value) {
    this.parent = parent;
    this.child = child;
    this.value = value;
  }
}

class Node {
  constructor(name) {
    this.name = name;
    this.parentEdges = [];
    this.childEdges = [];
    this.value = 0;
  }
}

class DAG {
  constructor() {
    this.nodes = {};
    this.sortedNodes = null;
  }

  upsert = (name, value) => {
    if (!this.nodes[name]) { this.nodes[name] = new Node(name); }
    if (value) { this.nodes[name].value = value; }

    return this.nodes[name];
  }

  connect = (parent, child, value) => {
    const parentNode = this.upsert(parent);
    const childNode = this.upsert(child);
    const edge = new Edge(parentNode, childNode, value);
    parentNode.childEdges.push(edge);
    childNode.parentEdges.push(edge);
  }

  getSorted = () => {
    this.roots = Object.values(this.nodes).filter(node => !node.parentEdges.length);
    const available = [...this.roots];

    const resolved = {};
    const resolvedOrder = [];

    do {
      const current = available.shift();

      resolvedOrder.push(current);
      resolved[current.name] = true;

      current.childEdges.forEach((childEdge) => {
        if (childEdge.child.parentEdges.every(parentEdge => resolved[parentEdge.parent.name])) {
          available.push(childEdge.child);
        }
      });
    } while (available.length);

    return resolvedOrder;
  }
}

const parseReactions = reactionList => reactionList.split('\n').reduce((acc, cur) => {
  const [, lhs, rhs] = cur.match(/(.+) => (.+)/);

  const [, qOut, typeOut] = rhs.match(/(\d+) ([a-zA-Z]+)/);

  if (!acc[typeOut]) { acc[typeOut] = new Node(typeOut); }
  acc.upsert(typeOut, parseInt(qOut, 10));

  lhs.match(/(\d+ [a-zA-Z]+)/g).forEach((str) => {
    const [q, type] = str.split(' ');

    acc.connect(type, typeOut, parseInt(q, 10) / parseInt(qOut, 10));
  });

  return acc;
}, new DAG());

const totalOre = (sortedNodes, FUEL = 1) => {
  const needed = { FUEL };

  [...sortedNodes].reverse().forEach((node) => {
    if (!node.parentEdges.length) { return; }
    const quantity = Math.ceil((needed[node.name] || 0) / node.value) * node.value;

    node.parentEdges.forEach((edge) => {
      const quantityOut = (needed[edge.parent.name] || 0) + (edge.value * quantity);
      needed[edge.parent.name] = quantityOut;
    });

    if (node.parentEdges.length) { needed[node.name] = 0; }
  });

  return needed.ORE;
};

// TODO: Implement a proper binary search just to make sure I know how
const maxFuel = (sortedNodes) => {
  const ORE = 1000000000000;
  let fuel = 1;

  let oreOut = 0;
  while (oreOut < 1000000000000) {
    fuel *= 2;

    oreOut = totalOre(sortedNodes, fuel);
  }

  const bounds = [fuel / 2, fuel];

  let newBounds = [];
  for (let i = bounds[0]; i < bounds[1]; i += 100000) {
    if (totalOre(sortedNodes, i) > ORE) {
      newBounds = [i - 100000, i];
      break;
    }
  }

  for (let i = newBounds[0]; i < newBounds[1]; i += 1) {
    oreOut = totalOre(sortedNodes, i);
    if (oreOut > ORE) { return i - 1; }
  }

  return 0;
};

// eslint-disable-next-line import/prefer-default-export
export const part1 = (reactionList) => {
  const reactions = parseReactions(reactionList);
  const sorted = reactions.getSorted();
  return totalOre(sorted);
};

export const part2 = (reactionList) => {
  const reactions = parseReactions(reactionList);
  const sorted = reactions.getSorted();
  return maxFuel(sorted);
};
