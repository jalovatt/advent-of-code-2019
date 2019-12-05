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

    describe('Solution', () => {
      const computer = new IntCode(input);
      const solution = computer.execute(null, null, 1).lastOutput;

      test(`${solution}`, () => {
        expect(solution).toEqual(7259358);
      });
    });
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

    xdescribe('Tests (opcode 8)', () => {
      test.each([
        [{ program: '3,9,8,9,10,9,4,9,99,-1,8', input: 8 }, 1],
        [{ program: '3,9,8,9,10,9,4,9,99,-1,8', input: 5 }, 0],
      ])('%p => %p', (given, expected) => {
        const computer = new IntCode(given.program);
        expect(computer.execute(null, null, given.input).readState()).toEqual(expected);
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
