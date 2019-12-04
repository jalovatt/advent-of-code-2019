import { validate, passwordCount } from '.';

const title = 'Secure Container';

const input = [372304, 847060];

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        [111111, true],
        [223450, false],
        [123789, false],
      ])('%p => %p', (given, expected) => {
        expect(validate(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = passwordCount(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(475);
      });
    });
  });

  describe('Part 2', () => {
    describe('Tests', () => {
      test.each([
        [112233, true],
        [123444, false],
        [111122, true],
      ])('%p => %p', (given, expected) => {
        expect(validate(given, true)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = passwordCount(input, true);

      test(`${solution}`, () => {
        expect(solution).toEqual(297);
      });
    });
  });
});
