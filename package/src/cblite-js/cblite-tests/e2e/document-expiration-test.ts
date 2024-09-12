import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';

/**
 * DocumentExpirationTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class DocumentExpirationTests extends TestCase {
  constructor() {
    super();
  }
  /**
   * This test get's the expiration of a document before saving to
   * test the default
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetExpirationPreSave(): Promise<ITestResult> {
    return {
      testName: 'testGetExpirationPreSave',
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
  async testExpirationFromDocumentWithoutExpiry(): Promise<ITestResult> {
    return {
      testName: 'testExpirationFromDocumentWithoutExpiry',
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
  async testSetAndGetExpiration(): Promise<ITestResult> {
    return {
      testName: 'testSetAndGetExpiration',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetExpiryToNonExistingDocument(): Promise<ITestResult> {
    return {
      testName: 'testSetExpiryToNonExistingDocument',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentPurgingAfterSettingExpiry(): Promise<ITestResult> {
    return {
      testName: 'testDocumentPurgingAfterSettingExpiry',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentPurgedAfterExpiration(): Promise<ITestResult> {
    return {
      testName: 'testDocumentPurgedAfterExpiration',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentNotShownUpInQueryAfterExpiration(): Promise<ITestResult> {
    return {
      testName: 'testDocumentNotShownUpInQueryAfterExpiration',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentNotPurgedBeforeExpiration(): Promise<ITestResult> {
    return {
      testName: 'testDocumentNotPurgedBeforeExpiration',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetExpirationThenCloseDatabase(): Promise<ITestResult> {
    return {
      testName: 'testSetExpirationThenCloseDatabase',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testExpiredDocumentPurgedAfterReopenDatabase(): Promise<ITestResult> {
    return {
      testName: 'testExpiredDocumentPurgedAfterReopenDatabase',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testOverrideExpirationWithFartherDate(): Promise<ITestResult> {
    return {
      testName: 'testOverrideExpirationWithFartherDate',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testOverrideExpirationWithCloserDate(): Promise<ITestResult> {
    return {
      testName: 'testOverrideExpirationWithCloserDate',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRemoveExpirationDate(): Promise<ITestResult> {
    return {
      testName: 'testRemoveExpirationDate',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetExpirationThenDeletionAfterwards(): Promise<ITestResult> {
    return {
      testName: 'testSetExpirationThenDeletionAfterwards',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testPurgeImmedietly(): Promise<ITestResult> {
    return {
      testName: 'testPurgeImmedietly',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }
}
