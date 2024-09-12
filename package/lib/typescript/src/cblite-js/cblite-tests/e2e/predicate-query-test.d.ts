import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
/**
 * PredicateQueryTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export declare class PredicateQueryTests extends TestCase {
    constructor();
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
//# sourceMappingURL=predicate-query-test.d.ts.map