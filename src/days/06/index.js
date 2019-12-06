// eslint-disable-next-line max-classes-per-file
class Node {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  countTotalDescendants = (distance = 0) => (
    distance + this.children.length + this.children.reduce((acc, child) => (
      acc + child.countTotalDescendants(distance + 1)
    ), 0)
  );

  getAncestors = () => {
    const ancestors = new Map();
    let current = this.parent;
    let distance = 0;

    while (current) {
      distance += 1;
      ancestors.set(current, distance);
      current = current.parent;
    }

    return ancestors;
  }

  findLca = (otherAncestors) => {
    let current = this.parent;
    let distance = 1;

    while (current.parent) {
      if (otherAncestors.has(current)) { return [current, distance]; }

      distance += 1;
      current = current.parent;
    }

    return [];
  }

  findDistanceTo = (other) => {
    const ancestorsMap = this.getAncestors();
    const [lca, otherDistanceToLca] = other.findLca(ancestorsMap);

    return ancestorsMap.get(lca) + otherDistanceToLca;
  }
}

class Tree {
  constructor(rootKey) {
    this.rootKey = rootKey;
    this.nodes = {};
  }

  addRelationship = (parent, child) => {
    if (!this.nodes[parent]) { this.nodes[parent] = new Node(parent); }
    if (!this.nodes[child]) { this.nodes[child] = new Node(child); }

    this.nodes[child].parent = this.nodes[parent];
    this.nodes[parent].children.push(this.nodes[child]);
  };

  // Not sure why the extra math here is required
  countTotalDescendants = () => (
    this.nodes[this.rootKey].countTotalDescendants() - Object.keys(this.nodes).length + 1
  );

  distanceBetween = (a, b) => {
    const nodeA = this.nodes[a];
    const nodeB = this.nodes[b];

    if (!nodeA) { throw new Error(`Node "${a}" does not exist in this tree`); }
    if (!nodeB) { throw new Error(`Node "${b}" does not exist in this tree`); }

    return nodeA.findDistanceTo(nodeB);
  }
}

const treeFromMapStr = mapStr => mapStr.split('\n').reduce((acc, line) => {
  const [parent, child] = line.split(')');

  acc.addRelationship(parent, child);

  return acc;
}, new Tree('COM'));

export const countOrbits = (mapStr) => {
  const bodies = treeFromMapStr(mapStr);

  return bodies.countTotalDescendants();
};

export const distanceToSanta = (mapStr) => {
  const bodies = treeFromMapStr(mapStr);

  return bodies.distanceBetween('YOU', 'SAN') - 2; // -2 since we only need to orbit the same parent
};
