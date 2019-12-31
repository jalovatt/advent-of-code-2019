import fs from 'fs';

import loadText from '../../utilities/loadText';
import IntCode from '../../common/IntCode';

const input = loadText('input.txt');

const readLine = require('readline');

const read = () => {
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(': ', ans => { rl.close(); resolve(ans); }));
};

const toAscii = (str) => str.split('').map(c => c.charCodeAt(0));

const fromAscii = (asciiArr) => asciiArr.map(v => (v < 128 ? String.fromCharCode(v) : v)).join('');

// eslint-disable-next-line import/prefer-default-export
const game = async () => {
  const computer = new IntCode(input);
  computer.execute();

  const states = {};

  const save = (key, output) => {
    const out = { state: [...computer.state], cursor: computer.cursor, output };
    fs.writeFileSync(`${__dirname}/${key}.json`, JSON.stringify(out));
    computer.output = output;
  };

  const load = (key) => {
    const state = JSON.parse(fs.readFileSync(`${__dirname}/${key}.json`));
    console.dir(state);
    computer.state = [...state.state];
    computer.cursor = state.cursor;
    computer.output = state.output;
  };

  while (!computer.halted) {
    const { output } = computer;
    const parsed = fromAscii(output);
    console.clear();
    console.log(parsed);
    computer.output = [];

    const res = await read();

    if (res.match(/^save/)) {
      const [, key] = res.match(/^save (.+)/);
      save(key, output);
    } else if (res.match(/^load/)) {
      const [, key] = res.match(/^load (.+)/);
      load(key);
    } else if (res.match(/^brute/)) {
      const [, dir] = res.match(/^brute (.+)/);
    } else {
      computer.resume(toAscii(res).concat([10]));
    }
  }

  console.log(fromAscii(computer.output));
};

game();
