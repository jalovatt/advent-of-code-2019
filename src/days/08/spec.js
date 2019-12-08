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
        expect(image.layers[1]).toEqual(['7', '8', '9', '0', '1', '2']);
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
        expect(image.layers[2]).toEqual(['2', '2', '1', '2']);
      });

      test('Decoding', () => {
        expect(image.decode()).toEqual('0110');
      });

      test('Printing', () => {
        // expect(image.print()).toEqual('01\n10');
        expect(image.print()).toEqual('\n⬛⬜\n⬜⬛');
      });
    });

    describe('Solution', () => {
      const image = new SIF(input, 25, 6);
      const solution = image.print();

      const expected = `
⬜⬛⬛⬜⬛⬜⬜⬜⬜⬛⬛⬜⬜⬛⬛⬜⬜⬜⬜⬛⬜⬛⬛⬜⬛
⬜⬛⬛⬜⬛⬛⬛⬛⬜⬛⬜⬛⬛⬜⬛⬛⬛⬛⬜⬛⬜⬛⬛⬜⬛
⬜⬜⬜⬜⬛⬛⬛⬜⬛⬛⬜⬛⬛⬛⬛⬛⬛⬜⬛⬛⬜⬛⬛⬜⬛
⬜⬛⬛⬜⬛⬛⬜⬛⬛⬛⬜⬛⬛⬛⬛⬛⬜⬛⬛⬛⬜⬛⬛⬜⬛
⬜⬛⬛⬜⬛⬜⬛⬛⬛⬛⬜⬛⬛⬜⬛⬜⬛⬛⬛⬛⬜⬛⬛⬜⬛
⬜⬛⬛⬜⬛⬜⬜⬜⬜⬛⬛⬜⬜⬛⬛⬜⬜⬜⬜⬛⬛⬜⬜⬛⬛`;

      test(`${solution}`, () => {
        expect(solution).toEqual(expected);
      });
    });
  });
});
