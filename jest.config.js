module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
        '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '^@adapters/(.*)$': '<rootDir>/src/adapters/$1',
    },
    testMatch: [
        "**/tests/**/*.test.ts"
    ],
}