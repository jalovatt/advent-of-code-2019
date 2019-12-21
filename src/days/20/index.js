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
    this.graph = this.buildGraph();
    this.portals = this.findPortals();
    this.addPortalEdges();
  }

  buildGraph = () => {
    const graph = new Graph();
    const toVisit = [];

    {
      const { x, y } = findOrigin(this.field);
      const origin = graph.node(x, y, this.field[y][x]);
      toVisit.push(origin);
    }

    const visitedNodes = new Set();

    // eslint-disable-next-line no-constant-condition
    while (toVisit.length) {
      const current = toVisit.pop();
      visitedNodes.add(current);
      const { x, y } = graph.points.get(current);

      const choices = [
        { x, y: y - 1 },
        { x, y: y + 1 },
        { x: x - 1, y },
        { x: x + 1, y },
      ];

      choices.filter(c => (
        (this.field[c.y]?.[c.x] !== '#')
        && c.x >= 0
        && c.x <= this.field[0].length
        && c.y >= 0
        && c.y <= this.field.length
      )).forEach((c) => {
        const node = graph.node(c.x, c.y, this.field[c.y][c.x]);
        graph.connect(current, node);

        if (!visitedNodes.has(node)) { toVisit.push(node); }
      });
    }

    return graph;
  }

  getPath = (a, b) => {
    const sequences = [[a]];

    let found;
    while (!found) {
      const current = sequences.shift();
      const node = current[current.length - 1];

      if (node === b) {
        found = current;
      } else {
        const adjacents = node.edges;
        // eslint-disable-next-line no-loop-func
        adjacents.forEach((adj) => {
          if (current[current.length - 1] === adj || current.includes(adj)) {
            return;
          }

          sequences.push([...current, adj]);
        });
      }
    }

    return { ...found, length: found.length - 1 };
  }

  // eslint-disable-next-line consistent-return
  findPortals = (field) => {
    const portals = {};

    for (let row = 0; row < field.length; row += 1) {
      for (let col = 0; col < field[0].length; col += 1) {
        if (field[row][col].match(/[A-Z]/)) {
          if (field[row][col + 1]?.match(/[A-Z]/)) {
            const key = `${field[row][col]}${field[row][col + 1]}`;

            portals[key].push((field[row][col + 2] === '.')
              ? { x: col + 2, y: row }
              : { x: col - 1, y: row });
          } else if (field[row + 1]?.[col].match(/[A-Z]/)) {
            const key = `${field[row][col]}${field[row + 1][col]}`;

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
    this.portals.forEach(([a, b]) => {
      this.graph.connect(this.graph.nodes[`${a.x},${a.y}`], this.graph.nodes[`${b.x},${b.y}`]);
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

  return maze.shortestSequence();
};

export const part2 = (input) => {
  // const field = parseInput(input);

  // return splitQuadrants(field)
  //   .map(q => q.shortestSequence(q.hasKeys))
  //   .reduce((acc, cur) => acc + cur);
};
