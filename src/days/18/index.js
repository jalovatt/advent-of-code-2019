const parseInput = input => {
  return input.split('\n').map(row => row.split(''));
};

class Maze {
  constructor(input) {
    this.field = parseInput(input);
    this.stuff = this.findStuff();
    this.currentPos = this.stuff.entrance;
    this.keys = {};
  }

  findStuff = () => {
    const stuff = {
      keys: {},
      doors: {},
      entrance: null,
    };

    for (let row = 0; row < this.field.length; row += 1) {
      for (let col = 0; col < this.field[0].length; col += 1) {
        const val = this.field[row][col];
        if (val.match(/[A-Z]/)) {
          stuff.doors[val] = { x: col, y: row };
        } else if (val.match(/[a-z]/)) {
          stuff.keys[val] = { x: col, y: row };
        } else if (val.match(/@/)) {
          stuff.entrance = { x: col, y: row };
        }
      }
    }

    return stuff;
  }

  pathLength = (from, to) => {
    console.log(from, to);
    const current = { ...from, distance: 0 };
    const visited = { [`${from.x},${from.y}`]: 0 };

    while (!(current.x === to.x && current.y === to.y)) {
      const choices = [
        { x: current.x, y: current.y - 1 },
        { x: current.x, y: current.y + 1 },
        { x: current.x - 1, y: current.y },
        { x: current.x + 1, y: current.y },
      ];

      const legal = choices.filter(c => (this.field[c.y]?.[c.x] !== '#') && c.x >= 0 && c.x <= this.field[0].length && c.y >= 0 && c.y <= this.field.length);

      const unexplored = legal.filter(choice => visited[`${choice.x},${choice.y}`] === undefined);

      let next;
      if (unexplored.length) {
        next = unexplored[Math.floor(Math.random() * unexplored.length)];
        current.x = next.x;
        current.y = next.y;

        current.distance += 1;
        visited[`${current.x},${current.y}`] = current.distance;
      } else {
        next = choices.filter(c => this.field[c.y]?.[c.x] !== '#')
          .reduce((acc, c) => ((visited[`${c.y},${c.x}`] < current.distance)
            ? c
            : acc));

        current.x = next.x;
        current.y = next.y;

        current.distance = visited[`${current.x},${current.y}`];
      }
      console.log(current);
    }

    console.log(visited);
    console.log(current);
    return current.distance;
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

  console.log(maze.pathLength(maze.stuff.entrance, maze.stuff.keys.b));

  return 0;
};
