import { TestCase } from "./test-case.mjs";
/* TODO - implement the Custom Logging and re-enable tests */

/**
 * CustomLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class CustomLoggingTests extends TestCase {
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
//# sourceMappingURL=custom-logging-test.mjs.map