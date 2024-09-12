export const __esModule: boolean;
/**
 * QueryTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class QueryTests extends _testCase.TestCase {
    testQueryDefaultCollection(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryDefaultScope(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryCollection(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryInvalidCollection(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testJoinWithCollections(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testFTSWithFTSIndexDefaultCol(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testFTSWithFTSIndexNamedCol(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testFtsJoinCollection(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testSelectAllResultKey(): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryDateParameter(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryStringParameter(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryDoubleSmallParameter(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryDoubleBigParameter(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryLongSmallParameter(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryLongBigParameter(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryLongZeroParameter(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryBooleanTrueParameter(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryBooleanFalseParameter(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    testQueryValueParameter(): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    runQueryParameterTest(query: any, paraName: any, paraValue: any, testName: any): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
    queryCollectionNamesData(collection: any, queries: any, testName: any): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: any;
    }>;
}
import _testCase = require("./test-case.cjs");
//# sourceMappingURL=query-test.d.cts.map