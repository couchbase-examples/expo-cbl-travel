"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleLoggingTests = void 0;
var _testCase = require("./test-case.cjs");
var _chai = require("chai");
var _index = require("../../cblite/index.cjs");
//import the database which has a list of log levels and domains

/**
 * ConsoleLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
class ConsoleLoggingTests extends _testCase.TestCase {
  constructor() {
    super();
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testConsoleLoggingLevels() {
    try {
      const expectedLogDomains = ['ALL', 'DATABASE', 'NETWORK', 'QUERY', 'REPLICATOR'];
      const actualLogDomains = Object.values(_index.LogDomain);
      (0, _chai.expect)(actualLogDomains).to.have.members(expectedLogDomains);
      const expectedLogLevels = ['DEBUG', 'VERBOSE', 'INFO', 'WARNING', 'ERROR', 'NONE'];
      const actualLogLevels = Object.values(_index.LogLevel).filter(value => typeof value === 'string');
      (0, _chai.expect)(actualLogLevels).to.have.members(expectedLogLevels);
    } catch (error) {
      return {
        testName: 'testConsoleLoggingLevels',
        success: false,
        message: error.toString,
        data: undefined
      };
    }
    return {
      testName: 'testConsoleLoggingLevels',
      success: true,
      message: 'success',
      data: undefined
    };
  }
}
exports.ConsoleLoggingTests = ConsoleLoggingTests;
//# sourceMappingURL=console-logging-test.cjs.map