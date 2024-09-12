export class TestCase {
    database: any;
    otherDatabase: any;
    databaseName: string;
    otherDatabaseName: string;
    scopeName: string;
    collectionName: string;
    collection: any;
    defaultCollection: any;
    scope: any;
    directory: any;
    dataSource: string;
    TEST_DOC_TAG_KEY: string;
    TEST_DOC_SORT_KEY: string;
    TEST_DOC_REV_SORT_KEY: string;
    init(): Promise<{
        testName: string;
        success: boolean;
        message: any;
        data: any;
    }>;
    tearDown(): Promise<void>;
    deleteDatabase(db: any): Promise<{
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    getPlatformPath(): Promise<{
        testName: string;
        success: boolean;
        message: any;
        data: any;
    } | {
        testName: string;
        success: boolean;
        message: string;
        data: any;
    }>;
    getDatabase(name: any, path: any, encryptionKey: any): Promise<string | Database>;
    createDocument(id: any): MutableDocument;
    createDocumentWithId(withId: any): Promise<MutableDocument>;
    createCollectionDocumentWithId(withId: any, withCollection: any): Promise<MutableDocument>;
    createDocumentWithIdAndData(id: any, data: any): MutableDocument;
    createDocumentNumbered(start: any, end: any): MutableDocument[];
    createDocs(methodName: any, number: any): Promise<MutableDocument[]>;
    createCollectionDocs(methodName: any, withCollection: any, number: any): Promise<MutableDocument[]>;
    createTestDoc(id: any, top: any, tag: any): MutableDocument;
    jsonFromDate(date: any): any;
    loadDocuments(numberOfDocs: any): Promise<void>;
    loadDocumentsIntoCollection(numberOfDocs: any, collection: any): Promise<void>;
    loadDocumentsStartStopByCollection(start: any, stop: any, collection: any): Promise<void>;
    loadNamesData(collection: any): Promise<void>;
    verifyDocs(testName: any, number: any): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: string;
    }>;
    verifyCollectionDocs(testName: any, withCollection: any, number: any): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: string;
    }>;
    verifyDoc(testName: any, withId: any, withData: any): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: string;
    }>;
    verifyCollectionDoc(testName: any, withId: any, withCollection: any, withData: any): Promise<{
        testName: any;
        success: boolean;
        message: string;
        data: string;
    }>;
    getCollectionDocumentCount(): Promise<number>;
    getDocumentCount(): Promise<number>;
    sleep(ms: any): Promise<any>;
    getEngine(): any;
}
import { Database } from "../../cblite/index.mjs";
import { MutableDocument } from "../../cblite/index.mjs";
//# sourceMappingURL=test-case.d.mts.map