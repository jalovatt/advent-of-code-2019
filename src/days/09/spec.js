import loadText from '../../utilities/loadText';

import IntCode from '../../common/IntCode';

const title = 'Sensor Boost';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Solution', () => {
      const computer = new IntCode(input);
      const solution = computer.execute(null, null, [1]).output.pop();

      test(`${solution}`, () => {
        expect(solution).toEqual(4080871669);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const computer = new IntCode(input);
      const solution = computer.execute(null, null, [2]).output.pop();

      test(`${solution}`, () => {
        expect(solution).toEqual(75202);
      });
    });
  });
});
