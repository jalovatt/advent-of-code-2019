import loadText from '../../utilities/loadText';
import IntCode from '.';

const title = 'Sunny with a Chance of Asteroids';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests (opcode 1 + 2)', () => {
      const tests = [
        ['1,9,10,3,2,3,11,0,99,30,40,50', '3500,9,10,70,2,3,11,0,99,30,40,50'],
        ['1,0,0,0,99', '2,0,0,0,99'],
        ['2,3,0,3,99', '2,3,0,6,99'],
        ['2,4,4,5,99,0', '2,4,4,5,99,9801'],
        ['1,1,1,4,99,5,6,0,99', '30,1,1,4,2,5,6,0,99'],
      ];

      test.each(tests)('%p => %p', (given, expected) => {
        const computer = new IntCode(given);
        expect(computer.execute().readState()).toEqual(expected);
      });
    });

    describe('Tests (opcode 3 + 4)', () => {
      const program = '3,0,4,0,99';
      const inputs = [[4, 4], [1, 1], [3, 3], [8, 8]];

      test.each(inputs)('%p should return %p', (given, expected) => {
        const computer = new IntCode(program);
        expect(computer.execute(null, null, given).lastOutput).toEqual(expected);
      });
    });

    describe('Tests (opcode 4)', () => {
      const program = '3,0,4,0,99';
      const inputs = [[4, 4], [1, 1], [3, 3], [8, 8]];

      test.each(inputs)('%p should return %p', (given, expected) => {
        const computer = new IntCode(program);
        expect(computer.execute(null, null, given).lastOutput).toEqual(expected);
      });
    });

    describe('Tests (mode switching)', () => {
      const tests = [['1002,4,3,4,33', '1002,4,3,4,99']];

      test.each(tests)('%p => %p', (given, expected) => {
        const computer = new IntCode(given);
        expect(computer.execute().readState()).toEqual(expected);
      });
    });

    // describe('Solution', () => {
    //   const computer = new IntCode(input);
    //   const solution = computer.execute(null, null, 1).lastOutput;

    //   test(`${solution}`, () => {
    //     expect(solution).toEqual(7259358);
    //   });
    // });
  });

  describe('Part 2', () => {
    describe('Tests (opcodes 5 + 6)', () => {
      test.each([
        [{ program: '3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9', input: 0 }, 0],
        [{ program: '3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9', input: 5 }, 1],
        [{ program: '3,3,1105,-1,9,1101,0,0,12,4,12,99,1', input: 0 }, 0],
        [{ program: '3,3,1105,-1,9,1101,0,0,12,4,12,99,1', input: 5 }, 1],
      ])('%p => %p', (given, expected) => {
        const computer = new IntCode(given.program);
        expect(computer.execute(null, null, given.input).lastOutput).toEqual(expected);
      });
    });

    describe('Tests (opcodes 7 + 8)', () => {
      test.each([
        [{ program: '3,9,8,9,10,9,4,9,99,-1,8', input: 8 }, 1],
        [{ program: '3,9,8,9,10,9,4,9,99,-1,8', input: 5 }, 0],
        [{ program: '3,9,7,9,10,9,4,9,99,-1,8', input: 5 }, 1],
        [{ program: '3,9,7,9,10,9,4,9,99,-1,8', input: 9 }, 0],
        [{ program: '3,3,1108,-1,8,3,4,3,99', input: 8 }, 1],
        [{ program: '3,3,1108,-1,8,3,4,3,99', input: 5 }, 0],
        [{ program: '3,3,1107,-1,8,3,4,3,99', input: 5 }, 1],
        [{ program: '3,3,1107,-1,8,3,4,3,99', input: 9 }, 0],
      ])('%p => %p', (given, expected) => {
        const computer = new IntCode(given.program);
        const output = computer.execute(null, null, given.input).lastOutput;

        expect(output).toEqual(expected);
      });

      const larger = '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99'
      describe('larger => 999', () => {
        test.each([1, 3, 5, 7])('%p => 999', (given) => {
          const computer = new IntCode(larger);
          const output = computer.execute(null, null, given).lastOutput;

          expect(output).toEqual(999);
        });
      });

      describe('larger => 1000', () => {
        test.each([8])('%p => 1000', (given) => {
          const computer = new IntCode(larger);
          const output = computer.execute(null, null, given).lastOutput;

          expect(output).toEqual(1000);
        });
      });

      describe('larger => 1001', () => {
        test.each([9, 15, 20, 51])('%p => 1001', (given) => {
          const computer = new IntCode(larger);
          const output = computer.execute(null, null, given).lastOutput;

          expect(output).toEqual(1001);
        });
      });
    });

    describe('Solution', () => {
      const computer = new IntCode(input);
      const solution = computer.execute(null, null, 5).lastOutput;

      test(`${solution}`, () => {
        expect(solution).toEqual(11826654);
      });
    });
  });
});
