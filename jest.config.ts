module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/tests/**/*.test.(ts|js)'],
  testEnvironment: 'node',
};
