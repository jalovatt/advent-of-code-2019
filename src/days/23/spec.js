import loadText from '../../utilities/loadText';
import { part1, part2 } from '.';

const title = 'Category Six';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Solution', () => {
      const solution = part1(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(20665);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const solution = part2(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(13358);
      });
    });
  });
});
