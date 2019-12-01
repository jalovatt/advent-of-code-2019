module.exports = {
  testMatch: [
    '**/?(*.)spec.js?(x)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__template/',
  ],
  transform: {
    '^.+\\.js$': '<rootDir>/babel-transform.js',
  },

};
