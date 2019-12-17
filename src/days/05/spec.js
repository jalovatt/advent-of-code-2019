import loadText from '../../utilities/loadText';
import IntCode from '../../common/IntCode';

// import '../../common/IntCode/spec';

const title = 'Sunny with a Chance of Asteroids';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Solution', () => {
      const computer = new IntCode(input);
      const solution = computer.execute(null, null, [1]).output.pop();

      test(`${solution}`, () => {
        expect(solution).toEqual(7259358);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const computer = new IntCode(input);
      const solution = computer.execute(null, null, [5]).output.pop();

      test(`${solution}`, () => {
        expect(solution).toEqual(11826654);
      });
    });
  });
});
