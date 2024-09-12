/**
 * PredicateQueryTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class PredicateQueryTests extends TestCase {
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testAllDocs(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testNoWhereQuery(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testPropertyQuery(): Promise<ITestResult>;
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testProjection(): Promise<ITestResult>;
}
import { TestCase } from "./test-case.mjs";
//# sourceMappingURL=predicate-query-test.d.mts.map