import { part1, Field } from '.';

const title = 'Planet of Discord';

const input = '##.#.#..#..........##.###';

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Simulation', () => {
      const initial = '....##..#.#..##..#..#....';
      test.each([
        [1, '#..#.####.###.###.##.##..'],
        [4, '####.....###..#.....##...'],
      ])('%p => %p', (given, expected) => {
        const field = new Field(initial);
        field.step(given);
        expect(field.print()).toEqual(expected);
      });
    });

    describe('Biodiversity', () => {
      const initial = '....##..#.#..##..#..#....';
      const field = new Field(initial);
      const steps = field.simulate();

      test('should repeat the given pattern', () => {
        // console.log(`${steps} steps`);
        expect(field.print()).toEqual('...............#.....#...');
        expect(steps).toEqual(86);
      });

      test('should calculate the biodiversity', () => {
        expect(field.biodiversity()).toEqual(2129920);
      });
    });

    describe('Solution', () => {
      const solution = part1(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(32506911);
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
