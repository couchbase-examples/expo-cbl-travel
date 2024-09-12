"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PredicateQueryTests = void 0;
var _testCase = require("./test-case.cjs");
/**
 * PredicateQueryTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
class PredicateQueryTests extends _testCase.TestCase {
  constructor() {
    super();
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testAllDocs() {
    return {
      testName: 'testAllDocs',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testNoWhereQuery() {
    return {
      testName: 'testNoWhereQuery',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testPropertyQuery() {
    return {
      testName: 'testPropertyQuery',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testProjection() {
    return {
      testName: 'testProjection',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }
}
exports.PredicateQueryTests = PredicateQueryTests;
//# sourceMappingURL=predicate-query-test.cjs.map