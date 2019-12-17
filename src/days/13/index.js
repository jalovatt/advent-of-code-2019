import IntCode from '../../common/IntCode';

class Game {
  constructor(input) {
    this.computer = new IntCode(input);
    this.computer.maxStoredOutput = 10000;

    this.field = {};
    this.score = 0;

    this.ball = null;
    this.paddle = null;
  }

  update = (input) => {
    const { output } = (this.computer.started)
      ? this.computer.resume([input])
      : this.computer.execute(null, null, [input]);

    for (let i = 0; i < output.length; i += 3) {
      const [x, y, tile] = output.slice(i, i + 3);

      if (x === -1 && y === 0) {
        this.score = parseInt(tile, 10);
      } else {
        if (tile === 4) {
          this.ball = parseInt(x, 10);
        } else if (tile === 3) {
          this.paddle = parseInt(x, 10);
        }

        this.field[`${x},${y}`] = tile;
      }
    }

    this.computer.output = [];
  }

  play() {
    this.computer.initialState[0] = 2;

    while (!this.computer.halted) {
      const input = (this.ball !== null && this.paddle !== null)
        ? Math.sign(this.ball - this.paddle)
        : 0;

      this.update(input);
    }
  }
}

export const countBlockTiles = (input) => {
  const game = new Game(input);
  game.update();
  const { field } = game;

  return Object.values(field).filter(v => v === 2).length;
};

export const play = (input) => {
  const game = new Game(input);
  game.play();

  return game;
};
