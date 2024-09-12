import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';

import { expect } from 'chai';

//import the database which has a list of log levels and domains
import { LogLevel, LogDomain } from '../../cblite';

/**
 * ConsoleLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class ConsoleLoggingTests extends TestCase {
  constructor() {
    super();
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testConsoleLoggingLevels(): Promise<ITestResult> {
    try {
      const expectedLogDomains = [
        'ALL',
        'DATABASE',
        'NETWORK',
        'QUERY',
        'REPLICATOR',
      ];
      const actualLogDomains = Object.values(LogDomain);
      expect(actualLogDomains).to.have.members(expectedLogDomains);

      const expectedLogLevels = [
        'DEBUG',
        'VERBOSE',
        'INFO',
        'WARNING',
        'ERROR',
        'NONE',
      ];
      const actualLogLevels = Object.values(LogLevel).filter(
        (value) => typeof value === 'string'
      );
      expect(actualLogLevels).to.have.members(expectedLogLevels);
    } catch (error) {
      return {
        testName: 'testConsoleLoggingLevels',
        success: false,
        message: error.toString,
        data: undefined,
      };
    }
    return {
      testName: 'testConsoleLoggingLevels',
      success: true,
      message: 'success',
      data: undefined,
    };
  }
}
