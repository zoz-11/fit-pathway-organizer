/** @type {import('ts-jest').JestConfigWithTsJest} */
declare const _default: {
    preset: string;
    testEnvironment: string;
    setupFilesAfterEnv: string[];
    moduleNameMapper: {
        "^@/(.*)$": string;
        "\\.(css|less|sass|scss)$": string;
    };
    transform: {
        "^.+\\.(ts|tsx)$": (string | {
            tsconfig: string;
        })[];
        "^.+\\.js$": string;
    };
};
export default _default;
