import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
/**
 * ConsoleLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export declare class ConsoleLoggingTests extends TestCase {
    constructor();
    /**
     *
     *
     * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
     */
    testConsoleLoggingLevels(): Promise<ITestResult>;
}
//# sourceMappingURL=console-logging-test.d.ts.map