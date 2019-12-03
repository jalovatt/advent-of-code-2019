import loadText from '../../utilities/loadText';
import { fuelForModule, fuelForModuleCumulative, totalFuelStatic, totalFuelCumulative } from '.';

const title = 'The Tyranny of the Rocket Equation';

const input = loadText('input.txt').split('\n');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [12, 2],
        [14, 2],
        [1969, 654],
        [100756, 33583],
      ])('%p => %p', (given, expected) => {
        expect(fuelForModule(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = totalFuelStatic(input);
      test(`${solution}`, () => {
        expect(solution).toEqual(3415076);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [14, 2],
        [1969, 966],
        [100756, 50346],
      ])('%p => %p', (given, expected) => {
        expect(fuelForModuleCumulative(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = totalFuelCumulative(input);
      test(`${solution}`, () => {
        expect(solution).toEqual(5119745);
      });
    });
  });
});
