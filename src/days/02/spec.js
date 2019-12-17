import loadText from '../../utilities/loadText';
import IntCode from '../../common/IntCode';

import findValuesFor from '.';

const title = '1202 Program Alarm';

const input = loadText('input.txt');

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
        const computer = new IntCode(given);
        expect(computer.execute().readState()).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const computer = new IntCode(input);
      const solution = computer.execute(12, 2).state[0];

      test(`${solution}`, () => {
        expect(solution).toEqual(3716250);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const solution = findValuesFor(input, 19690720);

      test(`${solution}`, () => {
        expect(solution).toEqual(6472);
      });
    });
  });
});
