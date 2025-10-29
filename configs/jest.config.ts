/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  testEnvironment: "jsdom",
  rootDir: "../",
  setupFilesAfterEnv: ["<rootDir>/configs/setupTests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/apps/web-app/src/$1",
    "^@components/(.*)$": "<rootDir>/packages/ui/$1",
    "^@hooks/(.*)$": "<rootDir>/packages/hooks/$1",
    "^@i18n/(.*)$": "<rootDir>/packages/i18n/$1",
    "^@types/(.*)$": "<rootDir>/packages/types/$1",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/configs/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { 
      tsconfig: "<rootDir>/tsconfig.jest.json"
    }],
    "^.+\\.js$": "babel-jest",
  },
  testMatch: [
    "<rootDir>/**/__tests__/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/**/*.(test|spec).[jt]s?(x)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  collectCoverageFrom: [
    "apps/web-app/src/**/*.{ts,tsx}",
    "packages/**/*.{ts,tsx}",
    "!**/__tests__/**",
    "!**/*.test.{ts,tsx}",
    "!**/*.spec.{ts,tsx}",
    "!**/node_modules/**",
  ],
};
