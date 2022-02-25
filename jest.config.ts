import { compilerOptions } from "./tsconfig.json";
import type { Config } from '@jest/types';
import { defaults } from "jest-config";
import { pathsToModuleNameMapper } from "ts-jest/utils";

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
        "\\.(css|less)$": `<rootDir>/tests/mocks/styleMock.ts`,
        ...pathsToModuleNameMapper(compilerOptions.paths, {
            prefix: `<rootDir>/`,
        }),
    },
    transform: {
        "^.+\\.tsx?$": `babel-jest`,
        "^.+\\.svg$": `jest-svg-transformer`,
    },
    maxWorkers: `50%`,

};

export default config;
