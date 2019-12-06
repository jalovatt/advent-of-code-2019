class Body {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  countChildOrbits = (distance = 0) => {
    return distance + this.children.length + this.children.reduce((acc, child) => {
      return acc + child.countChildOrbits(distance + 1);
    }, 0);
  }

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
}

const generateBodies = mapStr => mapStr.split('\n').reduce((acc, line) => {
  const [inner, outer] = line.split(')');

  if (!acc[inner]) { acc[inner] = new Body(inner); }
  if (!acc[outer]) { acc[outer] = new Body(outer); }

  acc[outer].parent = acc[inner];
  acc[inner].children.push(acc[outer]);

  return acc;
}, {});

// eslint-disable-next-line import/prefer-default-export
export const countOrbits = (mapStr) => {
  const bodies = generateBodies(mapStr);

  // Genuinely don't know why this extra work is required
  return bodies.COM.countChildOrbits() - Object.keys(bodies).length + 1;
};

export const distanceToSanta = (mapStr) => {
  const bodies = generateBodies(mapStr);

  const myAncestors = bodies.YOU.getAncestors();
  const [lca, santaDistance] = bodies.SAN.findLca(myAncestors);

  return myAncestors.get(lca) + santaDistance - 2; // -2 since it's not dist = me -> santa
};
