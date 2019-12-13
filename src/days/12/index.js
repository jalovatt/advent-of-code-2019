/* eslint-disable no-param-reassign */

class System {
  constructor(moons) {
    this.moons = moons.split('\n').map((str) => {
      const [, x, y, z] = str.match(/x=([-\d]+), y=([-\d]+), z=([-\d]+)/);

      return {
        pos: { x: parseInt(x, 10), y: parseInt(y, 10), z: parseInt(z, 10) },
        vel: { x: 0, y: 0, z: 0 },
      };
    });

    this.initialState = {
      x: this.axisState('x'),
      y: this.axisState('y'),
      z: this.axisState('z'),
    };

    this.axisCycles = {};
  }

  axisState = axis => this.moons.reduce((acc, moon) => {
    acc.push(moon.pos[axis]);
    acc.push(moon.vel[axis]);

    return acc;
  }, []).join(',');

  gravitate = (a, b) => Object.keys(a.vel).forEach((k) => {
    if (a.pos[k] < b.pos[k]) {
      a.vel[k] += 1;
      b.vel[k] -= 1;
    } else if (a.pos[k] > b.pos[k]) {
      a.vel[k] -= 1;
      b.vel[k] += 1;
    }
  });

  updateVelocities = () => {
    for (let a = 0; a < (this.moons.length - 1); a += 1) {
      for (let b = a + 1; b < this.moons.length; b += 1) {
        this.gravitate(this.moons[a], this.moons[b]);
      }
    }
  }

  updatePositions = () => {
    this.moons.forEach((moon) => {
      moon.pos.x += moon.vel.x;
      moon.pos.y += moon.vel.y;
      moon.pos.z += moon.vel.z;
    });
  }

  simulate = (steps = 1) => {
    for (let i = 0; i < steps; i += 1) {
      this.updateVelocities();
      this.updatePositions();
    }

    return this;
  }

  print = () => this.moons.map(moon => (
    `pos=<x=${moon.pos.x}, y=${moon.pos.y}, z=${moon.pos.z}>, vel=<x=${moon.vel.x}, y=${moon.vel.y}, z=${moon.vel.z}>`
  )).join('\n')

  totalEnergy = () => this.moons.reduce((acc, moon) => {
    const p = Math.abs(moon.pos.x) + Math.abs(moon.pos.y) + Math.abs(moon.pos.z);
    const k = Math.abs(moon.vel.x) + Math.abs(moon.vel.y) + Math.abs(moon.vel.z);

    return acc + p * k;
  }, 0)

  findAxisCycles = (step) => {
    ['x', 'y', 'z'].forEach((axis) => {
      if (!this.axisCycles[axis] && this.axisState(axis) === this.initialState[axis]) {
        this.axisCycles[axis] = step;
      }
    });

    return (this.axisCycles.x && this.axisCycles.y && this.axisCycles.z);
  }

  // Inefficient (takes >1 billion loops for the solution), but at least I understand it...
  findOverallCycle = () => {
    const [m, n, max] = Object.values(this.axisCycles).sort((a, b) => a - b);
    const product = m * n * max;

    for (let i = max; i <= product; i += max) {
      if (i % n === 0 && i % m === 0) {
        return i;
      }
    }

    return -1;
  }
}

export const simulateMoons = (moons, n) => new System(moons).simulate(n);

export const findCycleTime = (moons) => {
  const system = new System(moons);
  const MAX_CYCLES = 1000000;

  let n = 0;
  do {
    if (n > MAX_CYCLES) { console.error(`Halted after ${MAX_CYCLES} steps`); return -1; }
    system.simulate();
    n += 1;
  } while (!system.findAxisCycles(n));

  return system.findOverallCycle();
};
