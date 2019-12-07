import loadText from '../../utilities/loadText';
import { findMaxDirectSignal, findMaxFeedbackSignal } from '.';

import IntCode from '../../common/IntCode';
// import '../../common/IntCode/spec';

const title = 'Amplification Circuit';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test('Manual', () => {
        const program = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0';
        const thrusters = new Array(5).fill(null).map(() => new IntCode(program));

        const a = thrusters[0].execute(null, null, [4, 0]).lastOutput;
        const b = thrusters[1].execute(null, null, [3, a]).lastOutput;
        const c = thrusters[2].execute(null, null, [2, b]).lastOutput;
        const d = thrusters[3].execute(null, null, [1, c]).lastOutput;
        const e = thrusters[4].execute(null, null, [0, d]).lastOutput;

        expect(e).toEqual(43210);
      });

      test.each([
        ['3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0', 43210], // 4,3,2,1,0
        ['3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0', 54321], // 0,1,2,3,4
        ['3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0', 65210],
      ])('%p => %p', (given, expected) => {
        expect(findMaxDirectSignal(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = findMaxDirectSignal(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(567045);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5', 139629729],
        ['3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10', 18216],
      ])('%p => %p', (given, expected) => {
        expect(findMaxFeedbackSignal(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = findMaxFeedbackSignal(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(39016654);
      });
    });
  });
});
