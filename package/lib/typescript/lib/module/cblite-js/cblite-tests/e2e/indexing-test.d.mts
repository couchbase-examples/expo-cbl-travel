/**
 * IndexingTests - reminder all test cases must start with 'test' in the name of the method, or they will not run
 * */
export class IndexingTests extends TestCase {
    indexName: string;
    /**
     * This is a test that creates an index and then verifies that the index
     * was created.
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCreateIndex(): Promise<ITestResult>;
    /**
     * This is a test that creates an FTS index and then verifies that the index
     * was created.
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testFullTextIndexExpression(): Promise<ITestResult>;
    /**
     * This is a test that test making an index twice and making sure
     * that we get an error and don't crash the app.
     * was created.
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCreateSameIndexTwice(): Promise<ITestResult>;
    /**
     * This is a test that tests deleting an index
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testDeleteIndex(): Promise<ITestResult>;
}
import { TestCase } from "./test-case.mjs";
//# sourceMappingURL=indexing-test.d.mts.map