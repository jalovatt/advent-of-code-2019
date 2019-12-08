import loadText from '../../utilities/loadText';
import SIF from './shorter.index';

const title = 'Space Image Format';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/[^/]*spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Solution', () => {
      const image = new SIF(input, 25, 6);
      const solution = image.checkSum();

      test(`${solution}`, () => {
        expect(solution).toEqual(2016);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      const image = new SIF('0222112222120000', 2, 2);

      test('Printing', () => {
        expect(image.print()).toEqual('⬛⬜\n⬜⬛');
      });
    });

    describe('Solution', () => {
      const image = new SIF(input, 25, 6);
      const solution = image.print();

      const expected = `\
⬜⬛⬛⬜⬛⬜⬜⬜⬜⬛⬛⬜⬜⬛⬛⬜⬜⬜⬜⬛⬜⬛⬛⬜⬛
⬜⬛⬛⬜⬛⬛⬛⬛⬜⬛⬜⬛⬛⬜⬛⬛⬛⬛⬜⬛⬜⬛⬛⬜⬛
⬜⬜⬜⬜⬛⬛⬛⬜⬛⬛⬜⬛⬛⬛⬛⬛⬛⬜⬛⬛⬜⬛⬛⬜⬛
⬜⬛⬛⬜⬛⬛⬜⬛⬛⬛⬜⬛⬛⬛⬛⬛⬜⬛⬛⬛⬜⬛⬛⬜⬛
⬜⬛⬛⬜⬛⬜⬛⬛⬛⬛⬜⬛⬛⬜⬛⬜⬛⬛⬛⬛⬜⬛⬛⬜⬛
⬜⬛⬛⬜⬛⬜⬜⬜⬜⬛⬛⬜⬜⬛⬛⬜⬜⬜⬜⬛⬛⬜⬜⬛⬛`;

      test(`\n${solution}`, () => {
        expect(solution).toEqual(expected);
      });
    });
  });
});
