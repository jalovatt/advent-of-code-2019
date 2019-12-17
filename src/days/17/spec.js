import loadText from '../../utilities/loadText';
import { part1, part2, sumIntersections } from '.';

const title = 'Set and Forget';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  xdescribe('Part 1', () => {
    describe('Sum Intersections', () => {
      const view = '..#..........\n..#..........\n#######...###\n#.#...#...#.#\n#############\n..#...#...#..\n..#####...^..'
        .split('\n').map(row => row.split(''));

      test('should find intersections', () => {
        expect(sumIntersections(view)).toEqual(76);
      });
    });

    // describe('Solution', () => {
    //   const solution = part1(input);

    //   test(`${solution}`, () => {
    //     expect(solution).toEqual(13580);
    //   });
    // });
  });

  describe('Part 2', () => {
    // describe('Tests', () => {
    //   test.each([
    //     [1, 2],
    //   ])('%p => %p', (given, expected) => {
    //     expect(part2(given)).toEqual(expected);
    //   });
    // });

    describe('Solution', () => {
      const solution = part2(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(true);
      });
    });
  });
});
