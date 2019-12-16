import loadText from '../../utilities/loadText';
import { iterate, findFirstEight, part2 } from '.';

const title = 'Flawed Frequency Transmission';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests (iterate)', () => {
      test.each([
        [{ input: '12345678', n: 1 }, '48226158'],
        [{ input: '12345678', n: 2 }, '34040438'],
        [{ input: '12345678', n: 3 }, '03415518'],
        [{ input: '12345678', n: 4 }, '01029498'],
      ])('%p => %p', (given, expected) => {
        expect(iterate(given.input, given.n)).toEqual(expected);
      });
    });

    describe('Tests (first eight)', () => {
      test.each([
        [{ input: '80871224585914546619083218645595', n: 100 }, '24176176'],
        [{ input: '19617804207202209144916044189917', n: 100 }, '73745418'],
        [{ input: '69317163492948606335995924319873', n: 100 }, '52432133'],
      ])('%p => %p', (given, expected) => {
        expect(findFirstEight(given.input, given.n)).toEqual(expected);
      });
    });

    // describe('Solution (takes ~45 seconds)', () => {
    //   const output = iterate(input, 100);

    //   const solution = output.toString(10).slice(0, 8);

    //   test(`${solution}`, () => {
    //     expect(solution).toEqual('58672132');
    //   });
    // });
  });

  xdescribe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        ['03036732577212944063491565474664', '84462026'],
        // ['02935109699940807407585447034323', '78725270'],
        // ['03081770884921959731165446850517', '53553731'],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
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
