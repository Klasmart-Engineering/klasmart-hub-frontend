import { compilerOptions } from "./tsconfig.json";
import type { Config } from '@jest/types';
import { defaults } from "jest-config";
import { pathsToModuleNameMapper } from "ts-jest";

const config: Config.InitialOptions = {
    verbose: false,
    testEnvironment: `jsdom`,
    testPathIgnorePatterns: [ `/node_modules/` ],
    setupFiles: [ `<rootDir>/tests/mocks.ts` ],
    setupFilesAfterEnv: [ `<rootDir>/setupTests.ts` ],
    moduleFileExtensions: [
        ...defaults.moduleFileExtensions,
        `ts`,
        `tsx`,
    ],
    moduleDirectories: [ `node_modules` ],
    moduleNameMapper: {
        "\\.(css|less|svg|png)$": `<rootDir>/tests/mocks/transformer.ts`,
        ...pathsToModuleNameMapper(compilerOptions.paths, {
            prefix: `<rootDir>/`,
        }),
    },
    maxWorkers: `50%`,
    transform: {
        "^.+\\.(t|j)sx?$": [
            `@swc/jest`,
            {
                sourceMaps: true,
            },
        ],
    },
};

export default config;
