import loadText from '../../utilities/loadText';
import Intcode from '.';

const title = '1202 Program Alarm';

const input = loadText('input-1.txt');

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
        const computer = new Intcode(given);
        expect(computer.execute().readState()).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const computer = new Intcode(input);
      const solution = computer.execute(12, 2).readOutput();

      test(`${solution}`, () => {
        expect(solution).toEqual(3716250);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const computer = new Intcode(input);
      const solution = computer.findValuesFor(19690720);

      test(`${solution}`, () => {
        expect(solution).toEqual(6472);
      });
    });
  });
});
