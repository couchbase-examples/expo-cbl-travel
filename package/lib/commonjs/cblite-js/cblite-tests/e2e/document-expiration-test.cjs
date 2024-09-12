"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocumentExpirationTests = void 0;
var _testCase = require("./test-case.cjs");
/**
 * DocumentExpirationTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
class DocumentExpirationTests extends _testCase.TestCase {
  constructor() {
    super();
  }
  /**
   * This test get's the expiration of a document before saving to
   * test the default
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetExpirationPreSave() {
    return {
      testName: 'testGetExpirationPreSave',
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
  async testExpirationFromDocumentWithoutExpiry() {
    return {
      testName: 'testExpirationFromDocumentWithoutExpiry',
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
  async testSetAndGetExpiration() {
    return {
      testName: 'testSetAndGetExpiration',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetExpiryToNonExistingDocument() {
    return {
      testName: 'testSetExpiryToNonExistingDocument',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentPurgingAfterSettingExpiry() {
    return {
      testName: 'testDocumentPurgingAfterSettingExpiry',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentPurgedAfterExpiration() {
    return {
      testName: 'testDocumentPurgedAfterExpiration',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentNotShownUpInQueryAfterExpiration() {
    return {
      testName: 'testDocumentNotShownUpInQueryAfterExpiration',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentNotPurgedBeforeExpiration() {
    return {
      testName: 'testDocumentNotPurgedBeforeExpiration',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetExpirationThenCloseDatabase() {
    return {
      testName: 'testSetExpirationThenCloseDatabase',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testExpiredDocumentPurgedAfterReopenDatabase() {
    return {
      testName: 'testExpiredDocumentPurgedAfterReopenDatabase',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testOverrideExpirationWithFartherDate() {
    return {
      testName: 'testOverrideExpirationWithFartherDate',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testOverrideExpirationWithCloserDate() {
    return {
      testName: 'testOverrideExpirationWithCloserDate',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRemoveExpirationDate() {
    return {
      testName: 'testRemoveExpirationDate',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetExpirationThenDeletionAfterwards() {
    return {
      testName: 'testSetExpirationThenDeletionAfterwards',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testPurgeImmedietly() {
    return {
      testName: 'testPurgeImmedietly',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }
}
exports.DocumentExpirationTests = DocumentExpirationTests;
//# sourceMappingURL=document-expiration-test.cjs.map