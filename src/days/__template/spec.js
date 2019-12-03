import loadText from '../../utilities/loadText';
import { helper, solver } from '.';

const title = '';

const input = loadText('input-1.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [1, 2],
      ])('%p => %p', (given, expected) => {
        expect(helper(given)).toEqual(expected);
      });
    });

    xdescribe('Solution', () => {
      const solution = solver(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(true);
      });
    });
  });

  xdescribe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [1, 2],
      ])('%p => %p', (given, expected) => {
        expect(helper(given)).toEqual(expected);
      });
    });

    xdescribe('Solution', () => {
      const solution = solver(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(true);
      });
    });
  });
});
