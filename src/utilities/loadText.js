import fs from 'fs';
import path from 'path';

export default (fn, trim = true) => {
  const { stack } = Error();
  const line = stack.split('\n')[2];
  const callingPath = line.match(/\((.+)\/[^/]+$/)?.[1];

  const str = fs.readFileSync(path.resolve(callingPath, fn))
    .toString('utf-8')
    .replace(/(\n)$/, '');

  return trim ? str.trim() : str;
};
