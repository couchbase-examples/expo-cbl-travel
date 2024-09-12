"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileLoggingTests = void 0;
var _testCase = require("./test-case.cjs");
/* TODO - implement the FileLogging and re-enable tests */

/**
 * FileLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
class FileLoggingTests extends _testCase.TestCase {
  constructor() {
    super();
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async fileLoggingLevels() {
    return {
      testName: 'testFileLoggingLevels',
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
  async fileLoggingDefaultBinaryFormat() {
    return {
      testName: 'testFileLoggingDefaultBinaryFormat',
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
  async fileLoggingUsePlainText() {
    return {
      testName: 'testFileLoggingUsePlainText',
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
  async fileLoggingLogFilename() {
    return {
      testName: 'testFileLoggingLogFilename',
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
  async fileLoggingDisableLogging() {
    return {
      testName: 'testFileLoggingDisableLogging',
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
  async fileLoggingReEnableLogging() {
    return {
      testName: 'testFileLoggingReEnableLogging',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }
}
exports.FileLoggingTests = FileLoggingTests;
//# sourceMappingURL=file-logging-test.cjs.map