import {
  Database,
  Collection,
  Scope,
  FileSystem,
  MutableDocument,
  DatabaseConfiguration,
  Dictionary,
  ICoreEngine,
  EngineLocator,
} from '../../cblite';

import { assert } from 'chai';

import { ITestResult } from './test-result.types';
import * as namesData from './names_100.json';

export class TestCase {
  //setup shared properties
  database: Database | undefined = undefined;
  otherDatabase: Database | undefined = undefined;
  databaseName: string = '';
  otherDatabaseName: string = 'otherDb';
  scopeName: string = 'testScope';
  collectionName: string = 'testCollection';
  collection: Collection | undefined = undefined;
  defaultCollection: Collection | undefined = undefined;
  scope: Scope | undefined = undefined;
  directory: string | undefined = undefined;
  dataSource: string = this.scopeName + '.' + this.collectionName;

  private TEST_DOC_TAG_KEY: string = 'TEST_TAG';
  private TEST_DOC_SORT_KEY: string = 'TEST_SORT_ASC';
  private TEST_DOC_REV_SORT_KEY: string = 'TEST_SORT_DESC';

  async init(): Promise<ITestResult> {
    try {
      //try to get the platform local directory - can't run tests if we can't save a database to a directory
      //this.databaseName = `db${uuid().toString()}`;
      const engine = this.getEngine();
      this.databaseName = `db${engine.getUUID().replace(/-/g, '')}`;
      const filePathResult = await this.getPlatformPath();
      if (filePathResult.success) {
        this.directory = filePathResult.data;
      } else {
        return {
          testName: 'init',
          success: false,
          message: filePathResult.message,
          data: undefined,
        };
      }

      //create a database and then open it
      const databaseResult = await this.getDatabase(
        this.databaseName,
        this.directory,
        ''
      );
      if (databaseResult instanceof Database) {
        this.database = databaseResult;
        await this.database?.open();
        //setup scope and collection
        this.defaultCollection = await this.database?.defaultCollection();
        this.collection = await this.database.createCollection(
          this.collectionName,
          this.scopeName
        );
        if (
          this.collection === undefined ||
          this.defaultCollection === undefined
        ) {
          return {
            testName: 'init',
            success: false,
            message: 'Failed to create collection',
            data: undefined,
          };
        }
      } else {
        if (typeof databaseResult === 'string') {
          const message = databaseResult as string;
          return {
            testName: 'init',
            success: false,
            message: message,
            data: undefined,
          };
        }
      }
      return {
        testName: 'init',
        success: true,
        message: undefined,
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'init',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async tearDown() {
    if (this.database !== undefined) {
      await this.deleteDatabase(this.database);
      this.database = undefined;
      this.scope = undefined;
      this.collection = undefined;
    }
    if (this.otherDatabase !== undefined) {
      await this.deleteDatabase(this.otherDatabase);
      this.otherDatabase = undefined;
    }
  }

  async deleteDatabase(db: Database): Promise<ITestResult> {
    try {
      await db.deleteDatabase();
      return {
        testName: this.constructor.name + '.deleteDatabase',
        success: true,
        message: undefined,
        data: undefined,
      };
    } catch (error) {
      if (error.errorMessage !== 'No such open database') {
        return {
          testName: this.constructor.name + '.deleteDatabase',
          success: false,
          message: JSON.stringify(error),
          data: undefined,
        };
      } else {
        return {
          testName: this.constructor.name + '.deleteDatabase',
          success: true,
          message: undefined,
          data: undefined,
        };
      }
    }
  }

  async getPlatformPath(): Promise<ITestResult> {
    const pd = new FileSystem();
    try {
      const result: string = await pd.getDefaultPath();
      return {
        testName: this.constructor.name + '.getPlatformPath',
        success: true,
        message: undefined,
        data: result,
      };
    } catch (error) {
      return {
        testName: this.constructor.name + '.getPlatformPath',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async getDatabase(
    name: string,
    path: string | undefined,
    encryptionKey: string | undefined
  ): Promise<Database | string> {
    const config = new DatabaseConfiguration();
    try {
      config.directory = path ?? '';
      config.encryptionKey = encryptionKey ?? '';
      return new Database(name, config);
    } catch (error) {
      return JSON.stringify(error);
    }
  }

  createDocument(id: string): MutableDocument {
    return new MutableDocument(id);
  }
  async createDocumentWithId(withId: string): Promise<MutableDocument> {
    return this.createCollectionDocumentWithId(withId, this.defaultCollection);
  }

  async createCollectionDocumentWithId(
    withId: string,
    withCollection: Collection
  ): Promise<MutableDocument> {
    const doc = new MutableDocument(withId);
    doc.setValue('key', 1);
    await withCollection.save(doc);
    const savedDoc = await withCollection.document(withId);
    assert.equal(savedDoc?.getId(), withId);
    assert.equal(savedDoc?.getSequence(), 1);
    return MutableDocument.fromDocument(savedDoc);
  }

  createDocumentWithIdAndData(id: string, data: Dictionary): MutableDocument {
    const doc = new MutableDocument(id);
    doc.setData(data);
    return doc;
  }

  createDocumentNumbered(start: number, end: number): MutableDocument[] {
    const docs: MutableDocument[] = [];
    for (let counter = start; counter <= end; counter++) {
      const doc = new MutableDocument('doc-' + counter);
      doc.setNumber('number', counter);
      docs.push(doc);
    }
    return docs;
  }

  async createDocs(
    methodName: string,
    number: number
  ): Promise<MutableDocument[]> {
    const docs = this.createDocumentNumbered(1, number);
    try {
      for (const doc of docs) {
        await this.database?.save(doc);
      }
    } catch (error) {
      throw new Error(`Can't create docs: ${JSON.stringify(error)}`);
    }
    return docs;
  }

  async createCollectionDocs(
    methodName: string,
    withCollection: Collection,
    number: number
  ): Promise<MutableDocument[]> {
    const docs = this.createDocumentNumbered(1, number);
    try {
      for (const doc of docs) {
        await withCollection.save(doc);
      }
    } catch (error) {
      throw new Error(
        `Call to ${methodName} failed: Can't create collection docs in collection ${withCollection.name}: ${JSON.stringify(error)}`
      );
    }
    return docs;
  }

  createTestDoc(id: number, top: number, tag: string): MutableDocument {
    const mDoc = new MutableDocument(`doc-${id}`);
    mDoc.setValue('nullValue', null);
    mDoc.setValue('dataValue', 'value');
    mDoc.setBoolean('booleanTrue', true);
    mDoc.setBoolean('booleanFalse', false);
    mDoc.setLong('longZero', 0);
    mDoc.setLong('longBig', 4000000000);
    mDoc.setLong('longSmall', -4000000000);
    mDoc.setDouble('doubleBig', 1.0e200);
    mDoc.setDouble('doubleSmall', -1.0e200);
    mDoc.setString('stringNull', null);
    mDoc.setString('stringPunk', 'Jett');
    mDoc.setDate('dateNull', null);
    mDoc.setDate('dateCB', new Date('2020-01-01T00:00:00.000Z'));
    mDoc.setBlob('blobNull', null);
    mDoc.setString(this.TEST_DOC_TAG_KEY, tag);
    mDoc.setLong(this.TEST_DOC_SORT_KEY, id);
    mDoc.setLong(this.TEST_DOC_REV_SORT_KEY, top - id);
    return mDoc;
  }

  jsonFromDate(date: Date): string {
    const isoDate = date.toISOString();
    return isoDate;
  }

  async loadDocuments(numberOfDocs: number): Promise<void> {
    await this.loadDocumentsIntoCollection(
      numberOfDocs,
      this.defaultCollection
    );
  }

  async loadDocumentsIntoCollection(
    numberOfDocs: number,
    collection: Collection
  ): Promise<void> {
    await this.loadDocumentsStartStopByCollection(1, numberOfDocs, collection);
  }

  async loadDocumentsStartStopByCollection(
    start: number,
    stop: number,
    collection: Collection
  ): Promise<void> {
    try {
      const last = start + stop - 1;
      for (let counter = start; counter <= stop; counter++) {
        let doc = this.createTestDoc(counter, last, 'no-tag');
        await collection.save(doc);
      }
    } catch (error) {
      throw new Error(`Can't create docs: ${JSON.stringify(error)}`);
    }
  }

  async loadNamesData(collection: Collection) {
    const docs = namesData;
    let count = 0;
    // @ts-ignore
    for (const doc of docs.default) {
      const mutableDoc = new MutableDocument(
        `doc-${count.toString()}`,
        null,
        doc
      );
      await collection.save(mutableDoc);
      count++;
    }
  }

  async verifyDocs(testName: string, number: number): Promise<ITestResult> {
    return this.verifyCollectionDocs(testName, this.defaultCollection, number);
  }

  async verifyCollectionDocs(
    testName: string,
    withCollection: Collection,
    number: number
  ): Promise<ITestResult> {
    try {
      for (let counter = 1; counter <= number; counter++) {
        const id = 'doc-' + counter;
        const doc = await withCollection.document(id);
        const dictionary = doc.toDictionary();
        const json = JSON.stringify(dictionary);
        const verify = await this.verifyCollectionDoc(
          testName,
          id,
          withCollection,
          json
        );
        if (!verify.success) {
          return verify;
        }
      }
    } catch (error) {
      return {
        testName: testName,
        success: false,
        message: 'failed',
        data: JSON.stringify(error),
      };
    }
    return {
      testName: testName,
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  async verifyDoc(
    testName: string,
    withId: string,
    withData: string
  ): Promise<ITestResult> {
    return this.verifyCollectionDoc(
      testName,
      withId,
      this.defaultCollection,
      withData
    );
  }

  async verifyCollectionDoc(
    testName: string,
    withId: string,
    withCollection: Collection,
    withData: string
  ): Promise<ITestResult> {
    const doc = await withCollection.document(withId);
    if (doc === undefined && doc === null) {
      return {
        testName: testName,
        success: false,
        message: 'Document not found',
        data: undefined,
      };
    } else {
      if (
        doc?.getId() === withId &&
        JSON.stringify(doc.toDictionary) === withData
      ) {
        return {
          testName: testName,
          success: true,
          message: 'success',
          data: undefined,
        };
      } else {
        return {
          testName: testName,
          success: false,
          message: 'failed',
          data: "id or data doesn't match",
        };
      }
    }
  }

  async getCollectionDocumentCount(): Promise<number> {
    const queryString = `SELECT COUNT(*) as docCount FROM ${this.dataSource}`;
    const query = this.database?.createQuery(queryString);
    const resultSet = await query.execute();
    if (resultSet != null) {
      return Number.parseInt(resultSet[0].docCount, 10);
    }
    return 0;
  }

  async getDocumentCount(): Promise<number> {
    const defaultCollectionName = this.defaultCollection?.name;
    const defaultScopeName = this.defaultCollection?.scope.name;
    const queryString = `SELECT COUNT(*) as docCount FROM ${defaultScopeName}.${defaultCollectionName}`;
    const query = this.database?.createQuery(queryString);
    const resultSet = await query.execute();
    if (resultSet != null) {
      return Number.parseInt(resultSet[0].docCount, 10);
    }
    return 0;
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getEngine(): ICoreEngine {
    return EngineLocator.getEngine(EngineLocator.key);
  }
}
