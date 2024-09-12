"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestingTests = void 0;
var _index = require("../../cblite/index.cjs");
var _testCase = require("./test-case.cjs");
/**
 * TestingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
class TestingTests extends _testCase.TestCase {
  constructor() {
    super();
  }

  /**
   * This is a sample test that just returns a passing result. It's used to test the test runner.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRunnerPass() {
    return {
      testName: 'testRunnerPass',
      success: true,
      message: 'success',
      data: undefined
    };
  }

  /**
   * This is a sample test that just returns a failed result. It's used to test the test runner.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRunnerFail() {
    let exception = new _index.CouchbaseLiteException('testRunnerFail', 'This is a test exception', 500);
    return {
      testName: 'testRunnerFail',
      success: false,
      message: JSON.stringify(exception),
      data: undefined
    };
  }
  async testRunnerThreeSeconds() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      testName: 'testRunnerFiveSeconds',
      success: true,
      message: 'success',
      data: undefined
    };
  }
  async testRunnerFiveSeconds() {
    await new Promise(resolve => setTimeout(resolve, 5000));
    return {
      testName: 'testRunnerTenSeconds',
      success: true,
      message: 'success',
      data: undefined
    };
  }
  async testRunnerSevenSeconds() {
    await new Promise(resolve => setTimeout(resolve, 7000));
    return {
      testName: 'testRunnerSevenSeconds',
      success: true,
      message: 'success',
      data: undefined
    };
  }
}
exports.TestingTests = TestingTests;
//# sourceMappingURL=testing-test.cjs.map