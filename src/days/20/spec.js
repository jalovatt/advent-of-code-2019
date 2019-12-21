import loadText from '../../utilities/loadText';
import { part1 } from '.';

const title = '';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['         A         \n         A         \n  #######.#########\n  #######.........#\n  #######.#######.#\n  #######.#######.#\n  #######.#######.#\n  #####  B    ###.#\nBC...##  C    ###.#\n  ##.##       ###.#\n  ##...DE  F  ###.#\n  #####    G  ###.#\n  #########.#####.#\nDE..#######...###.#\n  #.#########.###.#\nFG..#########.....#\n  ###########.#####\n             Z     \n             Z     ', 23],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    // describe('Solution', () => {
    //   const solution = solve(input);

    //   test(`${solution}`, () => {
    //     expect(solution).toEqual(true);
    //   });
    // });
  });

  xdescribe('Part 2', () => {
  //   describe('Tests', () => {
  //     test.each([
  //       [1, 2],
  //     ])('%p => %p', (given, expected) => {
  //       expect(solve(given)).toEqual(expected);
  //     });
  //   });

    // describe('Solution', () => {
    //   const solution = solve(input);

    //   test(`${solution}`, () => {
    //     expect(solution).toEqual(true);
    //   });
    // });
  });
});
