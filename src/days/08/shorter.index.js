/* eslint-disable no-extend-native */
String.prototype.filter = Array.prototype.filter;
String.prototype.map = Array.prototype.map;
String.prototype.reduce = Array.prototype.reduce;
String.prototype.forEach = Array.prototype.forEach;
/* eslint-enable no-extend-native */

class SIF {
  constructor(raw, w, h) {
    this.raw = raw;
    this.w = w;
    this.h = h;

    this.layerSize = w * h;
    this.layerCount = raw.length / this.layerSize;
  }

  checkSum = () => {
    const counts = [];

    for (let layer = 0; layer < this.layerCount; layer += 1) {
      const count = { 0: 0, 1: 0, 2: 0 };
      const layerStart = layer * this.layerSize;

      for (let pos = 0; pos < this.layerSize; pos += 1) {
        count[this.raw[layerStart + pos]] += 1;
      }

      counts.push(count);
    }

    const { layer } = counts.reduce((acc, cur) => (
      (cur[0] < acc.min) ? { layer: cur, min: cur[0] } : acc
    ), { layer: null, min: Number.MAX_SAFE_INTEGER });

    return layer[1] * layer[2];
  }

  print = () => {
    const output = [];

    for (let pos = 0; pos < this.layerSize; pos += 1) {
      for (let layerStart = 0; layerStart < this.raw.length; layerStart += this.layerSize) {
        if (output[pos] !== undefined) { break; }

        const index = pos + layerStart;
        const digit = this.raw[index];

        if (digit !== '2') {
          const newline = (pos > 0 && pos % this.w === 0) ? '\n' : '';
          const char = ((digit === '1') ? '⬜' : '⬛');

          output[pos] = `${newline}${char}`;
        }
      }
    }

    return output.join('');
  }
}

export default SIF;
