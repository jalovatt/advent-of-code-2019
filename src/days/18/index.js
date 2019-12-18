/* eslint-disable max-classes-per-file */
const parseInput = input => input.split('\n').map(row => row.split(''));

// Heap's algorithm
// https://stackoverflow.com/a/37580979
const permutations = (arr) => {
  const result = [arr.slice()];
  const c = new Array(arr.length).fill(0);
  let i = 1;
  let k;
  let swap;

  while (i < arr.length) {
    if (c[i] < i) {
      k = i % 2 && c[i];

      swap = arr[i];
      // eslint-disable-next-line no-param-reassign
      arr[i] = arr[k];
      // eslint-disable-next-line no-param-reassign
      arr[k] = swap;

      result.push(arr.slice());

      c[i] += 1;
      i = 1;
    } else {
      c[i] = 0;
      i += 1;
    }
  }
  return result;
};

class Node {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.children = [];
    this.parent = null;
  }

  getAncestors = () => {
    const ancestors = new Map();
    ancestors.set(this, 0);

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
    if (!this.parent) { return [this, 0]; }

    let current = this;
    let distance = 0;

    while (true) {
      if (!current.parent || otherAncestors.has(current)) { return [current, distance]; }

      distance += 1;
      current = current.parent;
    }
  }

  findDistanceTo = (other) => {
    const ancestorsMap = this.getAncestors();
    const [lca, otherDistanceToLca] = other.findLca(ancestorsMap);

    return ancestorsMap.get(lca) + otherDistanceToLca;
  }
}

class Tree {
  constructor() {
    this.nodes = [];
    this.objects = {};
  }

  add = (key, value) => {
    const node = new Node(key, value);
    this.nodes.push(node);
    if (value !== '#' && value !== '.') { this.objects[value] = node; }

    return node;
  }

  connect = (parent, child) => {
    parent.children.push(child);
    // eslint-disable-next-line no-param-reassign
    child.parent = parent;
  }
}

class Maze {
  constructor(input) {
    this.field = parseInput(input);
    this.tree = this.buildTree();
  }

  // eslint-disable-next-line consistent-return
  findOrigin = () => {
    for (let row = 0; row < this.field.length; row += 1) {
      for (let col = 0; col < this.field[0].length; col += 1) {
        if (this.field[row][col] === '@') { return { x: col, y: row }; }
      }
    }
  }

  buildTree = () => {
    const tree = new Tree();
    const { x: ox, y: oy } = this.findOrigin();
    let current = { x: ox, y: oy, node: tree.add(`${ox},${oy}`, '@') };
    const visited = { [`${current.x},${current.y}`]: current.node };

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const choices = [
        { x: current.x, y: current.y - 1 },
        { x: current.x, y: current.y + 1 },
        { x: current.x - 1, y: current.y },
        { x: current.x + 1, y: current.y },
      ];

      const legal = choices.filter(c => (
        (this.field[c.y]?.[c.x] !== '#')
        && c.x >= 0
        && c.x <= this.field[0].length
        && c.y >= 0
        && c.y <= this.field.length
      ));

      const unexplored = legal.filter(choice => !visited[`${choice.x},${choice.y}`]);

      if (unexplored.length) {
        const { x, y } = unexplored[Math.floor(Math.random() * unexplored.length)];

        const value = this.field[y][x];
        const node = tree.add(`${x},${y}`, value);

        tree.connect(current.node, node);
        visited[`${x},${y}`] = node;

        current = { x, y, node };
      } else {
        // We're done!
        if (!current.node.parent) { break; }

        const [key, node] = Object.entries(visited)
          // eslint-disable-next-line no-loop-func
          .find(([, n]) => n === current.node.parent);
        const [, x, y] = key.match(/(\d+),(\d+)/).map(n => parseInt(n, 10));
        current = { x, y, node };
      }
    }

    return tree;
  }

  walkSequence = (seq) => {
    seq.unshift('@');

    let steps = 0;
    const keysFound = {};

    for (let i = 0; i <= seq.length - 2; i += 1) {
      const a = this.tree.objects[seq[i]];
      const b = this.tree.objects[seq[i + 1]];

      const [lca] = a.findLca(b.getAncestors());

      let didA = false;

      // Get the path
      const pathA = [];
      const pathB = [];
      let cur = a;
      while (cur !== lca) {
        pathA.push(cur);
        cur = cur.parent;
      }
      pathA.push(lca);

      cur = b;
      while (cur !== lca) {
        pathB.unshift(cur);
        cur = cur.parent;
      }

      const path = pathA.concat(pathB);

      for (let step = 1; step < path.length; step += 1) {
        steps += 1;
        const val = path[step - 1].value;

        if (val) {
          const isDoor = val.match(/([A-Z])/);

          if (isDoor) {
            const key = String.fromCharCode(val.charCodeAt(0) + 32);
            if (!keysFound[key]) {
              return 0;
            }
          }

          if (val.match(/[a-z]/)) {
            keysFound[val] = true;
          }
        }

        if (cur.parent === lca && !didA) {
          didA = true;
          cur = b;
        }
      }
    }

    return steps;
  }

  shortestSequence = () => {
    const objects = Object.keys(this.tree.objects).filter(o => o !== '@');
    // const allSequences = permutations(objects);

    // return allSequences.reduce((acc, cur) => {
    //   const steps = this.walkSequence(cur);

    //   return (steps && (!acc.steps || steps < acc.steps))
    //     ? { sequence: cur, steps }
    //     : acc;
    // }, { sequence: null, steps: 0 });
  }

  print = () => {
    const out = this.field.reduce((acc, row) => {
      acc.push(row.join(''));
      return acc;
    }, []).join('\n');

    console.log(out);
  }
}

export const part1 = (input) => {
  const maze = new Maze(input);
  maze.print();

  const shortest = maze.shortestSequence();
  console.log('Shortest sequence:', shortest.sequence, `(${shortest.steps} steps)`);

  return shortest.steps;
};
