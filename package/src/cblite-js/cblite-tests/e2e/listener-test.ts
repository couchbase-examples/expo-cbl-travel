import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
import { MutableDocument } from '../../cblite/';
import { expect } from 'chai';

/**
 * ListenerTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class ListenerTests extends TestCase {
  constructor() {
    super();
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCollectionChange(): Promise<ITestResult> {
    try {
      const results: string[] = [];
      const docId1 = 'doc1';
      const docId2 = 'doc2';
      const collection = await this.database.createCollection(
        'testCollectionChange',
        'testScope'
      );

      // Create a promise that resolves when the listener is added
      const token = await collection.addChangeListener((change) => {
        for (const doc of change.documentIDs) {
          results.push(doc);
        }
      });

      //create documents to trigger the change listener
      const doc1 = new MutableDocument();
      const doc2 = new MutableDocument();
      doc1.setId(docId1);
      doc1.setString('name', 'Alice');
      doc2.setId(docId2);
      doc2.setString('name', 'tdbGamer');
      // Create a promise that resolves when the listener is added

      await this.collection.save(doc1);
      await this.collection.save(doc2);

      // Verify that the listener was called
      expect(results).contain(docId1);
      expect(results).contain(docId2);

      //validate the change listener is removed and the token changes we don't get any more notifications and conflicts by adding the same listener
      await collection.removeChangeListener(token);

      return {
        testName: 'testCollectionChange',
        success: false,
        message: 'Not implemented',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCollectionChange',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }
}
