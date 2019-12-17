import loadText from '../../utilities/loadText';
import { part1, part2, part2Live, crawlScaffold, sumIntersections } from '.';

const title = 'Set and Forget';

const input = loadText('input.txt');

describe(`Day ${__filename.match(/\/([^/]+)\/spec/)[1]} - ${title}`, () => {
  describe('Part 1', () => {
    describe('Sum Intersections', () => {
      const view = '..#..........\n..#..........\n#######...###\n#.#...#...#.#\n#############\n..#...#...#..\n..#####...^..'
        .split('\n').map(row => row.split(''));

      test('should find intersections', () => {
        expect(sumIntersections(view)).toEqual(76);
      });
    });

    describe('Solution', () => {
      const solution = part1(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(13580);
      });
    });
  });

  describe('Part 2', () => {
    describe('Crawl Scaffold', () => {
      test('should generate instructions', () => {
        const output = crawlScaffold(input);
        expect(output).toEqual('R,6,L,12,R,6,R,6,L,12,R,6,L,12,R,6,L,8,L,12,R,12,L,10,L,10,L,12,R,6,L,8,L,12,R,12,L,10,L,10,L,12,R,6,L,8,L,12,R,12,L,10,L,10,L,12,R,6,L,8,L,12,R,6,L,12,R,6');
      });
    });

    describe('Solution (takes ~45 seconds)', () => {
      const solution = part2(input);

      test(`${solution}`, () => {
        expect(solution).toEqual(1063081);
      });
    });

    // describe('Live feed (takes ~45 seconds)', () => {
    //   const solution = part2Live(input);

    //   test(`${solution}`, () => {
    //     expect(solution).toEqual(1063081);
    //   });
    // });
  });
});
