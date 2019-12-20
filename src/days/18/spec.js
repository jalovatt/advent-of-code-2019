import loadText from '../../utilities/loadText';
import { part1, part2 } from '.';

const title = 'Many-Worlds Interpretation';

const input1 = loadText('input1.txt');
const input2 = loadText('input2.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  xdescribe('Part 1', () => {
    describe('Tests', () => {
      test.each([
        ['#########\n#b.A.@.a#\n#########', 8],
        ['########################\n#f.D.E.e.C.b.A.@.a.B.c.#\n######################.#\n#d.....................#\n########################', 86],
        ['########################\n#...............b.C.D.f#\n#.######################\n#.....@.a.B.c.d.A.e.F.g#\n########################', 132],
        ['########################\n#@..............ac.GI.b#\n###d#e#f################\n###A#B#C################\n###g#h#i################\n########################', 81],
        // Takes ~30 seconds
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

    // describe('Solution (takes ~1:30)', () => {
    //   const solution = part1(input);

    //   test(`${solution}`, () => {
    //     expect(solution).toEqual(true);
    //   });
    // });
  });

  describe('Part 2', () => {
    xdescribe('Tests', () => {
      test.each([
        ['#######\n#a.#Cd#\n##@#@##\n#######\n##@#@##\n#cB#Ab#\n#######', 8],
        ['#############\n#g#f.D#..h#l#\n#F###e#E###.#\n#dCba@#@BcIJ#\n#############\n#nK.L@#@G...#\n#M###N#H###.#\n#o#m..#i#jk.#\n#############', 72],
      ])('%p => %p', (given, expected) => {
        expect(part2(given)).toEqual(expected);
      });
    });

    describe('Solution', () => {
      const solution = part2(input2);

      test(`${solution}`, () => {
        expect(solution).toEqual(true);
      });
    });
  });
});
