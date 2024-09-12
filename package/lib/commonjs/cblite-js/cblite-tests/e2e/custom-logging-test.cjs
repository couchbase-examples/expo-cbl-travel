"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomLoggingTests = void 0;
var _testCase = require("./test-case.cjs");
/* TODO - implement the Custom Logging and re-enable tests */

/**
 * CustomLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
class CustomLoggingTests extends _testCase.TestCase {
  constructor() {
    super();
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async customLoggingLevels() {
    return {
      testName: 'testCustomLoggingLevels',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async enableAndDisableCustomLogging() {
    return {
      testName: 'testEnableAndDisableCustomLogging',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async nonASCII() {
    return {
      testName: 'testNonASCII',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async percentEscape() {
    return {
      testName: 'testPercentEscape',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }
}
exports.CustomLoggingTests = CustomLoggingTests;
//# sourceMappingURL=custom-logging-test.cjs.map