import loadText from '../../utilities/loadText';
import { findTank, timeToFill } from '.';

const title = 'Oxygen System';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Solution', () => {
      const solution = findTank(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(212);
      });
    });
  });

  describe('Part 2', () => {
    describe('Solution', () => {
      const solution = timeToFill(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(358);
      });
    });
  });
});
