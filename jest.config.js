const environmentVariables = require("dotenv-flow").config({
    path: 'config',
})
require("dotenv-expand").expand(environmentVariables)


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