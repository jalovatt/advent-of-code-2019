import IntCode from '../../common/IntCode';

class Game {
  constructor(input) {
    this.computer = new IntCode(input);

    this.field = {};
    this.score = 0;

    this.ballPos = {};
    this.paddlePos = {};
  }

  update = (input) => {
    const { output } = (this.computer.started)
      ? this.computer.resume([input])
      : this.computer.execute(null, null, [input]);

    for (let i = 0; i < output.length; i += 3) {
      const [x, y, tile] = output.slice(i, i + 3);

      if (x === -1 && y === 0) {
        this.score = parseInt(tile, 10);
        console.log(`score: ${this.score}`);
      } else {
        if (tile === 4) {
          this.ballPos = { x: parseInt(x, 10), y: parseInt(y, 10) };
          console.log('updated ball', this.ballPos);
        } else if (tile === 3) {
          this.paddlePos = { x: parseInt(x, 10), y: parseInt(y, 10) };
          console.log('updated paddle', this.paddlePos);
        }

        this.field[`${x},${y}`] = tile;
      }
    }

    this.computer.output = [];
  }

  play() {
    this.computer.initialState[0] = 2;

    console.dir(this.computer.state.slice(0, 8));

    let steps = 0;
    while (!this.computer.halted) {
      steps += 1;

      let input = 0;
      if (this.ballPos.x !== undefined && this.paddlePos.x !== undefined) {
        if (this.paddlePos.x < this.ballPos.x) {
          input = 1;
        } else if (this.paddlePos.x > this.ballPos.x) {
          input = -1;
        }
      }

      this.update(input);
    }

    console.log(`halted after ${steps} steps`);
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
