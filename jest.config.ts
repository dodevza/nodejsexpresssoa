import { config } from "dotenv-flow";
import { expand } from "dotenv-expand";
import { Logger } from "./src/shared/logging/logger";

const environmentVariables = config({
    path: 'config',
})
expand(environmentVariables)

Logger.initialize();

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['dist'],
    moduleNameMapper: {
        "@exmpl/(.*)": "<rootDir>/src/$1"
      },
    testTimeout: 15000,
    coveragePathIgnorePatterns: [
      "<rootDir>/src/middleware/routes.ts",
      "<rootDir>/testing/"]
  };