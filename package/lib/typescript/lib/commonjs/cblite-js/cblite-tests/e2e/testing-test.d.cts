export const __esModule: boolean;
/**
 * TestingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class TestingTests extends _testCase.TestCase {
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
    testRunnerThreeSeconds(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testRunnerFiveSeconds(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testRunnerSevenSeconds(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
}
import _testCase = require("./test-case.cjs");
//# sourceMappingURL=testing-test.d.cts.map