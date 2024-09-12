import { CouchbaseLiteException } from '../../cblite';
import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';

/**
 * TestingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class TestingTests extends TestCase {
  constructor() {
    super();
  }

  /**
   * This is a sample test that just returns a passing result. It's used to test the test runner.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRunnerPass(): Promise<ITestResult> {
    return {
      testName: 'testRunnerPass',
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  /**
   * This is a sample test that just returns a failed result. It's used to test the test runner.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRunnerFail(): Promise<ITestResult> {
    let exception = new CouchbaseLiteException(
      'testRunnerFail',
      'This is a test exception',
      500
    );
    return {
      testName: 'testRunnerFail',
      success: false,
      message: JSON.stringify(exception),
      data: undefined,
    };
  }

  async testRunnerThreeSeconds(): Promise<ITestResult> {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return {
      testName: 'testRunnerFiveSeconds',
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  async testRunnerFiveSeconds(): Promise<ITestResult> {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return {
      testName: 'testRunnerTenSeconds',
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  async testRunnerSevenSeconds(): Promise<ITestResult> {
    await new Promise((resolve) => setTimeout(resolve, 7000));
    return {
      testName: 'testRunnerSevenSeconds',
      success: true,
      message: 'success',
      data: undefined,
    };
  }
}
