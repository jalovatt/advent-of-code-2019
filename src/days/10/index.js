const roundToEight = n => Math.floor(n * 10 ** 8) / (10 ** 8);

const countVisibleFrom = (x, y, map) => {
  // console.log(`counting for ${x},${y}`);
  const slopes = {};
  for (let yTarget = 0; yTarget < map.length; yTarget += 1) {
    for (let xTarget = 0; xTarget < map[0].length; xTarget += 1) {
      if ((xTarget !== x || yTarget !== y) && map[yTarget][xTarget] === '#') {
        const xKey = (xTarget > x) ? 1 : -1;
        const yKey = (yTarget > y) ? 1 : -1;
        const slopeKey = Math.atan2((xTarget - x), (yTarget - y)) % (2 * Math.PI);

        // const key = `${xKey},${yKey},${slopeKey}`;
        const key = slopeKey;
        if (!slopes[key]) { slopes[key] = []; }
        slopes[key].push([xTarget, yTarget]);
      }
    }
  }

  return slopes;
};

export const findBestPosition = (mapIn) => {
  const map = mapIn.split('\n').map(line => line.split(''));

  const positions = [];
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[0].length; x += 1) {
      if (map[y][x] === '#') {
        positions.push([x, y, countVisibleFrom(x, y, map)]);
      }
    }
  }

  const position = positions.sort((a, b) => Object.keys(b[2]).length - Object.keys(a[2]).length)[0];
  return { x: position[0], y: position[1], count: Object.keys(position[2]).length, angles: position[2] };
  // intersects if a closer asteroid has the same slope and +/-?
};

export const findVaporizedPosition = (map, n) => {
  const { x, y, angles } = findBestPosition(map);

  Object.values(angles).forEach(points => points.sort((a, b) => {
    const distA = (a[0] - x ** 2) + (a[1] - y ** 2);
    const distB = (b[0] - x ** 2) + (b[1] - y ** 2);

    return distB - distA;
  }));

  const keyOrder = Object.keys(angles).sort((a, b) => {
    return parseFloat(b, 10) - parseFloat(a, 10);
  });

  let start = keyOrder.findIndex(angle => {
    return parseFloat(angle, 10) === Math.PI;
  });

  let i = 0;
  let asteroid;
  while (i < n) {
    const key = keyOrder[(start + i) % keyOrder.length];
    if (angles[key].length) { asteroid = angles[key].shift(); }

    i += 1;
  }

  // TODO: Find a way to start from Math.atan(1/0) and loop clockwise;

  return asteroid;
};
