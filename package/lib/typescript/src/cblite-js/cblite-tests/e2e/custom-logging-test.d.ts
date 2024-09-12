import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
/**
 * CustomLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export declare class CustomLoggingTests extends TestCase {
    constructor();
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    customLoggingLevels(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    enableAndDisableCustomLogging(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    nonASCII(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    percentEscape(): Promise<ITestResult>;
}
//# sourceMappingURL=custom-logging-test.d.ts.map