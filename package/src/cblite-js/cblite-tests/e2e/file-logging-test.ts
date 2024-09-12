import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';

/* TODO - implement the FileLogging and re-enable tests */

/**
 * FileLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class FileLoggingTests extends TestCase {
  constructor() {
    super();
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async fileLoggingLevels(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingLevels',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async fileLoggingDefaultBinaryFormat(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingDefaultBinaryFormat',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async fileLoggingUsePlainText(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingUsePlainText',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async fileLoggingLogFilename(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingLogFilename',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async fileLoggingDisableLogging(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingDisableLogging',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async fileLoggingReEnableLogging(): Promise<ITestResult> {
    return {
      testName: 'testFileLoggingReEnableLogging',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }
}
