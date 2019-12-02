import fs from 'fs';
import path from 'path';

export default (fn) => {
  const { stack } = Error();
  const line = stack.split('\n')[2];
  const callingPath = line.match(/\((.+)\/[^/]+$/)?.[1];

  return fs.readFileSync(path.resolve(callingPath, fn))
    .toString('utf-8')
    .trim();
};
