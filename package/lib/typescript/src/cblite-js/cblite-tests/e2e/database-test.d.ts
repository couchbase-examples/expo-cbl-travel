import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
import { ConcurrencyControl } from '../../cblite';
/**
 * DatabaseTests - reminder all test cases must start with 'test' in the name of the method, or they will not run
 * */
export declare class DatabaseTests extends TestCase {
    constructor();
    /**
     * This method creates a new document with a predefined ID and name, saves it to the database,
     * and then verifies the document by comparing it with the expected data.
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCreateDocument(): Promise<ITestResult>;
    /**
     * This method creates a new document with a predefined ID and name, saves it to the database,
     * and then deletes the document and validates the document is no longer in the database
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDeleteDocument(): Promise<ITestResult>;
    /**
     * This method tests the properties of a database
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDatabaseProperties(): Promise<ITestResult>;
    /**
     * This method tests creating documents with an ID and then
     * make sure the document was saved
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSaveDocWithId(): Promise<ITestResult>;
    /**
     * This method tests creating documents with weird special characters
     * in the documentId to make sure the Javascript to Native Bridge
     * doesn't eat the characters and the document is saved correctly.
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSaveDocWithSpecialCharactersDocID(): Promise<ITestResult>;
    /**
     * This method tests updating documents multiple times and then
     * verifying the document sequence number
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSaveSameDocTwice(): Promise<ITestResult>;
    /**
     * This method tests creating and then updating the same document
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCreateAndUpdateMutableDoc(): Promise<ITestResult>;
    /**
     * This method tests custom conflict resolution by creating a document,
     * updating it, and then testing if the update worked based on the
     * ConcurrencyControl parameter passed in.
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSaveDocWithConflict(): Promise<ITestResult>;
    testDefaultDatabaseConfiguration(): Promise<ITestResult>;
    testDatabaseEncryptionChangeKey(): Promise<ITestResult>;
    testCopyingDatabaseConfiguration(): Promise<ITestResult>;
    testCopyingDatabase(): Promise<ITestResult>;
    /**
     * This method tests running compact on a database
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testPerformMaintenanceCompact(): Promise<ITestResult>;
    /**
     * This method tests adding many documents to a database, then cleaning
     * up and trying again to validate that the init process works and the
     * database isn't the same database file.
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSaveManyDocs(): Promise<ITestResult>;
    /**
     * This is a helper method used to test ConcurrencyControl
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    saveDocWithConflict(methodName: string, control: ConcurrencyControl | undefined): Promise<ITestResult>;
}
//# sourceMappingURL=database-test.d.ts.map