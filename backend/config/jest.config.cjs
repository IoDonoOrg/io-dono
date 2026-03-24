module.exports = {
    rootDir: '..',
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    setupFiles: ['dotenv/config', '<rootDir>/tests/setupEnv.js'],
    testMatch: ['**/tests/**/*.test.js']
};
