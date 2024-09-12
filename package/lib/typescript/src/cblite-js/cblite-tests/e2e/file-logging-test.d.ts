import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
/**
 * FileLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export declare class FileLoggingTests extends TestCase {
    constructor();
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    fileLoggingLevels(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    fileLoggingDefaultBinaryFormat(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    fileLoggingUsePlainText(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    fileLoggingLogFilename(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    fileLoggingDisableLogging(): Promise<ITestResult>;
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    fileLoggingReEnableLogging(): Promise<ITestResult>;
}
//# sourceMappingURL=file-logging-test.d.ts.map