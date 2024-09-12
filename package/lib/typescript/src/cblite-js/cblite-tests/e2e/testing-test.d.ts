import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
/**
 * TestingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export declare class TestingTests extends TestCase {
    constructor();
    /**
     * This is a sample test that just returns a passing result. It's used to test the test runner.
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testRunnerPass(): Promise<ITestResult>;
    /**
     * This is a sample test that just returns a failed result. It's used to test the test runner.
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testRunnerFail(): Promise<ITestResult>;
    testRunnerThreeSeconds(): Promise<ITestResult>;
    testRunnerFiveSeconds(): Promise<ITestResult>;
    testRunnerSevenSeconds(): Promise<ITestResult>;
}
//# sourceMappingURL=testing-test.d.ts.map