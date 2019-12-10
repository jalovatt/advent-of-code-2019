const blocks = (a, b) => {

};

const countVisibleFrom = (x, y, map) => {
  // console.log(`counting for ${x},${y}`);
  const slopes = {};
  for (let yTarget = 0; yTarget < map.length; yTarget += 1) {
    for (let xTarget = 0; xTarget < map[0].length; xTarget += 1) {
      if ((xTarget !== x || yTarget !== y) && map[yTarget][xTarget] === '#') {
        const xKey = (xTarget > x) ? 1 : -1;
        const yKey = (yTarget > y) ? 1 : -1;
        const slopeKey = (yTarget - y) / (xTarget - x);

        // console.log('  ', xTarget, yTarget, slopeKey);

        const key = `${xKey},${yKey},${slopeKey}`;
        slopes[key] = (slopes[key] ?? 0) + 1;
      }
    }
  }

  return Object.keys(slopes).length;
};

export default (mapIn) => {
  const map = mapIn.split('\n').map(line => line.split(''));

  const positions = [];
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[0].length; x += 1) {
      if (map[y][x] === '#') {
        positions.push([x, y, countVisibleFrom(x, y, map)]);
      }
    }
  }

  const sorted = positions.sort((a, b) => b[2] - a[2]);

  return sorted[0];
  // intersects if a closer asteroid has the same slope and +/-?
};
