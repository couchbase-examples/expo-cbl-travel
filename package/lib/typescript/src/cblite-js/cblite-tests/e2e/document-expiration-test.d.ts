import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
/**
 * DocumentExpirationTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export declare class DocumentExpirationTests extends TestCase {
    constructor();
    /**
     * This test get's the expiration of a document before saving to
     * test the default
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetExpirationPreSave(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testExpirationFromDocumentWithoutExpiry(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetAndGetExpiration(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetExpiryToNonExistingDocument(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDocumentPurgingAfterSettingExpiry(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDocumentPurgedAfterExpiration(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDocumentNotShownUpInQueryAfterExpiration(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDocumentNotPurgedBeforeExpiration(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetExpirationThenCloseDatabase(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testExpiredDocumentPurgedAfterReopenDatabase(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testOverrideExpirationWithFartherDate(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testOverrideExpirationWithCloserDate(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testRemoveExpirationDate(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetExpirationThenDeletionAfterwards(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testPurgeImmedietly(): Promise<ITestResult>;
}
//# sourceMappingURL=document-expiration-test.d.ts.map