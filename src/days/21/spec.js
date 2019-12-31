import loadText from '../../utilities/loadText';
import { part1, part2 } from '.';

const title = 'Springdroid Adventure';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Solution', () => {
      const solution = part1(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(19348840);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const solution = part2(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(1141857182);
      });
    });
  });
});
