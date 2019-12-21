import loadText from '../../utilities/loadText';
import { part1 } from '.';

const title = 'Donut Maze';

const input = loadText('input.txt', false);

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    xdescribe('Tests', () => {
      test.each([
        ['         A         \n         A         \n  #######.#########\n  #######.........#\n  #######.#######.#\n  #######.#######.#\n  #######.#######.#\n  #####  B    ###.#\nBC...##  C    ###.#\n  ##.##       ###.#\n  ##...DE  F  ###.#\n  #####    G  ###.#\n  #########.#####.#\nDE..#######...###.#\n  #.#########.###.#\nFG..#########.....#\n  ###########.#####\n             Z     \n             Z     ', 23],
        ['                   A               \n                   A               \n  #################.#############  \n  #.#...#...................#.#.#  \n  #.#.#.###.###.###.#########.#.#  \n  #.#.#.......#...#.....#.#.#...#  \n  #.#########.###.#####.#.#.###.#  \n  #.............#.#.....#.......#  \n  ###.###########.###.#####.#.#.#  \n  #.....#        A   C    #.#.#.#  \n  #######        S   P    #####.#  \n  #.#...#                 #......VT\n  #.#.#.#                 #.#####  \n  #...#.#               YN....#.#  \n  #.###.#                 #####.#  \nDI....#.#                 #.....#  \n  #####.#                 #.###.#  \nZZ......#               QG....#..AS\n  ###.###                 #######  \nJO..#.#.#                 #.....#  \n  #.#.#.#                 ###.#.#  \n  #...#..DI             BU....#..LF\n  #####.#                 #.#####  \nYN......#               VT..#....QG\n  #.###.#                 #.###.#  \n  #.#...#                 #.....#  \n  ###.###    J L     J    #.#.###  \n  #.....#    O F     P    #.#...#  \n  #.###.#####.#.#####.#####.###.#  \n  #...#.#.#...#.....#.....#.#...#  \n  #.#####.###.###.#.#.#########.#  \n  #...#.#.....#...#.#.#.#.....#.#  \n  #.###.#####.###.###.#.#.#######  \n  #.#.........#...#.............#  \n  #########.###.###.#############  \n           B   J   C               \n           U   P   P              ', 58],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = part1(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(true);
      });
    });
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
