/**
 * CustomLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class CustomLoggingTests extends TestCase {
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
import { TestCase } from "./test-case.mjs";
//# sourceMappingURL=custom-logging-test.d.mts.map