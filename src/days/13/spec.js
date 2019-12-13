import loadText from '../../utilities/loadText';
import { play, countBlockTiles } from '.';

const title = 'Care Package';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Solution', () => {
      const solution = countBlockTiles(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(326);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const game = play(input);
      const solution = game.score;

      test(`${solution}`, () => {
        expect(solution).toEqual(15988);
      });
    });
  });
});
