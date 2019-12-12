import loadText from '../../utilities/loadText';
import { simulateMoons } from '.';

const title = 'The N-Body Problem';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Example 1', () => {
      const moons = '<x=-1, y=0, z=2>\n<x=2, y=-10, z=-7>\n<x=4, y=-8, z=8>\n<x=3, y=5, z=-1>';
      test.each([
        [0, 'pos=<x=-1, y=0, z=2>, vel=<x=0, y=0, z=0>\npos=<x=2, y=-10, z=-7>, vel=<x=0, y=0, z=0>\npos=<x=4, y=-8, z=8>, vel=<x=0, y=0, z=0>\npos=<x=3, y=5, z=-1>, vel=<x=0, y=0, z=0>'],
        [1, 'pos=<x=2, y=-1, z=1>, vel=<x=3, y=-1, z=-1>\npos=<x=3, y=-7, z=-4>, vel=<x=1, y=3, z=3>\npos=<x=1, y=-7, z=5>, vel=<x=-3, y=1, z=-3>\npos=<x=2, y=2, z=0>, vel=<x=-1, y=-3, z=1>'],
        [2, 'pos=<x=5, y=-3, z=-1>, vel=<x=3, y=-2, z=-2>\npos=<x=1, y=-2, z=2>, vel=<x=-2, y=5, z=6>\npos=<x=1, y=-4, z=-1>, vel=<x=0, y=3, z=-6>\npos=<x=1, y=-4, z=2>, vel=<x=-1, y=-6, z=2>'],
        [5, 'pos=<x=-1, y=-9, z=2>, vel=<x=-3, y=-1, z=2>\npos=<x=4, y=1, z=5>, vel=<x=2, y=0, z=-2>\npos=<x=2, y=2, z=-4>, vel=<x=0, y=-1, z=2>\npos=<x=3, y=-7, z=-1>, vel=<x=1, y=2, z=-2>'],
        [8, 'pos=<x=5, y=2, z=-2>, vel=<x=3, y=4, z=-3>\npos=<x=2, y=-7, z=-5>, vel=<x=1, y=-3, z=-1>\npos=<x=0, y=-9, z=6>, vel=<x=-3, y=-2, z=1>\npos=<x=1, y=1, z=3>, vel=<x=-1, y=1, z=3>'],
        [10, 'pos=<x=2, y=1, z=-3>, vel=<x=-3, y=-2, z=1>\npos=<x=1, y=-8, z=0>, vel=<x=-1, y=1, z=3>\npos=<x=3, y=-6, z=1>, vel=<x=3, y=2, z=-3>\npos=<x=2, y=0, z=4>, vel=<x=1, y=-1, z=-1>'],
      ])('%p => %p', (given, expected) => {
        expect(simulateMoons(moons, given).print()).toEqual(expected);
      });

      test('Total Energy @ 10 steps', () => {
        expect(simulateMoons(moons, 10).totalEnergy()).toEqual(179);
      });
    });

    describe('Solution', () => {
      const solution = simulateMoons(input, 1000).totalEnergy();

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
