/**
 * DocumentTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class DocumentTests extends TestCase {
    kTestDate: string;
    kTestBlob: string;
    populateData(doc: any): Promise<void>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCreateDoc(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCreateDocWithID(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCreateDocwithEmptyStringID(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCreateDocWithNullID(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCreateDocWithDict(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetDictionaryContent(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetValueFromNewEmptyDoc(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSaveThenGetFromAnotherDB(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testNoCacheNoLive(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetString(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetString(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetNumber(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetInteger(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetFloat(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetDouble(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetGetMinMaxNumbers(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetGetFloatNumbers(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetBoolean(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetBoolean(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetDate(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetDate(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetBlob(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetBlob(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetDictionary(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetDictionary(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetArray(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetArray(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetNull(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testUpdateDictionaryInArray(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testUpdateNestedArray(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testUpdateArrayInDictionary(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetDictionaryToMultipleKeys(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSetArrayToMultipleKeys(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCount(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testContainsKey(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testRemoveKeys(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testBlob(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testMultipleBlobRead(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testReadingExistingBlob(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testEnumeratingKeys(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testEqualityDifferentDocID(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testEqualityDifferentDB(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testRevisionIDNewDoc(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testRevisionIDExistingDoc(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testJSONNumber(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDocumentToJSON(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testUnsavedMutableDocumentToJSON(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSpecialJSONStrings(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testBlobToJSON(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetBlobFromProps(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testUnsavedBlob(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testGetBlobWithInvalidProps(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testSaveBlobAndCompactDB(): Promise<ITestResult>;
}
import { TestCase } from "./test-case.mjs";
//# sourceMappingURL=document-test.d.mts.map