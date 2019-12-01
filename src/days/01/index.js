export const fuelForModule = mass => Math.floor(mass / 3) - 2;

export const fuelForModuleCumulative = (mass) => {
  const fuel = fuelForModule(mass);

  if (fuel <= 0) { return 0; }

  return fuel + fuelForModuleCumulative(fuel);
};

export const totalFuelStatic = masses => masses.reduce((acc, cur) => (
  acc + fuelForModule(cur)
), 0);

export const totalFuelCumulative = masses => masses.reduce((acc, cur) => (
  acc + fuelForModuleCumulative(cur)
), 0);
