import loadText from '../../utilities/loadText';
import { part1, newStack, cutCards, withIncrement } from '.';

const title = 'Slam Shuffle';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      describe('Techniques', () => {
        let deck;
        beforeEach(() => { deck = new Array(10).fill(null).map((v, i) => i); });

        test('Deal into new stack', () => {
          expect(newStack(deck).join(' ')).toEqual('9 8 7 6 5 4 3 2 1 0');
        });

        test('cutCards (3)', () => {
          expect(cutCards(deck, 3).join(' ')).toEqual('3 4 5 6 7 8 9 0 1 2');
        });

        test('cutCards (-4)', () => {
          expect(cutCards(deck, -4).join(' ')).toEqual('6 7 8 9 0 1 2 3 4 5');
        });

        test('withIncrement (3)', () => {
          expect(withIncrement(deck, 3).join(' ')).toEqual('0 7 4 1 8 5 2 9 6 3');
        });
      });

      describe('Shuffles', () => {
        test.each([
          ['deal with increment 7\ndeal into new stack\ndeal into new stack', '0 3 6 9 2 5 8 1 4 7'],
          ['cut 6\ndeal with increment 7\ndeal into new stack', '3 0 7 4 1 8 5 2 9 6'],
          ['deal with increment 7\ndeal with increment 9\ncut -2', '6 3 0 7 4 1 8 5 2 9'],
          ['deal into new stack\ncut -2\ndeal with increment 7\ncut 8\ncut -4\ndeal with increment 7\ncut 3\ndeal with increment 9\ndeal with increment 3\ncut -1', '9 2 5 8 1 4 7 0 3 6'],
        ])('%p => %p', (given, expected) => {
          expect(part1(given, 10).join(' ')).toEqual(expected);
        });
      });
    });

    describe('Solution', () => {
      const output = part1(input, 10007);
      const solution = output.indexOf(2019);

      test(`${solution}`, () => {
        expect(solution).toEqual(true);
      });
    });
  });

  xdescribe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [1, 2],
      ])('%p => %p', (given, expected) => {
        expect(solve(given)).toEqual(expected);
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
