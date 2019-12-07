import IntCode from '../../common/IntCode';

export default (program, val) => {
  const computer = new IntCode(program);

  for (let noun = 0; noun < 100; noun += 1) {
    for (let verb = 0; verb < 100; verb += 1) {
      const got = computer.execute(noun, verb).state[0];

      if (got === val) { return (noun * 100 + verb); }
    }
  }

  return null;
};
