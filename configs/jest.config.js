/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    },
    transform: {
        "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "./tsconfig.jest.json" }],
        "^.+\\.js$": "babel-jest",
    },
};
