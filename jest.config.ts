import type { Config } from '@jest/types';

const { defaults } = require(`jest-config`);
const { pathsToModuleNameMapper } = require(`ts-jest/utils`);
const { compilerOptions } = require(`./tsconfig`);

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
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: `<rootDir>/`,
    }),
};

export default config;
