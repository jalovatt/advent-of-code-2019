import loadText from '../../utilities/loadText';
import { part1 } from '.';

const title = 'Many-Worlds Interpretation';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['#########\n#b.A.@.a#\n#########', 8],
        ['########################\n#f.D.E.e.C.b.A.@.a.B.c.#\n######################.#\n#d.....................#\n########################', 86],
        ['########################\n#...............b.C.D.f#\n#.######################\n#.....@.a.B.c.d.A.e.F.g#\n########################', 132],
        ['########################\n#@..............ac.GI.b#\n###d#e#f################\n###A#B#C################\n###g#h#i################\n########################', 81],
        // ['#################\n#i.G..c...e..H.p#\n########.########\n#j.A..b...f..D.o#\n########@########\n#k.E..a...g..B.n#\n########.########\n#l.F..d...h..C.m#\n#################', 136],
      ])('%p => %p', (given, expected) => {
        expect(part1(given)).toEqual(expected);
      });
    });

    describe('Edge case', () => {
      const edge = '########\n#.....c.#\n#.#####.#\n#.a.@.b.#\n#########';
      const expected = 10;

      test(`${edge} => ${expected}`, () => {
        expect(part1(edge)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = part1(input);

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
        expect(part1(given)).toEqual(expected);
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
