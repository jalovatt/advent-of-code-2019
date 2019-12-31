import IntCode from '../../common/IntCode';

export const part1 = (input) => {
  const network = new Array(50).fill(null).map((v, i) => {
    const computer = new IntCode(input);
    computer.execute(null, null, [i]);
    return computer;
  });

  const packetsFor = [];

  let address = 0;
  while (!packetsFor[255]) {
    const computer = network[address];
    const packets = packetsFor[address] || [-1];
    computer.resume(packets);
    packetsFor[address] = [];

    const { output } = computer;
    if (output.length) {
      for (let i = 0; i < output.length; i += 3) {
        const [addr, x, y] = output.slice(i, i + 3);
        if (!packetsFor[addr]) { packetsFor[addr] = []; }
        packetsFor[addr].push(x, y);
      }
    }
    computer.output = [];

    address = (address + 1) % 50;
  }

  return packetsFor[255][1];
};

export const part2 = (input) => {
  const network = new Array(50).fill(null).map((v, i) => {
    const computer = new IntCode(input);
    computer.execute(null, null, [i]);
    return computer;
  });

  let lastNatPacket;
  let lastYToZero;

  const packetsFor = [];

  let address = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const computer = network[address];
    const packets = packetsFor[address] || [-1];
    computer.resume(packets);
    packetsFor[address] = [];

    const { output } = computer;
    if (output.length) {
      for (let i = 0; i < output.length; i += 3) {
        const [addr, x, y] = output.slice(i, i + 3);

        if (addr === 255) {
          lastNatPacket = [x, y];
        } else {
          if (!packetsFor[addr]) { packetsFor[addr] = []; }
          packetsFor[addr].push(x, y);
        }
      }
    }
    computer.output = [];

    if (address === 49) {
      const idle = packetsFor.filter(p => !!p.length).length === 0;

      if (idle) {
        const y = lastNatPacket[1];
        if (y === lastYToZero) { return y; }

        packetsFor[0].push(...lastNatPacket);
        lastYToZero = y;
      }
    }

    address = (address + 1) % 50;
  }
};
