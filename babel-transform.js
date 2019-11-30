const fs = require('fs');

const babelOptions = JSON.parse(fs.readFileSync('.babelrc'));
module.exports = require('babel-jest').createTransformer(babelOptions);
