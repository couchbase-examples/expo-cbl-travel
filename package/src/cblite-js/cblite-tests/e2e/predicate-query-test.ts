import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';

/**
 * PredicateQueryTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class PredicateQueryTests extends TestCase {
  constructor() {
    super();
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testAllDocs(): Promise<ITestResult> {
    return {
      testName: 'testAllDocs',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testNoWhereQuery(): Promise<ITestResult> {
    return {
      testName: 'testNoWhereQuery',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testPropertyQuery(): Promise<ITestResult> {
    return {
      testName: 'testPropertyQuery',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testProjection(): Promise<ITestResult> {
    return {
      testName: 'testProjection',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }
}
