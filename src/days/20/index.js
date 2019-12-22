/* eslint-disable max-classes-per-file */
const parseInput = input => input.split('\n').map(row => row.split(''));

class Node {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.edges = new Set();
  }
}

class Graph {
  constructor() {
    this.nodes = new Map();
    this.points = new Map();
  }

  node = (x, y, value) => {
    const key = `${x},${y}`;
    if (this.nodes.has(key)) { return this.nodes.get(key); }

    const node = new Node(key, value);
    this.nodes.set(key, node);
    this.points.set(node, { x, y });

    return node;
  }

  connect = (a, b) => {
    a.edges.add(b);
    b.edges.add(a);
  }
}

class Maze {
  constructor(field, recursive) {
    this.field = field;
    this.recursive = recursive;
    this.graph = new Graph();

    this.portals = this.findPortals();
    this.addPortalEdges();

    this.buildGraph();
  }

  buildGraph = () => {
    const toVisit = Object.values(this.portals).reduce((acc, p) => {
      p.forEach(point => acc.push(this.graph.nodes.get(`${point.x},${point.y}`)));

      return acc;
    }, []);

    const visitedNodes = new Set();

    // eslint-disable-next-line no-constant-condition
    while (toVisit.length) {
      const current = toVisit.pop();
      visitedNodes.add(current);
      const { x, y } = this.graph.points.get(current);

      const choices = [
        { x, y: y - 1 },
        { x, y: y + 1 },
        { x: x - 1, y },
        { x: x + 1, y },
      ];

      const valid = choices.filter(c => (
        (this.field[c.y]?.[c.x] === '.')
      ));

      valid.forEach((c) => {
        const node = this.graph.node(c.x, c.y, '.');
        this.graph.connect(current, node);

        if (!visitedNodes.has(node)) { toVisit.push(node); }
      });
    }
  }

  getPath = () => {
    const AA = this.portals.AA[0];
    const a = this.graph.nodes.get(`${AA.x},${AA.y}`);

    const ZZ = this.portals.ZZ[0];
    const b = this.graph.nodes.get(`${ZZ.x},${ZZ.y}`);

    const initial = [a];

    initial.depth = 0;
    initial.maxDepth = 0;
    initial.portalCount = 0;

    const sequences = [initial];

    // Minimize runtime by stopping any search paths that get too far off-track
    const MAX_DEPTH = 25;

    let foundPath;
    while (!foundPath && sequences.length) {
      const current = sequences.shift();
      const node = current[current.length - 1];

      if (node === b && current.depth === 0) {
        foundPath = current;
      } else {
        const adjacents = node.edges;

        // eslint-disable-next-line no-loop-func
        adjacents.forEach((adj) => {
          if (current[current.length - 2] === adj) {
            return;
          }

          const newSequence = [...current, adj];

          const { portalType } = node;
          if (portalType === -1 && current.depth === 0) { return; }

          if (portalType && adj.portalType) {
            newSequence.depth = current.depth + portalType;
            newSequence.portalCount = current.portalCount + 1;
            newSequence.maxDepth = Math.max(current.maxDepth, newSequence.depth);
          } else {
            newSequence.depth = current.depth;
            newSequence.portalCount = current.portalCount;
            newSequence.maxDepth = current.maxDepth;
          }

          if (newSequence.depth > MAX_DEPTH) { return; }

          sequences.push(newSequence);
        });
      }
    }

    if (!foundPath) { throw new Error('Ran out of search paths. Try increasing MAX_DEPTH?'); }
    return foundPath;
  }

  // eslint-disable-next-line consistent-return
  findPortals = () => {
    const { field } = this;
    const portals = {};

    for (let row = 0; row < field.length; row += 1) {
      for (let col = 0; col < field[row].length; col += 1) {
        const cur = field[row][col];

        if (cur?.match(/[A-Z]/)) {
          if (field[row][col + 1]?.match(/[A-Z]/)) {
            const key = `${cur}${field[row][col + 1]}`;

            if (!portals[key]) { portals[key] = []; }
            portals[key].push((field[row][col + 2] === '.')
              ? { x: col + 2, y: row }
              : { x: col - 1, y: row });
          } else if (field[row + 1]?.[col]?.match(/[A-Z]/)) {
            const key = `${cur}${field[row + 1][col]}`;

            if (!portals[key]) { portals[key] = []; }
            portals[key].push((field[row + 2]?.[col] === '.')
              ? { x: col, y: row + 2 }
              : { x: col, y: row - 1 });
          }
        }
      }
    }

    return portals;
  }

  addPortalEdges = () => {
    Object.entries(this.portals).forEach(([name, [a, b]]) => {
      const nodeA = this.graph.node(a.x, a.y, name);

      // For AA and ZZ
      if (!b) { return; }

      const nodeB = this.graph.node(b.x, b.y, name);

      if (this.recursive) {
        const outsideColA = (a.x === 2 || a.x === this.field[a.y].length - 3);
        const outsideRowA = (a.y === 2 || a.y === this.field.length - 3);
        nodeA.portalType = (outsideColA || outsideRowA) ? -1 : 1;

        const outsideColB = (b.x === 2 || b.x === this.field[b.y].length - 3);
        const outsideRowB = (b.y === 2 || b.y === this.field.length - 3);
        nodeB.portalType = (outsideColB || outsideRowB) ? -1 : 1;
      } else {
        nodeA.portalType = 0;
        nodeB.portalType = 0;
      }

      this.graph.connect(nodeA, nodeB);
    });
  }

  print = () => {
    const out = this.field.reduce((acc, row) => {
      acc.push(row.join(''));
      return acc;
    }, []).join('\n');

    // eslint-disable-next-line no-console
    console.log(out);
  }
}

export const part1 = (input) => {
  const field = parseInput(input);
  const maze = new Maze(field);

  const a = maze.portals.AA[0];
  const keyA = `${a.x},${a.y}`;
  const AA = maze.graph.nodes.get(keyA);

  const b = maze.portals.ZZ[0];
  const keyZ = `${b.x},${b.y}`;
  const ZZ = maze.graph.nodes.get(keyZ);

  const path = maze.getPath(AA, ZZ);
  return path.length - 1;
};

export const part2 = (input) => {
  const field = parseInput(input);
  const maze = new Maze(field, true);

  const a = maze.portals.AA[0];
  const keyA = `${a.x},${a.y}`;
  const AA = maze.graph.nodes.get(keyA);

  const b = maze.portals.ZZ[0];
  const keyZ = `${b.x},${b.y}`;
  const ZZ = maze.graph.nodes.get(keyZ);

  const path = maze.getPath(AA, ZZ);
  return path.length - 1;
};
