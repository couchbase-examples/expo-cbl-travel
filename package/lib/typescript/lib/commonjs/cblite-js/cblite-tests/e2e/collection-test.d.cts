export const __esModule: boolean;
/**
 * CollectionTests - reminder all test cases must start with 'test' in the name of the method, or they will not run
 * */
export class CollectionTests extends _testCase.TestCase {
    /**
     * This method tests to validate that the default collection exists
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDefaultCollectionExists(): Promise<ITestResult>;
    /**
     * This method tests to validate that the default scope exists
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDefaultScopeExists(): Promise<ITestResult>;
    /**
     * This method tests to validate that the default scope exists
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetNonExistingDoc(): Promise<ITestResult>;
    /**
     * This method tests to validate you can not delete the default collection
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDeleteDefaultCollection(): Promise<ITestResult>;
    /**
     * This method tests to validate you can not delete the default collection
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetDefaultScopeDeleteDefaultCol(): Promise<ITestResult>;
    /**
     * This method tests the collection full name property
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCollectionFullName(): Promise<ITestResult>;
    /**
     * This method tests getting the database back from a give collection
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCollectionDatabase(): Promise<ITestResult>;
    /**
     * This method tests getting the database back from a given scope
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testScopeDatabase(): Promise<ITestResult>;
    /**
     * This method tests create and getting collections from default scope
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCreateAndGetColsInDefaultScope(): Promise<ITestResult>;
    /**
     * This method tests create and getting collections from named scope
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCreateAndGetColsInNamedScope(): Promise<ITestResult>;
    /**
     * This method tests create and getting collections from named scope
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCreateAnExistingCollection(): Promise<ITestResult>;
    /**
     * This method tests deleting a collection
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDeleteCollection(): Promise<ITestResult>;
    /**
     * This method tests getting a collection from scope
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetCollectionsFromScope(): Promise<ITestResult>;
    /**
     * This method tests deleting all collections in a given scope
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDeleteAllCollectionsInScope(): Promise<ITestResult>;
    /**
     * This method tests creating collections with valid characters in the name and scope name
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testScopeCollectionNameWithValidChars(): Promise<ITestResult>;
    /**
     * This method tests deleting all collections in a given scope
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testScopeCollectionNameWithIllegalChars(): Promise<ITestResult>;
    /**
     * This method tests case-sensitive collection names
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCollectionNameCaseSensitive(): Promise<ITestResult>;
    /**
     * This method tests case-sensitive scope names
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testScopeNameCaseSensitive(): Promise<ITestResult>;
    /**
     * This method creates a new document with a predefined ID and name, saves it to the collection,
     * and then verifies the document by comparing it with the expected data.
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testColCreateDocument(): Promise<ITestResult>;
    /**
     * This method creates a new document with a predefined ID and name, saves it to the collection,
     * and then deletes the document and validates the document is no longer in the collection
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testColDeleteDocument(): Promise<ITestResult>;
    /**
     * This method tests creating documents with an ID and then
     * make sure the document was saved
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testColSaveDocWithId(): Promise<ITestResult>;
    /**
     * This method tests creating documents with weird special characters
     * in the documentId to make sure the Javascript to Native Bridge
     * doesn't eat the characters and the document is saved correctly.
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testColSaveDocSpecialCharacters(): Promise<ITestResult>;
    /**
     * This method tests updating documents multiple times and then
     * verifying the document sequence number
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testColSaveSameDocTwice(): Promise<ITestResult>;
    /**
     * This method tests creating and then updating the same document
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testColCreateAndUpdateMutableDoc(): Promise<ITestResult>;
    testDeletePreSaveDoc(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testDeleteSameDocTwice(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testDeleteNoneExistingDoc(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testPurgePreSaveDoc(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testPurgeDoc(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testPurgeSameDocTwice(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testPurgeDocumentOnADeletedDocument(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    /**
     * This method tests custom conflict resolution by creating a document,
     * updating it, and then testing if the update worked based on the
     * ConcurrencyControl parameter passed in.
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testColSaveDocWithConflict(): Promise<ITestResult>;
    /**
     * This is a helper method used to test ConcurrencyControl
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    saveDocWithConflict(methodName: any, control: any): Promise<ITestResult>;
    isErrorCreatingCollection(name: any, scopeName: any): Promise<boolean>;
}
import _testCase = require("./test-case.cjs");
//# sourceMappingURL=collection-test.d.cts.map