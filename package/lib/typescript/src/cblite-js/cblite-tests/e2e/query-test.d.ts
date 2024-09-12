import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
import { Collection, Query } from '../../cblite';
/**
 * QueryTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export declare class QueryTests extends TestCase {
    constructor();
    testQueryDefaultCollection(): Promise<ITestResult>;
    testQueryDefaultScope(): Promise<ITestResult>;
    testQueryCollection(): Promise<ITestResult>;
    testQueryInvalidCollection(): Promise<ITestResult>;
    testJoinWithCollections(): Promise<ITestResult>;
    testFTSWithFTSIndexDefaultCol(): Promise<ITestResult>;
    testFTSWithFTSIndexNamedCol(): Promise<ITestResult>;
    testFtsJoinCollection(): Promise<ITestResult>;
    testSelectAllResultKey(): Promise<ITestResult>;
    testQueryDateParameter(): Promise<ITestResult>;
    testQueryStringParameter(): Promise<ITestResult>;
    testQueryDoubleSmallParameter(): Promise<ITestResult>;
    testQueryDoubleBigParameter(): Promise<ITestResult>;
    testQueryLongSmallParameter(): Promise<ITestResult>;
    testQueryLongBigParameter(): Promise<ITestResult>;
    testQueryLongZeroParameter(): Promise<ITestResult>;
    testQueryBooleanTrueParameter(): Promise<ITestResult>;
    testQueryBooleanFalseParameter(): Promise<ITestResult>;
    testQueryValueParameter(): Promise<ITestResult>;
    runQueryParameterTest(query: Query, paraName: string, paraValue: any, testName: string): Promise<ITestResult>;
    queryCollectionNamesData(collection: Collection, queries: string[], testName: string): Promise<ITestResult>;
}
//# sourceMappingURL=query-test.d.ts.map