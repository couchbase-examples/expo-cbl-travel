"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListenerTests = void 0;
var _testCase = require("./test-case.cjs");
var _index = require("../../cblite/index.cjs");
var _chai = require("chai");
/**
 * ListenerTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
class ListenerTests extends _testCase.TestCase {
  constructor() {
    super();
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCollectionChange() {
    try {
      const results = [];
      const docId1 = 'doc1';
      const docId2 = 'doc2';
      const collection = await this.database.createCollection('testCollectionChange', 'testScope');

      // Create a promise that resolves when the listener is added
      const token = await collection.addChangeListener(change => {
        for (const doc of change.documentIDs) {
          results.push(doc);
        }
      });

      //create documents to trigger the change listener
      const doc1 = new _index.MutableDocument();
      const doc2 = new _index.MutableDocument();
      doc1.setId(docId1);
      doc1.setString('name', 'Alice');
      doc2.setId(docId2);
      doc2.setString('name', 'tdbGamer');
      // Create a promise that resolves when the listener is added

      await this.collection.save(doc1);
      await this.collection.save(doc2);

      // Verify that the listener was called
      (0, _chai.expect)(results).contain(docId1);
      (0, _chai.expect)(results).contain(docId2);

      //validate the change listener is removed and the token changes we don't get any more notifications and conflicts by adding the same listener
      await collection.removeChangeListener(token);
      return {
        testName: 'testCollectionChange',
        success: false,
        message: 'Not implemented',
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testCollectionChange',
        success: false,
        message: JSON.stringify(error),
        data: undefined
      };
    }
  }
}
exports.ListenerTests = ListenerTests;
//# sourceMappingURL=listener-test.cjs.map