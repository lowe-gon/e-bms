import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Prevents Jest from crashing with code 1 when no tests match staged files
  passWithNoTests: true,
  moduleNameMapper: {
    '^@/src/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);
