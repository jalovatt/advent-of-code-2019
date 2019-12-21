import { part1, part2 } from '.';

const title = '';

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [9, 6],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = part1(50);

      test(`${solution}`, () => {
        expect(solution).toEqual(171);
      });
    });
  });

  describe('Part 2', () => {
    // describe('Tests', () => {
    //   test.each([
    //     [1, 2],
    //   ])('%p => %p', (given, expected) => {
    //     expect(solve(given)).toEqual(expected);
    //   });
    // });

    describe('Solution', () => {
      const solution = part2(20);

      test(`${solution}`, () => {
        expect(solution).toEqual(true);
      });
    });
  });
});
