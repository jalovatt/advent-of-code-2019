/* eslint-disable no-param-reassign */

const move = {
  R: (point) => { point[0] += 1; },
  L: (point) => { point[0] -= 1; },
  U: (point) => { point[1] += 1; },
  D: (point) => { point[1] -= 1; },
};

const addPoint = (point, wire, steps, field) => {
  const key = point.join(',');
  field[key] = (field[key] || {});
  field[key][wire] = field[key][wire] || steps;
};

const traceWire = (path, wire, field) => {
  const segments = path.split(',');
  const point = [0, 0];
  let steps = 1;

  segments.forEach((segment) => {
    const [direction, val] = segment.match(/(.)(.+)/).slice(1);

    for (let n = 0; n < val; n += 1) {
      move[direction](point);
      addPoint(point, wire, steps, field);

      steps += 1;
    }
  });
};

const findShortestIntersection = field => Object.entries(field)
  .reduce((acc, [point, { a, b }]) => {
    if (a && b) {
      const [x, y] = point.split(',');
      const distance = Math.abs(parseInt(x, 10)) + Math.abs(parseInt(y, 10));

      acc.push(distance);
    }

    return acc;
  }, []).sort((a, b) => a - b)[0];

const findFewestSteps = field => Object.values(field)
  .reduce((acc, { a, b }) => {
    if (a && b) { acc.push(a + b); }

    return acc;
  }, []).sort((a, b) => a - b)[0];

const calculateField = (input) => {
  const [a, b] = input.split('\n');

  const field = {};
  traceWire(a, 'a', field);
  traceWire(b, 'b', field);

  return field;
};

export const shortestDistance = input => findShortestIntersection(calculateField(input));

export const fewestSteps = input => findFewestSteps(calculateField(input));
