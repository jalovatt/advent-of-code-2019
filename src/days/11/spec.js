import loadText from '../../utilities/loadText';
import Robot from '.';

const title = 'Space Police';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Solution', () => {
      const robot = new Robot(input);
      robot.execute();

      const solution = robot.countPainted();
      test(`${solution}`, () => {
        expect(solution).toEqual(2343);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const robot = new Robot(input, true);
      robot.execute();

      const solution = robot.print();
      test(`\n${solution}`, () => {
        const expected = `\
⬛⬛⬛⬜⬜⬛⬜⬜⬜⬜⬛⬜⬜⬜⬛⬛⬜⬜⬜⬜⬛⬜⬜⬜⬛⬛⬜⬜⬜⬛⬛⬜⬛⬛⬜⬛⬜⬛⬛⬜
⬛⬛⬛⬛⬜⬛⬜⬛⬛⬛⬛⬜⬛⬛⬜⬛⬜⬛⬛⬛⬛⬜⬛⬛⬜⬛⬜⬛⬛⬜⬛⬜⬛⬛⬜⬛⬜⬛⬛⬜
⬛⬛⬛⬛⬜⬛⬜⬜⬜⬛⬛⬜⬜⬜⬛⬛⬜⬜⬜⬛⬛⬜⬛⬛⬜⬛⬜⬜⬜⬛⬛⬜⬛⬛⬜⬛⬜⬜⬜⬜
⬛⬛⬛⬛⬜⬛⬜⬛⬛⬛⬛⬜⬛⬛⬜⬛⬜⬛⬛⬛⬛⬜⬜⬜⬛⬛⬜⬛⬛⬜⬛⬜⬛⬛⬜⬛⬜⬛⬛⬜
⬛⬜⬛⬛⬜⬛⬜⬛⬛⬛⬛⬜⬛⬛⬜⬛⬜⬛⬛⬛⬛⬜⬛⬜⬛⬛⬜⬛⬛⬜⬛⬜⬛⬛⬜⬛⬜⬛⬛⬜
⬛⬛⬜⬜⬛⬛⬜⬛⬛⬛⬛⬜⬜⬜⬛⬛⬜⬜⬜⬜⬛⬜⬛⬛⬜⬛⬜⬜⬜⬛⬛⬛⬜⬜⬛⬛⬜⬛⬛⬜`;

        expect(solution).toEqual(expected);
      });
    });
  });
});
