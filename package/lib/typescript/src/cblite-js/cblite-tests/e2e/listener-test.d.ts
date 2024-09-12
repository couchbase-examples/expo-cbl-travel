import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
/**
 * ListenerTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export declare class ListenerTests extends TestCase {
    constructor();
    /**
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testCollectionChange(): Promise<ITestResult>;
}
//# sourceMappingURL=listener-test.d.ts.map