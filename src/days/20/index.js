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
  constructor(field) {
    this.field = field;
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
        // && c.x >= 0
        // && c.x < this.field[0].length
        // && c.y >= 0
        // && c.y < this.field.length
      ));



      valid.forEach((c) => {
        const node = this.graph.node(c.x, c.y, '.');
        this.graph.connect(current, node);

        if (!visitedNodes.has(node)) { toVisit.push(node); }
      });
    }
  }

  getPath = (a, b) => {
    const sequences = [[a]];

    console.dir(this.portals);
    let foundPath;
    while (!foundPath) {
      const current = sequences.shift();
      const node = current[current.length - 1];

      if (node === b) {
        foundPath = current;
      } else {
        const adjacents = node.edges;

        // eslint-disable-next-line no-loop-func
        adjacents.forEach((adj) => {
          if (current[current.length - 1] === adj || current.includes(adj)) {
            return;
          }

          const newSequence = [...current];
          if (node.value.isPortal && adj.value.isPortal) { newSequence.pop(); }
          newSequence.push(adj);
          sequences.push(newSequence);
        });
      }
    }

    return foundPath;
  }

  // eslint-disable-next-line consistent-return
  findPortals = () => {
    const { field } = this;
    const portals = {};

    for (let row = 0; row < field.length; row += 1) {
      // if (row < 2) {
      //   console.log(field[row]);
      // }
      for (let col = 0; col < field[row].length; col += 1) {
        const cur = field[row][col];
        // if (cur === 'V') {
        //   console.log(`found a V at ${col},${row}. right: ${field[row][col + 1]}, down: ${field[row + 1]?.[col]}`);
        // }

        // if (row < 2) { console.log(`${col},${row} = '${field[row][col]}'`); }

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
    Object.values(this.portals).forEach(([a, b]) => {
      const nodeA = this.graph.node(a.x, a.y, '.');

      // For AA and ZZ
      if (!b) { return; }

      const nodeB = this.graph.node(b.x, b.y, '.');

      nodeA.isPortal = true;
      nodeB.isPortal = true;

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
  // const field = parseInput(input);

  // return splitQuadrants(field)
  //   .map(q => q.shortestSequence(q.hasKeys))
  //   .reduce((acc, cur) => acc + cur);
};
