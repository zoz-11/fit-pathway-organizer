/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/configs/setupTests.ts"],
  rootDir: "../",
  testMatch: ["<rootDir>/apps/web-app/src/**/__tests__/**/*.{ts,tsx}", "<rootDir>/packages/**/__tests__/**/*.{ts,tsx}"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/apps/web-app/src/$1",
    "^@components/(.*)$": "<rootDir>/packages/ui/$1",
    "^@hooks/(.*)$": "<rootDir>/packages/hooks/$1",
    "^@i18n/(.*)$": "<rootDir>/packages/i18n/$1",
    "^@types/(.*)$": "<rootDir>/packages/types/$1",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "../tsconfig.json" }],
    "^.+\\.js$": "babel-jest",
  },
};
