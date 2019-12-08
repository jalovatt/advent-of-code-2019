import loadText from '../../utilities/loadText';
import SIF from '.';

const title = 'Space Image Format';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test('Layers', () => {
        const image = new SIF('123456789012', 3, 2);
        expect(image.layers.length).toEqual(2);
        expect(image.layers[1]).toEqual('789012');
      });
    });

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

      test('Layers', () => {
        expect(image.layers.length).toEqual(4);
        expect(image.layers[2]).toEqual('2212');
      });

      test('Decoding', () => {
        expect(image.decode()).toEqual(['0', '1', '1', '0']);
      });

      test('Printing', () => {
        // expect(image.print()).toEqual('01\n10');
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
