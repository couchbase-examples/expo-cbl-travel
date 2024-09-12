"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionTests = void 0;
var _testCase = require("./test-case.cjs");
var _chai = require("chai");
var _index = require("../../cblite/index.cjs");
/**
 * CollectionTests - reminder all test cases must start with 'test' in the name of the method, or they will not run
 * */
class CollectionTests extends _testCase.TestCase {
  constructor() {
    super();
  }

  /**
   * This method tests to validate that the default collection exists
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDefaultCollectionExists() {
    const collection = await this.database?.defaultCollection();
    (0, _chai.expect)(collection.name).to.equal(_index.Database.defaultCollectionName);
    return {
      testName: 'testDefaultCollectionExists',
      success: true,
      message: 'success',
      data: undefined
    };
  }

  /**
   * This method tests to validate that the default scope exists
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDefaultScopeExists() {
    const scope = await this.database?.defaultScope();
    (0, _chai.expect)(scope.name).to.equal(_index.Database.defaultScopeName);
    return {
      testName: 'testDefaultScopeExists',
      success: true,
      message: 'success',
      data: undefined
    };
  }

  /**
   * This method tests to validate that the default scope exists
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetNonExistingDoc() {
    try {
      const collection = await this.database?.defaultCollection();
      const doc = await collection?.document('nonExistingDoc');
      (0, _chai.expect)(doc).to.equal(undefined);
      return {
        testName: 'testGetNonExistingDoc',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testGetNonExistingDoc',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests to validate you can not delete the default collection
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDeleteDefaultCollection() {
    try {
      const defaultCollection = await this.database?.defaultCollection();
      await this.database?.deleteCollection(defaultCollection);
      return {
        testName: 'testDeleteDefaultCollection',
        success: false,
        message: 'Expected error when deleting default collection',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testDeleteDefaultCollection',
        success: true,
        message: 'success',
        data: undefined
      };
    }
  }

  /**
   * This method tests to validate you can not delete the default collection
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetDefaultScopeDeleteDefaultCol() {
    const defaultCollection = await this.database?.defaultCollection();
    try {
      await this.database?.deleteCollection(defaultCollection);
      return {
        testName: 'testGetDefaultScopeDeleteDefaultCol',
        success: false,
        message: 'Expected error when deleting default collection',
        data: undefined
      };
    } catch (error) {
      (0, _chai.expect)(defaultCollection).to.not.be.null;
      (0, _chai.expect)(defaultCollection.name).to.equal(_index.Database.defaultCollectionName);
      (0, _chai.expect)(defaultCollection.scope.name).to.equal(_index.Database.defaultScopeName);
      const defaultCollection2 = await this.database?.createCollection(_index.Database.defaultCollectionName, _index.Database.defaultScopeName);
      (0, _chai.expect)(defaultCollection2).to.not.be.null;
      (0, _chai.expect)(defaultCollection2.name).to.equal(_index.Database.defaultCollectionName);
      (0, _chai.expect)(defaultCollection2.scope.name).to.equal(_index.Database.defaultScopeName);
      return {
        testName: 'testGetDefaultScopeDeleteDefaultCol',
        success: true,
        message: 'success',
        data: undefined
      };
    }
  }

  /**
   * This method tests the collection full name property
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCollectionFullName() {
    try {
      // 3.1 TestGetFullNameFromDefaultCollection
      const defaultCollection = await this.database?.defaultCollection();
      (0, _chai.expect)(defaultCollection.fullName()).to.equal('_default._default');

      // 3.2 TestGetFullNameFromNewCollectionInDefaultScope
      const col2 = await this.database?.createCollection('colA');
      (0, _chai.expect)(col2).to.not.be.null;
      (0, _chai.expect)(col2.fullName()).to.equal('_default.colA');

      // 3.3 TestGetFullNameFromNewCollectionInCustomScope
      const col3 = await this.database?.createCollection('colA', 'scopeA');
      (0, _chai.expect)(col3).to.not.be.null;
      (0, _chai.expect)(col3.fullName()).to.equal('scopeA.colA');

      // 3.4 TestGetFullNameFromExistingCollectionInDefaultScope
      const col4 = await this.database?.collection('colA');
      (0, _chai.expect)(col4).to.not.be.null;
      (0, _chai.expect)(col4.fullName()).to.equal('_default.colA');

      // 3.5 TestGetFullNameFromNewCollectionInCustomScope
      const col5 = await this.database?.collection('colA', 'scopeA');
      (0, _chai.expect)(col5).to.not.be.null;
      (0, _chai.expect)(col5.fullName()).to.equal('scopeA.colA');
      return {
        testName: 'testCollectionFullName',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testCollectionFullName',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests getting the database back from a give collection
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCollectionDatabase() {
    try {
      // 3.1 TestGetDatabaseFromNewCollection
      const col1 = await this.database?.createCollection('colA', 'scopeA');
      (0, _chai.expect)(col1).to.not.be.null;
      (0, _chai.expect)(col1.database).to.equal(this.database);

      // 3.2 TestGetDatabaseFromExistingCollection
      const col2 = await this.database?.collection('colA', 'scopeA');
      (0, _chai.expect)(col2).to.not.be.null;
      (0, _chai.expect)(col2.database).to.equal(this.database);
      return {
        testName: 'testCollectionDatabase',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testCollectionDatabase',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests getting the database back from a given scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testScopeDatabase() {
    try {
      // 3.1 TestGetDatabaseFromScopeObtainedFromCollection
      const col1 = await this.database?.createCollection('colA', 'scopeA');
      (0, _chai.expect)(col1).to.not.be.null;
      (0, _chai.expect)(col1.scope.database).to.equal(this.database);

      // 3.2 TestGetDatabaseFromExistingScope
      const scope = await this.database?.scope('scopeA');
      (0, _chai.expect)(scope).to.not.be.null;
      (0, _chai.expect)(scope.database).to.equal(this.database);
      return {
        testName: 'testScopeDatabase',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testScopeDatabase',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests create and getting collections from default scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateAndGetColsInDefaultScope() {
    try {
      const colA = await this.database?.createCollection('colA');
      const colB = await this.database?.createCollection('colB', _index.Database.defaultScopeName);
      (0, _chai.expect)(colA).to.not.be.null;
      (0, _chai.expect)(colA.scope.name).to.be.equal(_index.Database.defaultScopeName);
      (0, _chai.expect)(colB).to.not.be.null;
      (0, _chai.expect)(colB.scope.name).to.be.equal(_index.Database.defaultScopeName);
      const colAa = await this.database?.collection('colA');
      (0, _chai.expect)(colAa).to.not.be.null;
      (0, _chai.expect)(colA.name).to.be.equal(colAa.name);
      (0, _chai.expect)(colA.scope.name).to.be.equal(colAa.scope.name);
      const colBa = await this.database?.collection('colB');
      (0, _chai.expect)(colBa).to.not.be.null;
      (0, _chai.expect)(colB.name).to.be.equal(colBa.name);
      (0, _chai.expect)(colB.scope.name).to.be.equal(colBa.scope.name);
      const collections = await this.database?.collections();
      (0, _chai.expect)(collections.length).to.equal(3);
      const hasConA = collections.some(collection => collection.name === 'colA');
      (0, _chai.expect)(hasConA).to.be.true;
      const hasConB = collections.some(collection => collection.name === 'colB');
      (0, _chai.expect)(hasConB).to.be.true;
      return {
        testName: 'testCreateAndGetColsInDefaultScope',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testCreateAndGetColsInDefaultScope',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests create and getting collections from named scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateAndGetColsInNamedScope() {
    try {
      const colAName = 'colA';
      const scopeAName = 'scopeA';
      const noScope = await this.database?.scope(scopeAName);
      (0, _chai.expect)(noScope).to.equal(undefined);
      const colA = await this.database?.createCollection(colAName, scopeAName);
      (0, _chai.expect)(colA.scope.name).to.be.equal(scopeAName);
      (0, _chai.expect)(colA.name).to.be.equal(colAName);
      const colAa = await this.database?.collection(colAName, scopeAName);
      (0, _chai.expect)(colAa.scope.name).to.be.equal(scopeAName);
      (0, _chai.expect)(colAa.name).to.be.equal(colAName);
      const scopes = await this.database?.scopes();
      (0, _chai.expect)(scopes.length).to.equal(3);
      const hasScopeA = scopes.some(scope => scope.name === scopeAName);
      (0, _chai.expect)(hasScopeA).to.be.true;
      const hasDefaultScope = scopes.some(scope => scope.name === _index.Database.defaultScopeName);
      (0, _chai.expect)(hasDefaultScope).to.be.true;
      return {
        testName: 'testCreateAndGetColsInNamedScope',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testCreateAndGetColsInNamedScope',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests create and getting collections from named scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateAnExistingCollection() {
    try {
      const colAName = 'colA';
      const scopeAName = 'scopeA';
      const colA = await this.database?.createCollection(colAName, scopeAName);
      const mDoc = new _index.MutableDocument('doc1');
      mDoc.setString('someKey', 'someValue');
      await colA.save(mDoc);
      const colB = await this.database?.collection(colAName, scopeAName);
      const doc1 = await colB.document('doc1');
      (0, _chai.expect)(doc1).to.not.be.null;
      (0, _chai.expect)(doc1.getString('someKey')).to.equal('someValue');
      return {
        testName: 'testCreateAnExistingCollection',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testCreateAnExistingCollection',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests deleting a collection
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDeleteCollection() {
    try {
      const colAName = 'colA';
      const scopeAName = 'scopeA';
      const colA = await this.database?.createCollection(colAName, scopeAName);
      const mDoc1 = new _index.MutableDocument('doc1');
      mDoc1.setString('someKey', 'someValue');
      await colA.save(mDoc1);
      const mDoc2 = new _index.MutableDocument('doc2');
      mDoc2.setString('someKey2', 'someValue2');
      await colA.save(mDoc2);
      const mDoc3 = new _index.MutableDocument('doc3');
      mDoc3.setString('someKey3', 'someValue3');
      await colA.save(mDoc3);
      const docCount = await colA.count();
      (0, _chai.expect)(docCount.count).to.equal(3);
      await this.database?.deleteCollection(colA);
      const collections = await this.database?.collections(scopeAName);
      (0, _chai.expect)(collections.length).to.equal(0);
      const colAa = await this.database?.createCollection(colAName, scopeAName);
      (0, _chai.expect)(colAa).to.not.be.equal(undefined);
      const colAaDocCount = await colAa?.count();
      (0, _chai.expect)(colAaDocCount.count).to.be.equal(0);
      return {
        testName: 'testDeleteCollection',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testDeleteCollection',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests getting a collection from scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetCollectionsFromScope() {
    try {
      const colAName = 'colA';
      const colBName = 'colB';
      const scopeAName = 'scopeA';
      const colA = await this.database?.createCollection(colAName, scopeAName);
      const colB = await this.database?.createCollection(colBName, scopeAName);
      (0, _chai.expect)(colA).not.to.be.null;
      (0, _chai.expect)(colA).not.to.be.equal(undefined);
      (0, _chai.expect)(colB).not.to.be.null;
      (0, _chai.expect)(colB).not.to.be.equal(undefined);
      const scopeA = await this.database?.scope(scopeAName);
      const cols = await scopeA.collections();
      (0, _chai.expect)(cols.length).to.equal(2);
      const hasColA = cols.some(collection => collection.name === colAName);
      (0, _chai.expect)(hasColA).to.be.true;
      const hasColB = cols.some(collection => collection.name === colBName);
      (0, _chai.expect)(hasColB).to.be.true;
      return {
        testName: 'testGetCollectionsFromScope',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testGetCollectionsFromScope',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests deleting all collections in a given scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDeleteAllCollectionsInScope() {
    try {
      const colAName = 'colA';
      const colBName = 'colB';
      const scopeAName = 'scopeA';
      const colA = await this.database?.createCollection(colAName, scopeAName);
      const colB = await this.database?.createCollection(colBName, scopeAName);
      const scopeA = await this.database?.scope(scopeAName);
      const cols = await scopeA.collections();
      (0, _chai.expect)(cols.length).to.equal(2);
      await this.database.deleteCollection(colA);
      const colsAfterDelete = await scopeA.collections();
      (0, _chai.expect)(colsAfterDelete.length).to.equal(1);
      await this.database.deleteCollection(colB);
      const colsAfterDeleteB = await scopeA.collections();
      (0, _chai.expect)(colsAfterDeleteB.length).to.equal(0);
      return {
        testName: 'testDeleteAllCollectionsInScope',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testDeleteAllCollectionsInScope',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests creating collections with valid characters in the name and scope name
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testScopeCollectionNameWithValidChars() {
    try {
      const names = ['a', 'A', '0', '-', 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_%'];
      for (const name of names) {
        const col = await this.database?.createCollection(name, name);
        (0, _chai.expect)(col).not.to.be.null;
        (0, _chai.expect)(col).not.to.be.equal(undefined);
        const col2 = await this.database?.collection(name, name);
        (0, _chai.expect)(col2).not.to.be.null;
        (0, _chai.expect)(col2).not.to.be.equal(undefined);
        (0, _chai.expect)(col.name).to.be.equal(col2.name);
        (0, _chai.expect)(col.scope.name).to.be.equal(col2.scope.name);
      }
      return {
        testName: 'testScopeCollectionNameWithValidChars',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testScopeCollectionNameWithValidChars',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests deleting all collections in a given scope
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testScopeCollectionNameWithIllegalChars() {
    try {
      const check1 = await this.isErrorCreatingCollection('_', _index.Database.defaultScopeName);
      (0, _chai.expect)(check1).to.be.true;
      const check2 = await this.isErrorCreatingCollection('a', '_');
      (0, _chai.expect)(check2).to.be.true;
      const check3 = await this.isErrorCreatingCollection('%', _index.Database.defaultScopeName);
      (0, _chai.expect)(check3).to.be.true;
      const check4 = await this.isErrorCreatingCollection('b', '%');
      (0, _chai.expect)(check4).to.be.true;
      const badChars = '!@#$^&*()+={}[]<>,.?/:;"\'\\|`~';
      for (const char of badChars) {
        const checkCol = await this.isErrorCreatingCollection(`a${char}z`, _index.Database.defaultScopeName);
        (0, _chai.expect)(checkCol).to.be.true;
        const checkScope = await this.isErrorCreatingCollection('colA', `a${char}z`);
        (0, _chai.expect)(checkScope).to.be.true;
      }
      return {
        testName: 'testScopeCollectionNameWithIllegalChars',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testScopeCollectionNameWithIllegalChars',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests case-sensitive collection names
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCollectionNameCaseSensitive() {
    try {
      const colA = await this.database?.createCollection('COLLECTION1', 'scopeA');
      const colB = await this.database?.createCollection('collection1', 'scopeA');
      (0, _chai.expect)(colA.name).to.be.equal('COLLECTION1');
      (0, _chai.expect)(colB.name).to.be.equal('collection1');
      const cols = await this.database?.collections('scopeA');
      (0, _chai.expect)(cols.length).to.equal(2);
      const hasColA = cols.some(collection => collection.name === 'COLLECTION1');
      (0, _chai.expect)(hasColA).to.be.true;
      const hasColB = cols.some(collection => collection.name === 'collection1');
      (0, _chai.expect)(hasColB).to.be.true;
      return {
        testName: 'testCollectionNameCaseSensitive',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testCollectionNameCaseSensitive',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests case-sensitive scope names
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testScopeNameCaseSensitive() {
    try {
      const colA = await this.database?.createCollection('colA', 'scopeA');
      const colB = await this.database?.createCollection('colA', 'SCOPEa');
      (0, _chai.expect)(colA.scope.name).to.be.equal('scopeA');
      (0, _chai.expect)(colB.scope.name).to.be.equal('SCOPEa');
      const scopes = await this.database?.scopes();
      (0, _chai.expect)(scopes.length).to.equal(4);
      const hasScopeA = scopes.some(scope => scope.name === 'scopeA');
      (0, _chai.expect)(hasScopeA).to.be.true;
      const hasScopeB = scopes.some(scope => scope.name === 'SCOPEa');
      (0, _chai.expect)(hasScopeB).to.be.true;
      return {
        testName: 'testScopeNameCaseSensitive',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testScopeNameCaseSensitive',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method creates a new document with a predefined ID and name, saves it to the collection,
   * and then verifies the document by comparing it with the expected data.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testColCreateDocument() {
    const id = '123';
    const doc = new _index.MutableDocument();
    doc.setId(id);
    doc.setString('name', 'Scott');
    const dic = doc.toDictionary;
    await this.collection?.save(doc);
    return this.verifyCollectionDoc('testColCreateDocument', id, this.collection, JSON.stringify(dic));
  }

  /**
   * This method creates a new document with a predefined ID and name, saves it to the collection,
   * and then deletes the document and validates the document is no longer in the collection
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testColDeleteDocument() {
    try {
      const id = '123';
      const doc = new _index.MutableDocument();
      doc.setId(id);
      doc.setString('name', 'Scott');
      await this.collection?.save(doc);
      await this.collection.deleteDocument(doc);
      return {
        testName: 'testColDeleteDocument',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testColDeleteDocument',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests creating documents with an ID and then
   * make sure the document was saved
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testColSaveDocWithId() {
    try {
      const docId = 'doc1';
      const doc = await this.createCollectionDocumentWithId(docId, this.collection);
      const count = await this.getCollectionDocumentCount();
      _chai.assert.equal(1, count);
      await this.verifyCollectionDoc('testColSaveDocWithId', docId, this.collection, JSON.stringify(doc.toDictionary));
      return {
        testName: 'testColSaveDocWithId',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testColSaveDocWithId',
        success: false,
        message: JSON.stringify(error),
        data: undefined
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
  async testColSaveDocSpecialCharacters() {
    try {
      const docId = await this.createCollectionDocumentWithId('~@#$%^&*()_+{}|\\][=-/.,<>?":;', this.collection);
      const count = await this.getCollectionDocumentCount();
      _chai.assert.equal(1, count);
      await this.verifyCollectionDoc('testColSaveDocSpecialCharacters', '~@#$%^&*()_+{}|\\][=-/.,<>?":;', this.collection, JSON.stringify(docId.toDictionary));
      return {
        testName: 'testColSaveDocSpecialCharacters',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testColSaveDocSpecialCharacters',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests updating documents multiple times and then
   * verifying the document sequence number
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testColSaveSameDocTwice() {
    try {
      //create document first time
      const docId = await this.createCollectionDocumentWithId('doc1', this.collection);
      let count = await this.getCollectionDocumentCount();
      _chai.assert.equal(1, count);
      //save the same document again to check sequence number
      await this.collection?.save(docId);
      const docSeq2 = await this.collection?.document('doc1');
      count = await this.getCollectionDocumentCount();
      _chai.assert.equal(1, count);
      _chai.assert.equal(2, docSeq2?.getSequence());
      return {
        testName: 'testColSaveSameDocTwice',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testColSaveSameDocTwice',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }

  /**
   * This method tests creating and then updating the same document
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testColCreateAndUpdateMutableDoc() {
    try {
      const doc = await this.createCollectionDocumentWithId('doc1', this.collection);
      //update
      doc.setString('firstName', 'Steve');
      await this.collection?.save(doc);
      let count = await this.getCollectionDocumentCount();
      _chai.assert.equal(1, count);

      //update
      doc.setString('lastName', 'Jobs');
      await this.collection?.save(doc);
      count = await this.getCollectionDocumentCount();
      _chai.assert.equal(1, count);
      doc.setInt('age', 56);
      await this.collection?.save(doc);
      count = await this.getCollectionDocumentCount();
      _chai.assert.equal(1, count);

      //validate saves worked
      const updatedDoc = await this.collection?.document('doc1');
      _chai.assert.equal(4, updatedDoc?.getSequence());
      _chai.assert.equal('Steve', updatedDoc?.getString('firstName'));
      _chai.assert.equal('Jobs', updatedDoc?.getString('lastName'));
      _chai.assert.equal(56, updatedDoc?.getString('age'));
      return {
        testName: 'testColCreateAndUpdateMutableDoc',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testColCreateAndUpdateMutableDoc',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }
  async testDeletePreSaveDoc() {
    try {
      const doc = new _index.MutableDocument('doc1');
      doc.setValue('key', 1);
      await this.collection?.deleteDocument(doc);
    } catch (error) {
      return {
        testName: 'testDeletePreSaveDoc',
        success: true,
        message: 'success',
        data: undefined
      };
    }
    return {
      testName: 'testDeletePreSaveDoc',
      success: false,
      message: 'Expected error trying to delete a document that has not been saved',
      data: undefined
    };
  }
  async testDeleteSameDocTwice() {
    try {
      const doc1 = await this.createCollectionDocumentWithId('doc1', this.collection);

      //first deletion
      await this.collection?.deleteDocument(doc1);
      const count = await this.collection.count();
      (0, _chai.expect)(count.count).to.equal(0);
      await this.collection.save(doc1);

      //second save
      const doc2 = await this.collection.document('doc1');
      (0, _chai.expect)(doc2).to.not.be.null;
      (0, _chai.expect)(doc2).to.not.be.equal(undefined);
      (0, _chai.expect)(doc2.getSequence()).to.equal(3);

      //second deletion
      await this.collection?.deleteDocument(doc2);
      const secondCount = await this.collection.count();
      (0, _chai.expect)(secondCount.count).to.equal(0);

      //third save
      await this.collection.save(doc1);
      const doc3 = await this.collection.document('doc1');
      (0, _chai.expect)(doc3).to.not.be.null;
      (0, _chai.expect)(doc3).to.not.be.equal(undefined);
      (0, _chai.expect)(doc3.getSequence()).to.equal(5);
      return {
        testName: 'testDeleteSameDocTwice',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testDeleteSameDocTwice',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }
  async testDeleteNoneExistingDoc() {
    try {
      const doc1a = await this.createDocumentWithId('doc1');
      const doc1b = await this.defaultCollection.document(doc1a.getId());
      await this.defaultCollection.purge(doc1a);
      const doc1aCount = await this.defaultCollection.count();
      (0, _chai.expect)(doc1aCount.count).to.equal(0);
      const doc1aa = await this.defaultCollection.document(doc1a.getId());
      (0, _chai.expect)(doc1aa).to.be.equal(undefined);
      await this.defaultCollection.deleteDocument(doc1b);
    } catch (error) {
      return {
        testName: 'testDeleteNoneExistingDoc',
        success: true,
        message: 'success',
        data: undefined
      };
    }
    return {
      testName: 'testDeleteNoneExistingDoc',
      success: false,
      message: 'Expected error deleting document that does not exist',
      data: undefined
    };
  }
  async testPurgePreSaveDoc() {
    try {
      const doc = new _index.MutableDocument('doc1');
      await this.defaultCollection.purge(doc);
    } catch (error) {
      return {
        testName: 'testPurgePreSaveDoc',
        success: true,
        message: 'success',
        data: undefined
      };
    }
    return {
      testName: 'testPurgePreSaveDoc',
      success: false,
      message: "Expected error purging document that hasn't been saved",
      data: undefined
    };
  }
  async testPurgeDoc() {
    try {
      const doc = await this.createDocumentWithId('doc1');
      await this.defaultCollection.purge(doc);
      const doc1 = await this.defaultCollection.document('doc1');
      const count = await this.defaultCollection.count();
      (0, _chai.expect)(doc1).to.be.equal(undefined);
      (0, _chai.expect)(count.count).to.be.equal(0);
      return {
        testName: 'testPurgeDoc',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testPurgeDoc',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }
  async testPurgeSameDocTwice() {
    try {
      const doc = await this.createDocumentWithId('doc1');
      await this.defaultCollection.purge(doc);
      const doc1 = await this.defaultCollection.document('doc1');
      const count = await this.defaultCollection.count();
      (0, _chai.expect)(doc1).to.be.equal(undefined);
      (0, _chai.expect)(count.count).to.be.equal(0);
      await this.defaultCollection.purge(doc);
      return {
        testName: 'testPurgeSameDocTwice',
        success: false,
        message: "Expected to throw error purging document that doesn't exist",
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testPurgeSameDocTwice',
        success: true,
        message: 'success',
        data: undefined
      };
    }
  }
  async testPurgeDocumentOnADeletedDocument() {
    try {
      const doc = await this.createDocumentWithId('doc1');
      await this.defaultCollection.deleteDocument(doc);
      await this.defaultCollection.purge(doc);
      const count = await this.defaultCollection.count();
      (0, _chai.expect)(count.count).to.be.equal(0);
      const doc1 = await this.defaultCollection.document('doc1');
      (0, _chai.expect)(doc1).to.be.equal(undefined);
      return {
        testName: 'testPurgeDocumentOnADeletedDocument',
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testPurgeDocumentOnADeletedDocument',
        success: false,
        message: JSON.stringify(error),
        data: undefined
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
  async testColSaveDocWithConflict() {
    const result1 = await this.saveDocWithConflict('testSaveDocWithConflict', undefined);
    if (!result1.success) return result1;

    //reset the database
    await this.tearDown();
    await this.init();
    const result2 = await this.saveDocWithConflict('testSaveDocWithConflict', _index.ConcurrencyControl.FAIL_ON_CONFLICT);
    if (result2.success) {
      return {
        testName: 'testColSaveDocWithConflict',
        success: false,
        message: 'Expected conflict error with ConcurrencyControl.FAIL_ON_CONFLICT but did not get one',
        data: undefined
      };
    }
    //reset the database
    await this.tearDown();
    await this.init();
    const result3 = await this.saveDocWithConflict('testSaveDocWithConflict', _index.ConcurrencyControl.LAST_WRITE_WINS);
    if (!result3.success) return result3;
    return {
      testName: 'testSaveDocWithConflict',
      success: true,
      message: 'success',
      data: undefined
    };
  }

  /**
   * This is a helper method used to test ConcurrencyControl
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async saveDocWithConflict(methodName, control) {
    try {
      const doc = await this.createCollectionDocumentWithId('doc1', this.collection);
      doc.setString('firstName', 'Steve');
      doc.setString('lastName', 'Jobs');
      await this.collection.save(doc);

      //get two of the same document
      const doc1a = await this.collection.document('doc1');
      const doc1b = await this.collection.document('doc1');
      const mutableDoc1a = _index.MutableDocument.fromDocument(doc1a);
      const mutableDoc1b = _index.MutableDocument.fromDocument(doc1b);
      mutableDoc1a.setString('lastName', 'Wozniak');
      await this.collection.save(mutableDoc1a);
      mutableDoc1a.setString('nickName', 'The Woz');
      await this.collection.save(mutableDoc1a);
      const updatedDoc1a = await this.collection.document('doc1');
      _chai.assert.equal('Wozniak', updatedDoc1a?.getString('lastName'));
      _chai.assert.equal('The Woz', updatedDoc1a?.getString('nickName'));
      _chai.assert.equal('Steve', updatedDoc1a?.getString('firstName'));
      _chai.assert.equal(4, updatedDoc1a?.getSequence());
      if (control === undefined) {
        await this.collection.save(mutableDoc1b);
      } else {
        await this.collection.save(mutableDoc1b, control);
      }
      const updatedDoc1b = await this.collection.document('doc1');
      _chai.assert.equal(mutableDoc1b.getString('lastName'), updatedDoc1b.getString('lastName'));
      _chai.assert.equal(5, updatedDoc1b.getSequence());
      return {
        testName: methodName,
        success: true,
        message: 'success',
        data: undefined
      };
    } catch (error) {
      return {
        testName: methodName,
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }
  async isErrorCreatingCollection(name, scopeName) {
    try {
      await this.database?.createCollection(name, scopeName);
    } catch (error) {
      return true;
    }
    return false;
  }
}
exports.CollectionTests = CollectionTests;
//# sourceMappingURL=collection-test.cjs.map