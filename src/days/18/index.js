/* eslint-disable max-classes-per-file */
const parseInput = input => input.split('\n').map(row => row.split(''));

// eslint-disable-next-line consistent-return
const findOrigin = (field) => {
  for (let row = 0; row < field.length; row += 1) {
    for (let col = 0; col < field[0].length; col += 1) {
      if (field[row][col] === '@') { return { x: col, y: row }; }
    }
  }
};

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
    this.objects = {};
  }

  node = (x, y, value) => {
    const key = `${x},${y}`;
    if (this.nodes.has(key)) { return this.nodes.get(key); }

    const node = new Node(key, value);
    this.nodes.set(key, node);
    this.points.set(node, { x, y });
    if (value !== '#' && value !== '.') { this.objects[value] = node; }

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

  keyFromDoor = door => String.fromCharCode(door.charCodeAt(0) + 32);

  getPath = (a, b) => {
    const sequences = [{ nodes: [a], doors: [], keys: [] }];

    let found;
    while (!found) {
      const current = sequences.shift();
      const node = current.nodes[current.nodes.length - 1];

      if (node === b) {
        found = current;
      } else {
        const adjacents = node.edges;
        // eslint-disable-next-line no-loop-func
        adjacents.forEach((adj) => {
          if (current.nodes[current.nodes.length - 1] === adj || current.nodes.includes(adj)) {
            return;
          }

          const doors = (node.value.match(/[A-Z]/)) ? [...current.doors, node.value] : current.doors;
          const keys = (node.value.match(/[a-z]/)) ? [...current.keys, node.value] : current.keys;

          sequences.push({
            nodes: [...current.nodes, adj],
            doors,
            keys,
          });
        });
      }
    }

    return { ...found, length: found.nodes.length - 1 };
  }

  getAllPaths = () => {
    const pathObjects = Object.entries(this.graph.objects)
      .filter(o => o[0].charCodeAt(0) > 96 || o[0].charCodeAt(0) === 64);

    const allPaths = {};
    for (let a = 0; a < (pathObjects.length - 1); a += 1) {
      for (let b = a + 1; b < pathObjects.length; b += 1) {
        const path = this.getPath(pathObjects[a][1], pathObjects[b][1]);

        allPaths[`${pathObjects[a][0]}${pathObjects[b][0]}`] = path;
        allPaths[`${pathObjects[b][0]}${pathObjects[a][0]}`] = path;
      }
    }

    return allPaths;
  }

  pathsFrom = (paths, current, visited) => Object.entries(paths).filter(([k, { doors }]) => (
    k[0] === current
    && !visited[k[1]]
    && doors.every(d => visited[this.keyFromDoor(d)])
  )).map(p => p[0]);

  cachedSequences = {}

  findShortestSequence = (paths, current = '@', visited = { '@': true }, currentLength = 0, shortest = Number.MAX_SAFE_INTEGER) => {
    const pathKey = `${current}${Object.keys(visited).sort().join('')}`;

    const cached = this.cachedSequences[pathKey];
    if (cached && currentLength >= cached.currentLength) { return shortest; }

    const nextPaths = cached?.nextPaths || this.pathsFrom(paths, current, visited);
    this.cachedSequences[pathKey] = { nextPaths, currentLength };

    if (!nextPaths.length) { return currentLength; }

    return nextPaths.reduce((acc, path) => {
      const { keys, length } = paths[path];
      if ((currentLength + length) >= acc) { return acc; }

      const subsequence = this.findShortestSequence(
        paths,
        path[1],
        { ...visited, ...keys, [current]: true, [path[1]]: true },
        currentLength + length,
        acc,
      );

      return (subsequence < acc) ? subsequence : acc;
    }, shortest);
  }

  shortestSequence = (withKeys) => {
    const paths = this.getAllPaths();

    return this.findShortestSequence(paths, undefined, (withKeys ? { ...withKeys, '@': true } : undefined));
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

// TODO: Generate the quadrants/@s/#s programmatically from the original input
const splitQuadrants = (field) => {
  const lowerMax = Math.ceil(field.length / 2);
  const upperMin = Math.floor(field.length / 2);
  const quadrants = [
    field.slice(0, lowerMax).map(row => row.slice(0, lowerMax)),
    field.slice(0, lowerMax).map(row => row.slice(upperMin)),
    field.slice(upperMin).map(row => row.slice(upperMin)),
    field.slice(upperMin).map(row => row.slice(0, lowerMax)),
  ].map(quadrant => new Maze(quadrant));

  quadrants.forEach((quadrant, i) => {
    // eslint-disable-next-line no-param-reassign
    quadrant.hasKeys = quadrants.filter((_, j) => j !== i).reduce((acc, cur) => {
      Object.keys(cur.graph.objects).forEach((obj) => {
        if (obj.match(/[a-z]/)) { acc[obj] = true; }
      });
      return acc;
    }, {});
  });

  return quadrants;
};

export const part1 = (input) => {
  const field = parseInput(input);
  const maze = new Maze(field);

  return maze.shortestSequence();
};

export const part2 = (input) => {
  const field = parseInput(input);

  return splitQuadrants(field)
    .map(q => q.shortestSequence(q.hasKeys))
    .reduce((acc, cur) => acc + cur);
};
