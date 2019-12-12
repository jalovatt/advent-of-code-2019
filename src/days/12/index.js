// TODO: Refactor to remove this
/* eslint-disable no-param-reassign */

// eslint-disable-next-line max-classes-per-file
class Moon {
  constructor(x, y, z) {
    this.pos = { x, y, z };
    this.vel = { x: 0, y: 0, z: 0 };
  }

  stringify = () => {
    return `${this.pos.x},${this.pos.y},${this.pos.z},${this.vel.x},${this.vel.y},${this.vel.z}`;
  }
}

class System {
  constructor(moons) {
    this.moons = moons.split('\n').map((str) => {
      const [, x, y, z] = str.match(/x=([-\d]+), y=([-\d]+), z=([-\d]+)/);

      return new Moon(parseInt(x, 10), parseInt(y, 10), parseInt(z, 10));
    });

    this.initialState = {
      x: this.stringifyAxisState('x'),
      y: this.stringifyAxisState('y'),
      z: this.stringifyAxisState('z'),
    };

    this.axisCycles = {};
  }

  stringifyAxisState = (axis) => {
    return this.moons.reduce((acc, moon) => {
      acc.push(moon.pos[axis]);
      acc.push(moon.vel[axis]);

      return acc;
    }, []).join(',');
  }

  gravitate = (a, b) => {
    Object.keys(a.vel).forEach((k) => {
      if (a.pos[k] < b.pos[k]) {
        a.vel[k] += 1;
        b.vel[k] -= 1;
      } else if (a.pos[k] > b.pos[k]) {
        a.vel[k] -= 1;
        b.vel[k] += 1;
      }
    });
  }

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
  }

  print = () => {
    return this.moons.map((moon) => {
      return `pos=<x=${moon.pos.x}, y=${moon.pos.y}, z=${moon.pos.z}>, vel=<x=${moon.vel.x}, y=${moon.vel.y}, z=${moon.vel.z}>`;
    }).join('\n');
  }

  totalEnergy = () => {
    return this.moons.reduce((acc, moon) => {
      const p = Math.abs(moon.pos.x) + Math.abs(moon.pos.y) + Math.abs(moon.pos.z);
      const k = Math.abs(moon.vel.x) + Math.abs(moon.vel.y) + Math.abs(moon.vel.z);

      return acc + p * k;
    }, 0);
  }

  checkAxisCycles = (step) => {
    if (!this.axisCycles.x && (this.stringifyAxisState('x') === this.initialState.x)) {
      console.log(`found a cycle for x at ${step}`);
      this.axisCycles.x = step;
    }
    if (!this.axisCycles.y && (this.stringifyAxisState('y') === this.initialState.y)) {
      console.log(`found a cycle for y at ${step}`);
      this.axisCycles.y = step;
    }
    if (!this.axisCycles.z && (this.stringifyAxisState('z') === this.initialState.z)) {
      console.log(`found a cycle for z at ${step}`);
      this.axisCycles.z = step;
    }

    if (this.axisCycles.x && this.axisCycles.y && this.axisCycles.z) {
      console.log('axis cycles!!!!!');

      return this.axisCycles.x * this.axisCycles.y * this.axisCycles.z;
    }
  }

  // TODO: Implement a LCM algorithm for this rather than using an internet app
  findTotalCycle = () => {
    console.dir(this.axisCycles);
    return Object.values(this.axisCycles).reduce((acc, cur) => acc * cur);
  }
}

export const simulateMoons = (moons, n) => {
  const system = new System(moons);
  system.simulate(n);

  return system;
};

export const findCycleTime = (moons) => {
  const system = new System(moons);
  const MAX_CYCLES = 1000000;

  let n = 0;
  do {
    if (n > MAX_CYCLES) { console.error(`Halted after ${MAX_CYCLES} steps`); return -1; }
    system.simulate();
    n += 1;
  } while (!system.checkAxisCycles(n));

  console.log(`found all cycles at ${n - 1}`);
  return system.findTotalCycle();
};
