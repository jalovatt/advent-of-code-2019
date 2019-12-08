class SIF {
  constructor(raw, w, h) {
    const layerRegEx = new RegExp(`.{${w * h}}`, 'g');

    this.w = w;
    this.h = h;
    this.layers = raw.match(layerRegEx).map(str => str.split(''));
  }

  checkSum = () => {
    const { layer } = this.layers.reduce((acc, cur) => {
      const zeroes = cur.filter(n => n === '0').length;

      return (zeroes < acc.min) ? { layer: cur, min: zeroes } : acc;

    }, { layer: null, min: Number.MAX_SAFE_INTEGER });

    // console.dir(layer);

    const ones = layer.filter(n => n === '1').length;
    const twos = layer.filter(n => n === '2').length;

    // console.log(ones, twos);

    return ones * twos;
  }

  // 0 black (□), 1 white (■), 2 trans... no default?
  decode = () => {
    return this.layers.reduce((acc, cur) => {
      cur.forEach((char, i) => {
        if (acc[i] !== undefined && acc[i] < 2) { return; }

        acc[i] = char;
      });

      return acc;
    }, new Array(this.layers[0].length)).join('');
  }

  print = () => {
    const image = this.decode();
    const lineRegEx = new RegExp(`.{${this.w}}`, 'g');

    const converted = Array.prototype.map.call(image, (char => ((char === '1') ? '⬜' : '⬛')));
    const lines = converted.join('').match(lineRegEx);

    return '\n' + lines.join('\n');
  }
}

export default SIF;
