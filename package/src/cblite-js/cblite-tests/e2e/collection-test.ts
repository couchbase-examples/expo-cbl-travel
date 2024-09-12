import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
import { assert, expect } from 'chai';
import { ConcurrencyControl, Database, MutableDocument } from '../../cblite';

/**
 * CollectionTests - reminder all test cases must start with 'test' in the name of the method, or they will not run
 * */
export class CollectionTests extends TestCase {
  constructor() {
    super();
  }

  /**
   * This method tests to validate that the default collection exists
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDefaultCollectionExists(): Promise<ITestResult> {
    const collection = await this.database?.defaultCollection();
    expect(collection.name).to.equal(Database.defaultCollectionName);
    return {
      testName: 'testDefaultCollectionExists',
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  /**
   * This method tests to validate that the default scope exists
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDefaultScopeExists(): Promise<ITestResult> {
    const scope = await this.database?.defaultScope();
    expect(scope.name).to.equal(Database.defaultScopeName);
    return {
      testName: 'testDefaultScopeExists',
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  /**
   * This method tests to validate that the default scope exists
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetNonExistingDoc(): Promise<ITestResult> {
    try {
      const collection = await this.database?.defaultCollection();
      const doc = await collection?.document('nonExistingDoc');
      expect(doc).to.equal(undefined);
      return {
        testName: 'testGetNonExistingDoc',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testGetNonExistingDoc',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests to validate you can not delete the default collection
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDeleteDefaultCollection(): Promise<ITestResult> {
    try {
      const defaultCollection = await this.database?.defaultCollection();
      await this.database?.deleteCollection(defaultCollection);

      return {
        testName: 'testDeleteDefaultCollection',
        success: false,
        message: 'Expected error when deleting default collection',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testDeleteDefaultCollection',
        success: true,
        message: 'success',
        data: undefined,
      };
    }
  }

  /**
   * This method tests to validate you can not delete the default collection
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetDefaultScopeDeleteDefaultCol(): Promise<ITestResult> {
    const defaultCollection = await this.database?.defaultCollection();
    try {
      await this.database?.deleteCollection(defaultCollection);
      return {
        testName: 'testGetDefaultScopeDeleteDefaultCol',
        success: false,
        message: 'Expected error when deleting default collection',
        data: undefined,
      };
    } catch (error) {
      expect(defaultCollection).to.not.be.null;
      expect(defaultCollection.name).to.equal(Database.defaultCollectionName);
      expect(defaultCollection.scope.name).to.equal(Database.defaultScopeName);

      const defaultCollection2 = await this.database?.createCollection(
        Database.defaultCollectionName,
        Database.defaultScopeName
      );
      expect(defaultCollection2).to.not.be.null;
      expect(defaultCollection2.name).to.equal(Database.defaultCollectionName);
      expect(defaultCollection2.scope.name).to.equal(Database.defaultScopeName);

      return {
        testName: 'testGetDefaultScopeDeleteDefaultCol',
        success: true,
        message: 'success',
        data: undefined,
      };
    }
  }

  /**
   * This method tests the collection full name property
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCollectionFullName(): Promise<ITestResult> {
    try {
      // 3.1 TestGetFullNameFromDefaultCollection
      const defaultCollection = await this.database?.defaultCollection();
      expect(defaultCollection.fullName()).to.equal('_default._default');

      // 3.2 TestGetFullNameFromNewCollectionInDefaultScope
      const col2 = await this.database?.createCollection('colA');
      expect(col2).to.not.be.null;
      expect(col2.fullName()).to.equal('_default.colA');

      // 3.3 TestGetFullNameFromNewCollectionInCustomScope
      const col3 = await this.database?.createCollection('colA', 'scopeA');
      expect(col3).to.not.be.null;
      expect(col3.fullName()).to.equal('scopeA.colA');

      // 3.4 TestGetFullNameFromExistingCollectionInDefaultScope
      const col4 = await this.database?.collection('colA');
      expect(col4).to.not.be.null;
      expect(col4.fullName()).to.equal('_default.colA');

      // 3.5 TestGetFullNameFromNewCollectionInCustomScope
      const col5 = await this.database?.collection('colA', 'scopeA');
      expect(col5).to.not.be.null;
      expect(col5.fullName()).to.equal('scopeA.colA');

      return {
        testName: 'testCollectionFullName',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCollectionFullName',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests getting the database back from a give collection
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCollectionDatabase(): Promise<ITestResult> {
    try {
      // 3.1 TestGetDatabaseFromNewCollection
      const col1 = await this.database?.createCollection('colA', 'scopeA');
      expect(col1).to.not.be.null;
      expect(col1.database).to.equal(this.database);

      // 3.2 TestGetDatabaseFromExistingCollection
      const col2 = await this.database?.collection('colA', 'scopeA');
      expect(col2).to.not.be.null;
      expect(col2.database).to.equal(this.database);

      return {
        testName: 'testCollectionDatabase',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCollectionDatabase',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests getting the database back from a given scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testScopeDatabase(): Promise<ITestResult> {
    try {
      // 3.1 TestGetDatabaseFromScopeObtainedFromCollection
      const col1 = await this.database?.createCollection('colA', 'scopeA');
      expect(col1).to.not.be.null;
      expect(col1.scope.database).to.equal(this.database);

      // 3.2 TestGetDatabaseFromExistingScope
      const scope = await this.database?.scope('scopeA');
      expect(scope).to.not.be.null;
      expect(scope.database).to.equal(this.database);

      return {
        testName: 'testScopeDatabase',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testScopeDatabase',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests create and getting collections from default scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateAndGetColsInDefaultScope(): Promise<ITestResult> {
    try {
      const colA = await this.database?.createCollection('colA');
      const colB = await this.database?.createCollection(
        'colB',
        Database.defaultScopeName
      );
      expect(colA).to.not.be.null;
      expect(colA.scope.name).to.be.equal(Database.defaultScopeName);
      expect(colB).to.not.be.null;
      expect(colB.scope.name).to.be.equal(Database.defaultScopeName);

      const colAa = await this.database?.collection('colA');
      expect(colAa).to.not.be.null;
      expect(colA.name).to.be.equal(colAa.name);
      expect(colA.scope.name).to.be.equal(colAa.scope.name);

      const colBa = await this.database?.collection('colB');
      expect(colBa).to.not.be.null;
      expect(colB.name).to.be.equal(colBa.name);
      expect(colB.scope.name).to.be.equal(colBa.scope.name);

      const collections = await this.database?.collections();
      expect(collections.length).to.equal(3);
      const hasConA = collections.some(
        (collection) => collection.name === 'colA'
      );
      expect(hasConA).to.be.true;
      const hasConB = collections.some(
        (collection) => collection.name === 'colB'
      );
      expect(hasConB).to.be.true;

      return {
        testName: 'testCreateAndGetColsInDefaultScope',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCreateAndGetColsInDefaultScope',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests create and getting collections from named scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateAndGetColsInNamedScope(): Promise<ITestResult> {
    try {
      const colAName = 'colA';
      const scopeAName = 'scopeA';
      const noScope = await this.database?.scope(scopeAName);
      expect(noScope).to.equal(undefined);

      const colA = await this.database?.createCollection(colAName, scopeAName);
      expect(colA.scope.name).to.be.equal(scopeAName);
      expect(colA.name).to.be.equal(colAName);

      const colAa = await this.database?.collection(colAName, scopeAName);
      expect(colAa.scope.name).to.be.equal(scopeAName);
      expect(colAa.name).to.be.equal(colAName);

      const scopes = await this.database?.scopes();
      expect(scopes.length).to.equal(3);
      const hasScopeA = scopes.some((scope) => scope.name === scopeAName);
      expect(hasScopeA).to.be.true;

      const hasDefaultScope = scopes.some(
        (scope) => scope.name === Database.defaultScopeName
      );
      expect(hasDefaultScope).to.be.true;

      return {
        testName: 'testCreateAndGetColsInNamedScope',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCreateAndGetColsInNamedScope',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests create and getting collections from named scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateAnExistingCollection(): Promise<ITestResult> {
    try {
      const colAName = 'colA';
      const scopeAName = 'scopeA';
      const colA = await this.database?.createCollection(colAName, scopeAName);
      const mDoc = new MutableDocument('doc1');
      mDoc.setString('someKey', 'someValue');
      await colA.save(mDoc);

      const colB = await this.database?.collection(colAName, scopeAName);
      const doc1 = await colB.document('doc1');
      expect(doc1).to.not.be.null;
      expect(doc1.getString('someKey')).to.equal('someValue');
      return {
        testName: 'testCreateAnExistingCollection',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCreateAnExistingCollection',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests deleting a collection
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDeleteCollection(): Promise<ITestResult> {
    try {
      const colAName = 'colA';
      const scopeAName = 'scopeA';
      const colA = await this.database?.createCollection(colAName, scopeAName);

      const mDoc1 = new MutableDocument('doc1');
      mDoc1.setString('someKey', 'someValue');
      await colA.save(mDoc1);

      const mDoc2 = new MutableDocument('doc2');
      mDoc2.setString('someKey2', 'someValue2');
      await colA.save(mDoc2);

      const mDoc3 = new MutableDocument('doc3');
      mDoc3.setString('someKey3', 'someValue3');
      await colA.save(mDoc3);
      const docCount = await colA.count();
      expect(docCount.count).to.equal(3);

      await this.database?.deleteCollection(colA);
      const collections = await this.database?.collections(scopeAName);
      expect(collections.length).to.equal(0);

      const colAa = await this.database?.createCollection(colAName, scopeAName);
      expect(colAa).to.not.be.equal(undefined);
      const colAaDocCount = await colAa?.count();
      expect(colAaDocCount.count).to.be.equal(0);

      return {
        testName: 'testDeleteCollection',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testDeleteCollection',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests getting a collection from scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetCollectionsFromScope(): Promise<ITestResult> {
    try {
      const colAName = 'colA';
      const colBName = 'colB';
      const scopeAName = 'scopeA';
      const colA = await this.database?.createCollection(colAName, scopeAName);
      const colB = await this.database?.createCollection(colBName, scopeAName);
      expect(colA).not.to.be.null;
      expect(colA).not.to.be.equal(undefined);
      expect(colB).not.to.be.null;
      expect(colB).not.to.be.equal(undefined);

      const scopeA = await this.database?.scope(scopeAName);
      const cols = await scopeA.collections();
      expect(cols.length).to.equal(2);
      const hasColA = cols.some((collection) => collection.name === colAName);
      expect(hasColA).to.be.true;
      const hasColB = cols.some((collection) => collection.name === colBName);
      expect(hasColB).to.be.true;

      return {
        testName: 'testGetCollectionsFromScope',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testGetCollectionsFromScope',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests deleting all collections in a given scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDeleteAllCollectionsInScope(): Promise<ITestResult> {
    try {
      const colAName = 'colA';
      const colBName = 'colB';
      const scopeAName = 'scopeA';
      const colA = await this.database?.createCollection(colAName, scopeAName);
      const colB = await this.database?.createCollection(colBName, scopeAName);

      const scopeA = await this.database?.scope(scopeAName);
      const cols = await scopeA.collections();
      expect(cols.length).to.equal(2);

      await this.database.deleteCollection(colA);
      const colsAfterDelete = await scopeA.collections();
      expect(colsAfterDelete.length).to.equal(1);

      await this.database.deleteCollection(colB);
      const colsAfterDeleteB = await scopeA.collections();
      expect(colsAfterDeleteB.length).to.equal(0);

      return {
        testName: 'testDeleteAllCollectionsInScope',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testDeleteAllCollectionsInScope',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests creating collections with valid characters in the name and scope name
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testScopeCollectionNameWithValidChars(): Promise<ITestResult> {
    try {
      const names: string[] = [
        'a',
        'A',
        '0',
        '-',
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_%',
      ];
      for (const name of names) {
        const col = await this.database?.createCollection(name, name);
        expect(col).not.to.be.null;
        expect(col).not.to.be.equal(undefined);

        const col2 = await this.database?.collection(name, name);
        expect(col2).not.to.be.null;
        expect(col2).not.to.be.equal(undefined);
        expect(col.name).to.be.equal(col2.name);
        expect(col.scope.name).to.be.equal(col2.scope.name);
      }
      return {
        testName: 'testScopeCollectionNameWithValidChars',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testScopeCollectionNameWithValidChars',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests deleting all collections in a given scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testScopeCollectionNameWithIllegalChars(): Promise<ITestResult> {
    try {
      const check1 = await this.isErrorCreatingCollection(
        '_',
        Database.defaultScopeName
      );
      expect(check1).to.be.true;

      const check2 = await this.isErrorCreatingCollection('a', '_');
      expect(check2).to.be.true;

      const check3 = await this.isErrorCreatingCollection(
        '%',
        Database.defaultScopeName
      );
      expect(check3).to.be.true;

      const check4 = await this.isErrorCreatingCollection('b', '%');
      expect(check4).to.be.true;

      const badChars = '!@#$^&*()+={}[]<>,.?/:;"\'\\|`~';
      for (const char of badChars) {
        const checkCol = await this.isErrorCreatingCollection(
          `a${char}z`,
          Database.defaultScopeName
        );
        expect(checkCol).to.be.true;
        const checkScope = await this.isErrorCreatingCollection(
          'colA',
          `a${char}z`
        );
        expect(checkScope).to.be.true;
      }
      return {
        testName: 'testScopeCollectionNameWithIllegalChars',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testScopeCollectionNameWithIllegalChars',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests case-sensitive collection names
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCollectionNameCaseSensitive(): Promise<ITestResult> {
    try {
      const colA = await this.database?.createCollection(
        'COLLECTION1',
        'scopeA'
      );
      const colB = await this.database?.createCollection(
        'collection1',
        'scopeA'
      );
      expect(colA.name).to.be.equal('COLLECTION1');
      expect(colB.name).to.be.equal('collection1');
      const cols = await this.database?.collections('scopeA');
      expect(cols.length).to.equal(2);
      const hasColA = cols.some(
        (collection) => collection.name === 'COLLECTION1'
      );
      expect(hasColA).to.be.true;
      const hasColB = cols.some(
        (collection) => collection.name === 'collection1'
      );
      expect(hasColB).to.be.true;
      return {
        testName: 'testCollectionNameCaseSensitive',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCollectionNameCaseSensitive',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests case-sensitive scope names
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testScopeNameCaseSensitive(): Promise<ITestResult> {
    try {
      const colA = await this.database?.createCollection('colA', 'scopeA');
      const colB = await this.database?.createCollection('colA', 'SCOPEa');
      expect(colA.scope.name).to.be.equal('scopeA');
      expect(colB.scope.name).to.be.equal('SCOPEa');
      const scopes = await this.database?.scopes();
      expect(scopes.length).to.equal(4);
      const hasScopeA = scopes.some((scope) => scope.name === 'scopeA');
      expect(hasScopeA).to.be.true;
      const hasScopeB = scopes.some((scope) => scope.name === 'SCOPEa');
      expect(hasScopeB).to.be.true;
      return {
        testName: 'testScopeNameCaseSensitive',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testScopeNameCaseSensitive',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method creates a new document with a predefined ID and name, saves it to the collection,
   * and then verifies the document by comparing it with the expected data.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testColCreateDocument(): Promise<ITestResult> {
    const id = '123';
    const doc = new MutableDocument();
    doc.setId(id);
    doc.setString('name', 'Scott');
    const dic = doc.toDictionary;

    await this.collection?.save(doc);
    return this.verifyCollectionDoc(
      'testColCreateDocument',
      id,
      this.collection,
      JSON.stringify(dic)
    );
  }

  /**
   * This method creates a new document with a predefined ID and name, saves it to the collection,
   * and then deletes the document and validates the document is no longer in the collection
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testColDeleteDocument(): Promise<ITestResult> {
    try {
      const id = '123';
      const doc = new MutableDocument();
      doc.setId(id);
      doc.setString('name', 'Scott');
      await this.collection?.save(doc);
      await this.collection.deleteDocument(doc);
      return {
        testName: 'testColDeleteDocument',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testColDeleteDocument',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests creating documents with an ID and then
   * make sure the document was saved
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testColSaveDocWithId(): Promise<ITestResult> {
    try {
      const docId = 'doc1';
      const doc = await this.createCollectionDocumentWithId(
        docId,
        this.collection
      );
      const count = await this.getCollectionDocumentCount();
      assert.equal(1, count);
      await this.verifyCollectionDoc(
        'testColSaveDocWithId',
        docId,
        this.collection,
        JSON.stringify(doc.toDictionary)
      );
      return {
        testName: 'testColSaveDocWithId',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testColSaveDocWithId',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests creating documents with weird special characters
   * in the documentId to make sure the Javascript to Native Bridge
   * doesn't eat the characters and the document is saved correctly.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testColSaveDocSpecialCharacters(): Promise<ITestResult> {
    try {
      const docId = await this.createCollectionDocumentWithId(
        '~@#$%^&*()_+{}|\\][=-/.,<>?":;',
        this.collection
      );

      const count = await this.getCollectionDocumentCount();
      assert.equal(1, count);
      await this.verifyCollectionDoc(
        'testColSaveDocSpecialCharacters',
        '~@#$%^&*()_+{}|\\][=-/.,<>?":;',
        this.collection,
        JSON.stringify(docId.toDictionary)
      );
      return {
        testName: 'testColSaveDocSpecialCharacters',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testColSaveDocSpecialCharacters',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests updating documents multiple times and then
   * verifying the document sequence number
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testColSaveSameDocTwice(): Promise<ITestResult> {
    try {
      //create document first time
      const docId = await this.createCollectionDocumentWithId(
        'doc1',
        this.collection
      );
      let count = await this.getCollectionDocumentCount();
      assert.equal(1, count);
      //save the same document again to check sequence number
      await this.collection?.save(docId);
      const docSeq2 = await this.collection?.document('doc1');
      count = await this.getCollectionDocumentCount();
      assert.equal(1, count);
      assert.equal(2, docSeq2?.getSequence());
      return {
        testName: 'testColSaveSameDocTwice',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testColSaveSameDocTwice',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests creating and then updating the same document
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testColCreateAndUpdateMutableDoc(): Promise<ITestResult> {
    try {
      const doc = await this.createCollectionDocumentWithId(
        'doc1',
        this.collection
      );
      //update
      doc.setString('firstName', 'Steve');
      await this.collection?.save(doc);
      let count = await this.getCollectionDocumentCount();
      assert.equal(1, count);

      //update
      doc.setString('lastName', 'Jobs');
      await this.collection?.save(doc);
      count = await this.getCollectionDocumentCount();
      assert.equal(1, count);

      doc.setInt('age', 56);
      await this.collection?.save(doc);
      count = await this.getCollectionDocumentCount();
      assert.equal(1, count);

      //validate saves worked
      const updatedDoc = await this.collection?.document('doc1');
      assert.equal(4, updatedDoc?.getSequence());
      assert.equal('Steve', updatedDoc?.getString('firstName'));
      assert.equal('Jobs', updatedDoc?.getString('lastName'));
      assert.equal(56, updatedDoc?.getString('age'));

      return {
        testName: 'testColCreateAndUpdateMutableDoc',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testColCreateAndUpdateMutableDoc',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testDeletePreSaveDoc(): Promise<ITestResult> {
    try {
      const doc = new MutableDocument('doc1');
      doc.setValue('key', 1);
      await this.collection?.deleteDocument(doc);
    } catch (error) {
      return {
        testName: 'testDeletePreSaveDoc',
        success: true,
        message: 'success',
        data: undefined,
      };
    }
    return {
      testName: 'testDeletePreSaveDoc',
      success: false,
      message:
        'Expected error trying to delete a document that has not been saved',
      data: undefined,
    };
  }

  async testDeleteSameDocTwice(): Promise<ITestResult> {
    try {
      const doc1 = await this.createCollectionDocumentWithId(
        'doc1',
        this.collection
      );

      //first deletion
      await this.collection?.deleteDocument(doc1);
      const count = await this.collection.count();
      expect(count.count).to.equal(0);
      await this.collection.save(doc1);

      //second save
      const doc2 = await this.collection.document('doc1');
      expect(doc2).to.not.be.null;
      expect(doc2).to.not.be.equal(undefined);
      expect(doc2.getSequence()).to.equal(3);

      //second deletion
      await this.collection?.deleteDocument(doc2);
      const secondCount = await this.collection.count();
      expect(secondCount.count).to.equal(0);

      //third save
      await this.collection.save(doc1);
      const doc3 = await this.collection.document('doc1');
      expect(doc3).to.not.be.null;
      expect(doc3).to.not.be.equal(undefined);
      expect(doc3.getSequence()).to.equal(5);
      return {
        testName: 'testDeleteSameDocTwice',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testDeleteSameDocTwice',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testDeleteNoneExistingDoc(): Promise<ITestResult> {
    try {
      const doc1a = await this.createDocumentWithId('doc1');
      const doc1b = await this.defaultCollection.document(doc1a.getId());
      await this.defaultCollection.purge(doc1a);
      const doc1aCount = await this.defaultCollection.count();
      expect(doc1aCount.count).to.equal(0);
      const doc1aa = await this.defaultCollection.document(doc1a.getId());
      expect(doc1aa).to.be.equal(undefined);
      await this.defaultCollection.deleteDocument(doc1b);
    } catch (error) {
      return {
        testName: 'testDeleteNoneExistingDoc',
        success: true,
        message: 'success',
        data: undefined,
      };
    }
    return {
      testName: 'testDeleteNoneExistingDoc',
      success: false,
      message: 'Expected error deleting document that does not exist',
      data: undefined,
    };
  }

  async testPurgePreSaveDoc(): Promise<ITestResult> {
    try {
      const doc = new MutableDocument('doc1');
      await this.defaultCollection.purge(doc);
    } catch (error) {
      return {
        testName: 'testPurgePreSaveDoc',
        success: true,
        message: 'success',
        data: undefined,
      };
    }
    return {
      testName: 'testPurgePreSaveDoc',
      success: false,
      message: "Expected error purging document that hasn't been saved",
      data: undefined,
    };
  }

  async testPurgeDoc(): Promise<ITestResult> {
    try {
      const doc = await this.createDocumentWithId('doc1');
      await this.defaultCollection.purge(doc);
      const doc1 = await this.defaultCollection.document('doc1');
      const count = await this.defaultCollection.count();
      expect(doc1).to.be.equal(undefined);
      expect(count.count).to.be.equal(0);
      return {
        testName: 'testPurgeDoc',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testPurgeDoc',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testPurgeSameDocTwice(): Promise<ITestResult> {
    try {
      const doc = await this.createDocumentWithId('doc1');
      await this.defaultCollection.purge(doc);
      const doc1 = await this.defaultCollection.document('doc1');
      const count = await this.defaultCollection.count();
      expect(doc1).to.be.equal(undefined);
      expect(count.count).to.be.equal(0);
      await this.defaultCollection.purge(doc);
      return {
        testName: 'testPurgeSameDocTwice',
        success: false,
        message: "Expected to throw error purging document that doesn't exist",
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testPurgeSameDocTwice',
        success: true,
        message: 'success',
        data: undefined,
      };
    }
  }

  async testPurgeDocumentOnADeletedDocument(): Promise<ITestResult> {
    try {
      const doc = await this.createDocumentWithId('doc1');
      await this.defaultCollection.deleteDocument(doc);
      await this.defaultCollection.purge(doc);
      const count = await this.defaultCollection.count();
      expect(count.count).to.be.equal(0);
      const doc1 = await this.defaultCollection.document('doc1');
      expect(doc1).to.be.equal(undefined);
      return {
        testName: 'testPurgeDocumentOnADeletedDocument',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testPurgeDocumentOnADeletedDocument',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   * This method tests custom conflict resolution by creating a document,
   * updating it, and then testing if the update worked based on the
   * ConcurrencyControl parameter passed in.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testColSaveDocWithConflict(): Promise<ITestResult> {
    const result1 = await this.saveDocWithConflict(
      'testSaveDocWithConflict',
      undefined
    );
    if (!result1.success) return result1;

    //reset the database
    await this.tearDown();
    await this.init();
    const result2 = await this.saveDocWithConflict(
      'testSaveDocWithConflict',
      ConcurrencyControl.FAIL_ON_CONFLICT
    );
    if (result2.success) {
      return {
        testName: 'testColSaveDocWithConflict',
        success: false,
        message:
          'Expected conflict error with ConcurrencyControl.FAIL_ON_CONFLICT but did not get one',
        data: undefined,
      };
    }
    //reset the database
    await this.tearDown();
    await this.init();
    const result3 = await this.saveDocWithConflict(
      'testSaveDocWithConflict',
      ConcurrencyControl.LAST_WRITE_WINS
    );
    if (!result3.success) return result3;

    return {
      testName: 'testSaveDocWithConflict',
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  /**
   * This is a helper method used to test ConcurrencyControl
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async saveDocWithConflict(
    methodName: string,
    control: ConcurrencyControl | undefined
  ): Promise<ITestResult> {
    try {
      const doc = await this.createCollectionDocumentWithId(
        'doc1',
        this.collection
      );
      doc.setString('firstName', 'Steve');
      doc.setString('lastName', 'Jobs');
      await this.collection.save(doc);

      //get two of the same document
      const doc1a = await this.collection.document('doc1');
      const doc1b = await this.collection.document('doc1');
      const mutableDoc1a = MutableDocument.fromDocument(doc1a);
      const mutableDoc1b = MutableDocument.fromDocument(doc1b);

      mutableDoc1a.setString('lastName', 'Wozniak');
      await this.collection.save(mutableDoc1a);
      mutableDoc1a.setString('nickName', 'The Woz');
      await this.collection.save(mutableDoc1a);
      const updatedDoc1a = await this.collection.document('doc1');
      assert.equal('Wozniak', updatedDoc1a?.getString('lastName'));
      assert.equal('The Woz', updatedDoc1a?.getString('nickName'));
      assert.equal('Steve', updatedDoc1a?.getString('firstName'));
      assert.equal(4, updatedDoc1a?.getSequence());
      if (control === undefined) {
        await this.collection.save(mutableDoc1b);
      } else {
        await this.collection.save(mutableDoc1b, control);
      }
      const updatedDoc1b = await this.collection.document('doc1');
      assert.equal(
        mutableDoc1b.getString('lastName'),
        updatedDoc1b.getString('lastName')
      );
      assert.equal(5, updatedDoc1b.getSequence());
      return {
        testName: methodName,
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: methodName,
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async isErrorCreatingCollection(
    name: string,
    scopeName: string
  ): Promise<boolean> {
    try {
      await this.database?.createCollection(name, scopeName);
    } catch (error) {
      return true;
    }
    return false;
  }
}
