import { part1, part2, Field, RecursiveField } from '.';

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

  describe('Part 2', () => {
    const initial = '....##..#.#..##..#..#....';

    describe('Adjacent cells with recursion', () => {
      const field = new RecursiveField(initial);

      test.each([
        [18, 4],
        [6, 4],
        [3, 4],
        [4, 4],
        [13, 8],
      ])('%p => %p', (given, expected) => {
        expect(field.adjacentCells(given, 0).length).toEqual(expected);
      });
    });

    describe('Counting', () => {
      test.each([
        [10, 99],
      ])('%p => %p', (given, expected) => {
        expect(part2(initial, given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = part2(input, 200);

      test(`${solution}`, () => {
        expect(solution).toEqual(2025);
      });
    });
  });
});
