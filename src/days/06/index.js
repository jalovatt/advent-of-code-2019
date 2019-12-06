let bodies = {};

class Body {
  constructor() {
    this.children = [];
  }

  countChildOrbits = (distance = 0) => {
    return distance + this.children.length + this.children.reduce((acc, child) => {
      return acc + bodies[child].countChildOrbits(distance + 1);
    }, 0);
  }
}

// eslint-disable-next-line import/prefer-default-export
export const countOrbits = (mapStr) => {
  bodies = {};

  mapStr.split('\n').forEach((line) => {
    const [inner, outer] = line.split(')');

    if (!bodies[inner]) { bodies[inner] = new Body(); }
    if (!bodies[outer]) { bodies[outer] = new Body(); }

    bodies[outer].parent = bodies[inner];
    bodies[inner].children.push(outer);
  });

  // Genuinely don't know why this extra work is required
  return bodies.COM.countChildOrbits() - Object.keys(bodies).length + 1;
};
