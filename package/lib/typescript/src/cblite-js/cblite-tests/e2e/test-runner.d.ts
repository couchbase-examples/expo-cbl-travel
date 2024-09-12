import { ITestResult } from './test-result.types';
import { TestCase } from './test-case';
export declare class TestRunner {
    runTests<T extends TestCase>(testCase: new () => T, cancelToken: () => boolean): AsyncGenerator<ITestResult, void, unknown>;
}
//# sourceMappingURL=test-runner.d.ts.map