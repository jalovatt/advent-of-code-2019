import loadText from '../../utilities/loadText';
import { part1, part2 } from '.';

const title = 'Tractor Beam';
const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Solution', () => {
      const solution = part1(input, 50);

      test(`${solution}`, () => {
        expect(solution).toEqual(171);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const solution = part2(input, 100);

      test(`${solution}`, () => {
        expect(solution).toEqual([974, 1242, 9741242]);
      });
    });
  });
});
