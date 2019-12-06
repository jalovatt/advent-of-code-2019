import loadText from '../../utilities/loadText';
import { countOrbits } from '.';

const title = 'Universal Orbit Map';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L', 42],
      ])('%p => %p', (given, expected) => {
        expect(countOrbits(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = countOrbits(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(251208);
      });
    });
  });

  xdescribe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [1, 2],
      ])('%p => %p', (given, expected) => {
        expect(solve(given)).toEqual(expected);
      });
    });

    // describe('Solution', () => {
    //   const solution = solve(input);

    //   test(`${solution}`, () => {
    //     expect(solution).toEqual(true);
    //   });
    // });
  });
});
