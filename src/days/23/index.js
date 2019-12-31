import IntCode from '../../common/IntCode';

// eslint-disable-next-line import/prefer-default-export
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
      // console.log(`output for computer ${address}:`);
      // console.log(output);

      for (let i = 0; i < output.length; i += 3) {
        const [addr, x, y] = output.slice(i, i + 3);
        if (!packetsFor[addr]) { packetsFor[addr] = []; }
        packetsFor[addr].push(x, y);
      }
    }
    computer.output = [];

    address = (address + 1) % 50;
  }

  console.log(packetsFor[255]);
};
