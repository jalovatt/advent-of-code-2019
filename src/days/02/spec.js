import loadText from '../../utilities/loadText';
import { run, solve } from '.';

const title = '1202 Program Alarm';

const input = loadText('input-1.txt').split(',');

const tests = [
  ['1,9,10,3,2,3,11,0,99,30,40,50', '3500,9,10,70,2,3,11,0,99,30,40,50'],
  ['1,0,0,0,99', '2,0,0,0,99'],
  ['2,3,0,3,99', '2,3,0,6,99'],
  ['2,4,4,5,99,0', '2,4,4,5,99,9801'],
  ['1,1,1,4,99,5,6,0,99', '30,1,1,4,2,5,6,0,99'],
];

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each(tests)('%p => %p', (given, expected) => {
        expect(run(given.split(','))).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = solve(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(3716250);
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
