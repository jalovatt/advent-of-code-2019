/* eslint-disable no-extend-native */
String.prototype.filter = Array.prototype.filter;
String.prototype.map = Array.prototype.map;
String.prototype.reduce = Array.prototype.reduce;
String.prototype.forEach = Array.prototype.forEach;
/* eslint-enable no-extend-native */

class SIF {
  constructor(raw, w, h) {
    const layerRegEx = new RegExp(`.{${w * h}}`, 'g');

    this.w = w;
    this.h = h;
    this.layers = raw.match(layerRegEx);
  }

  checkSum = () => {
    const layerCounts = this.layers.reduce((counts, layer) => {
      counts.push(
        layer.reduce((acc, n) => {
          acc[n] += 1;

          return acc;
        }, { 0: 0, 1: 0, 2: 0 }),
      );

      return counts;
    }, []);

    const { layer } = layerCounts.reduce((acc, cur) => (
      (cur[0] < acc.min) ? { layer: cur, min: cur[0] } : acc
    ), { layer: null, min: Number.MAX_SAFE_INTEGER });

    return layer[1] * layer[2];
  }

  decode = () => this.layers.reduce((acc, cur) => {
    cur.forEach((char, i) => {
      if (acc[i] !== undefined && acc[i] < 2) { return; }

      acc[i] = char;
    });

    return acc;
  }, []);

  print = () => {
    const image = this.decode();

    return image.reduce((acc, cur) => {
      const char = ((cur === '1') ? '⬜' : '⬛');

      acc.chars.push(char);
      acc.i += 1;

      if (acc.i % (this.w) === 0 && (acc.i < image.length)) {
        acc.chars.push('\n');
      }

      return acc;
    }, { i: 0, chars: [] }).chars.join('');
  }
}

export default SIF;
