"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReplicatorTests = void 0;
var _testCase = require("./test-case.cjs");
var _index = require("../../cblite/index.cjs");
var _chai = require("chai");
/**
 * ReplicatorTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
class ReplicatorTests extends _testCase.TestCase {
  constructor() {
    super();
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testReplicatorConfigDefaultValues() {
    //iOS and Android have different ways to connect to the emulator/simulator
    //ios
    //const target = new URLEndpoint('ws://localhost:4984/projects');
    //android
    const target = new _index.URLEndpoint('ws://10.0.2.2:4984/projects');
    const config = new _index.ReplicatorConfiguration(target);
    config.addCollection(this.collection);
    try {
      //check to make sure that the default values are being set in the configuration
      (0, _chai.expect)(config.getCollections().length).to.be.equal(1);
      (0, _chai.expect)(config.getCollections()[0]).to.be.equal(this.collection);
      (0, _chai.expect)(config.getReplicatorType()).to.be.equal(_index.ReplicatorType.PUSH_AND_PULL);
      (0, _chai.expect)(config.getAcceptOnlySelfSignedCerts()).to.be.equal(_index.ReplicatorConfiguration.defaultSelfSignedCertificateOnly);
      (0, _chai.expect)(config.getAllowReplicatingInBackground()).to.be.equal(_index.ReplicatorConfiguration.defaultAllowReplicatingInBackground);
      (0, _chai.expect)(config.getAcceptParentDomainCookies()).to.be.equal(_index.ReplicatorConfiguration.defaultAcceptParentDomainCookies);
      (0, _chai.expect)(config.getAutoPurgeEnabled()).to.be.equal(_index.ReplicatorConfiguration.defaultEnableAutoPurge);
      (0, _chai.expect)(config.getContinuous()).to.be.equal(_index.ReplicatorConfiguration.defaultContinuous);
      (0, _chai.expect)(config.getHeartbeat()).to.be.equal(_index.ReplicatorConfiguration.defaultHeartbeat);
      (0, _chai.expect)(config.getMaxAttempts()).to.be.equal(_index.ReplicatorConfiguration.defaultMaxAttemptsSingleShot);
      (0, _chai.expect)(config.getMaxAttemptWaitTime()).to.be.equal(_index.ReplicatorConfiguration.defaultMaxAttemptsWaitTime);
      (0, _chai.expect)(config.getHeaders()).to.be.equal(undefined);
      (0, _chai.expect)(config.getAuthenticator()).to.be.equal(undefined);
      return {
        testName: 'testReplicatorConfigDefaultValues',
        success: true,
        message: `success`,
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testReplicatorConfigDefaultValues',
        success: false,
        message: `${error}`,
        data: undefined
      };
    }
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testIsDocumentPending() {
    try {
      //iOS and Android have different ways to connect to the emulator/simulator

      //ios
      //const target = new URLEndpoint('ws://localhost:4984/projects');

      //android
      const target = new _index.URLEndpoint('ws://10.0.2.2:4984/projects');
      const auth = new _index.BasicAuthenticator('demo@example.com', 'P@ssw0rd12');
      const config = new _index.ReplicatorConfiguration(target);
      config.addCollection(this.defaultCollection);
      config.setAuthenticator(auth);

      //setup document
      const docId = 'doc1';
      const doc = new _index.MutableDocument(docId);
      doc.setString('foo', 'bar');
      await this.defaultCollection.save(doc);

      //setup replicator
      const replicator = await _index.Replicator.create(config);
      const isDocumentPendingResults = await replicator.isDocumentPending(docId, this.defaultCollection);
      const count = await this.defaultCollection.count();
      (0, _chai.expect)(count.count).to.be.greaterThan(0);
      (0, _chai.expect)(isDocumentPendingResults.isPending).to.be.true;
      return {
        testName: 'testIsDocumentPending',
        success: true,
        message: `success`,
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testIsDocumentPending',
        success: false,
        message: `Error:${error}`,
        data: undefined
      };
    }
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentsPending() {
    try {
      //iOS and Android have different ways to connect to the emulator/simulator

      //ios
      //const target = new URLEndpoint('ws://localhost:4984/projects');

      //android
      const target = new _index.URLEndpoint('ws://10.0.2.2:4984/projects');
      const auth = new _index.BasicAuthenticator('demo@example.com', 'P@ssw0rd12');
      const config = new _index.ReplicatorConfiguration(target);
      config.addCollection(this.defaultCollection);
      config.setAuthenticator(auth);

      //setup document
      const docId = 'doc1';
      const docId2 = 'doc2';
      const doc = new _index.MutableDocument(docId);
      const doc2 = new _index.MutableDocument(docId2);
      doc.setString('foo', 'bar');
      doc2.setString('foo', 'bar');
      await this.defaultCollection.save(doc);
      await this.defaultCollection.save(doc2);

      //setup replicator
      const replicator = await _index.Replicator.create(config);
      const pendingDocumentsResults = await replicator.getPendingDocumentIds(this.defaultCollection);
      const count = await this.defaultCollection.count();
      const pendingDocumentsCount = pendingDocumentsResults.pendingDocumentIds.length;
      (0, _chai.expect)(count.count).to.be.greaterThan(0);
      (0, _chai.expect)(pendingDocumentsCount).to.equal(2);
      (0, _chai.expect)(pendingDocumentsResults.pendingDocumentIds).to.include(docId);
      (0, _chai.expect)(pendingDocumentsResults.pendingDocumentIds).to.include(docId2);
      return {
        testName: 'testDocumentsPending',
        success: true,
        message: `success`,
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testDocumentsPending',
        success: false,
        message: `Error:${error}`,
        data: undefined
      };
    }
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testReplicationStatusChangeListenerEvent() {
    try {
      //iOS and Android have different ways to connect to the emulator/simulator

      //ios
      //const target = new URLEndpoint('ws://localhost:4984/projects');

      //android
      const target = new _index.URLEndpoint('ws://10.0.2.2:4984/projects');
      const auth = new _index.BasicAuthenticator('demo@example.com', 'P@ssw0rd12');
      const config = new _index.ReplicatorConfiguration(target);
      config.addCollection(this.defaultCollection);
      config.setAuthenticator(auth);
      let isError = false;
      let didGetChangeStatus = false;
      const replicator = await _index.Replicator.create(config);
      const token = await replicator.addChangeListener(change => {
        //check to see if there was an error
        const error = change.status.getError();
        if (error !== undefined) {
          isError = true;
        }
        //get the status of the replicator using ReplicatorActivityLevel enum
        if (change.status.getActivityLevel() === _index.ReplicatorActivityLevel.IDLE) {
          //do something because the replicator is now IDLE
        }
        didGetChangeStatus = true;
      });

      //don't start with a new checkpoint by passing false to the start method
      await replicator.start(false);
      //we need to sleep to wait for the documents to replicate, no one would ever normally do this
      //don't include in docs
      await this.sleep(5000);

      //this mimics what someone would do when the app needs to close to properly clean up the
      //replicator and processes
      await replicator.removeChangeListener(token);
      await replicator.stop();

      //validate we got documents replicated
      const count = await this.defaultCollection.count();
      (0, _chai.expect)(count.count).to.be.greaterThan(0);

      //validate our listener was called and there wasn't errors
      (0, _chai.expect)(isError).to.be.false;
      (0, _chai.expect)(didGetChangeStatus).to.be.true;
      return {
        testName: 'testReplicationStatusChangeListenerEvent',
        success: true,
        message: `success`,
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testReplicationStatusChangeListenerEvent',
        success: false,
        message: `${error}`,
        data: undefined
      };
    }
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentChangeListenerEvent() {
    try {
      //iOS and Android have different ways to connect to the emulator/simulator

      //ios
      //const target = new URLEndpoint('ws://localhost:4984/projects');

      //android
      const target = new _index.URLEndpoint('ws://10.0.2.2:4984/projects');
      const auth = new _index.BasicAuthenticator('demo@example.com', 'P@ssw0rd12');
      const config = new _index.ReplicatorConfiguration(target);
      config.addCollection(this.defaultCollection);
      config.setAuthenticator(auth);
      let isError = false;
      let didGetDocumentUpdate = false;
      const replicator = await _index.Replicator.create(config);
      const token = await replicator.addDocumentChangeListener(change => {
        //check to see if the documents were pushed or pulled
        //if isPush is true then the documents were pushed, else it was pulled
        const isPush = change.isPush;
        //loop through documents
        for (const doc of change.documents) {
          //details of each document along with if there was an error on that doc
          const id = doc.id;
          const flags = doc.flags;
          const error = doc.error;
          if (error !== undefined) {
            isError = true;
          }
        }
        didGetDocumentUpdate = true;
      });

      //don't start with a new checkpoint by passing false to the start method
      await replicator.start(false);
      //we need to sleep to wait for the documents to replicate, no one would ever normally do this
      //don't include in docs
      await this.sleep(5000);

      //this mimics what someone would do when the app needs to close to properly clean up the
      //replicator and processes
      await replicator.removeChangeListener(token);
      await replicator.stop();

      //validate we got documents replicated
      const count = await this.defaultCollection.count();
      (0, _chai.expect)(count.count).to.be.greaterThan(0);

      //validate our listener was called and there wasn't erorrs
      (0, _chai.expect)(isError).to.be.false;
      (0, _chai.expect)(didGetDocumentUpdate).to.be.true;
      return {
        testName: 'testDocumentChangeListenerEvent',
        success: true,
        message: `success`,
        data: undefined
      };
    } catch (error) {
      return {
        testName: 'testDocumentChangeListenerEvent',
        success: false,
        message: `Error:${error}`,
        data: undefined
      };
    }
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testEmptyPush() {
    return {
      testName: 'testEmptyPush',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testStartWithCheckpoint() {
    return {
      testName: 'testStartWithCheckpoint',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testStartWithResetCheckpointContinuous() {
    return {
      testName: 'testStartWithResetCheckpointContinuous',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRemoveDocumentReplicationListener() {
    return {
      testName: 'testRemoveDocumentReplicationListener',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testPushAndForget() {
    return {
      testName: 'testPushAndForget',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRemoveChangeListener() {
    return {
      testName: 'testRemoveChangeListener',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testAddRemoveChangeListenerAfterReplicatorStart() {
    return {
      testName: 'testAddRemoveChangeListenerAfterReplicatorStart',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCopyingReplicatorConfiguration() {
    return {
      testName: 'testCopyingReplicatorConfiguration',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testReplicationConfigSetterMethods() {
    return {
      testName: 'testReplicationConfigSetterMethods',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }
}
exports.ReplicatorTests = ReplicatorTests;
//# sourceMappingURL=replicator-test.cjs.map