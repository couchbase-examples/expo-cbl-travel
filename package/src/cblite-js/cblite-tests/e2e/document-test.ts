import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
import { MutableDocument, Blob } from '../../cblite/src';
import { expect } from 'chai';
/**
 * DocumentTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class DocumentTests extends TestCase {
  kTestDate: string = '2020-01-01T00:00:00.000Z';

  kTestBlob: string = "i'm blob";

  constructor() {
    super();
  }

  private async populateData(doc: MutableDocument) {
    const address = {
      street: '1 Main st.',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      code: '90210',
    };

    doc.setDictionary('dict', address);
    const phones = ['650-000-0000', '650-000-0001'];
    doc.setArray('array', phones);
    doc.setBlob('blob', null);

    doc.setValue('nullValue', null);
    doc.setValue('dataValue', 'value');
    doc.setBoolean('booleanTrue', true);
    doc.setBoolean('booleanFalse', false);
    doc.setLong('longZero', 0);
    doc.setLong('longBig', 4000000000);
    doc.setLong('longSmall', -4000000000);
    doc.setDouble('doubleBig', 1.0e200);
    doc.setDouble('doubleSmall', -1.0e200);
    doc.setString('stringNull', null);
    doc.setString('stringPunk', 'Jett');
    doc.setDate('dateNull', null);
    doc.setDate('dateCB', new Date('2020-01-01T00:00:00.000Z'));
    doc.setInt('intZero', 0);
    doc.setInt('intBig', 4000000000);
    doc.setInt('intSmall', -4000000000);
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateDoc(): Promise<ITestResult> {
    try {
      const doc = new MutableDocument();
      expect(doc).to.not.be.null;
      await this.defaultCollection.save(doc);

      return {
        testName: 'testCreateDoc',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCreateDoc',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateDocWithID(): Promise<ITestResult> {
    try {
      const doc = new MutableDocument('testCreateDocWithID');
      expect(doc).to.not.be.null;
      expect(doc.getId()).to.equal('testCreateDocWithID');
      expect(doc.toDictionary).to.have.length(0);
      await this.defaultCollection.save(doc);

      return {
        testName: 'testCreateDocWithID',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCreateDocWithID',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateDocwithEmptyStringID(): Promise<ITestResult> {
    try {
      const doc = new MutableDocument('');
      expect(doc).to.not.be.null;
      await this.defaultCollection.save(doc);

      return {
        testName: 'testCreateDocWithEmptyStringID',
        success: false,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCreateDocWithEmptyStringID',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateDocWithNullID(): Promise<ITestResult> {
    try {
      const doc = new MutableDocument(null);
      expect(doc).to.not.be.null;
      expect(doc.getId()).to.have.length.greaterThan(0);
      expect(doc.toDictionary()).to.have.length(0);
      await this.defaultCollection.save(doc);

      return {
        testName: 'testCreateDocWithNullID',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCreateDocWithNullID',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateDocWithDict(): Promise<ITestResult> {
    try {
      const dict = {
        name: 'Scott Tiger',
        age: 30,
        address: {
          street: '1 Main street.',
          city: 'Mountain View',
          state: 'CA',
        },
        phones: ['650-123-0001', '650-123-0002'],
      };

      const doc = new MutableDocument('doc1', null, dict);
      expect(doc).to.not.be.null;
      expect(doc.getId()).to.have.length.greaterThan(0);
      expect(doc.toDictionary()).to.deep.equal(dict);
      await this.defaultCollection.save(doc);

      return {
        testName: 'testCreateDocWithDict',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCreateDocWithDict',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetDictionaryContent(): Promise<ITestResult> {
    try {
      const dict = {
        name: 'Scott Tiger',
        age: 30,
        address: {
          street: '1 Main street.',
          city: 'Mountain View',
          state: 'CA',
        },
        phones: ['650-123-0001', '650-123-0002'],
      };

      const doc = new MutableDocument('doc1');
      doc.setData(dict);
      expect(doc.toDictionary()).to.deep.equal(dict);
      await this.defaultCollection.save(doc);

      const nuDict = {
        name: 'Daniel Tiger',
        age: 32,
        address: {
          street: '2 Main street.',
          city: 'Palo Alto',
          state: 'CA',
        },
        phones: ['650-234-0001', '650-234-0002'],
      };

      doc.setData(nuDict);
      expect(doc.toDictionary()).to.deep.equal(nuDict);
      await this.defaultCollection.save(doc);

      return {
        testName: 'testSetDictionaryContent',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetDictionaryContent',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetValueFromNewEmptyDoc(): Promise<ITestResult> {
    try {
      const doc = new MutableDocument('doc1');
      await this.defaultCollection.save(doc);

      const savedDoc = await this.defaultCollection.document(doc.getId());

      expect(savedDoc.getInt('key')).to.equal(0);
      expect(savedDoc.getFloat('key')).to.equal(0.0);
      expect(savedDoc.getDouble('key')).to.equal(0.0);
      expect(savedDoc.getBoolean('key')).to.equal(false);
      expect(savedDoc.getBlob('key')).to.be.null;
      expect(savedDoc.getDate('key')).to.be.null;
      expect(savedDoc.getValue('key')).to.be.null;
      expect(savedDoc.getString('key')).to.be.null;
      expect(savedDoc.getDictionary('key')).to.be.null;
      expect(savedDoc.getArray('key')).to.be.null;
      expect(savedDoc.toDictionary()).to.have.length(0);

      return {
        testName: 'testGetValueFromNewEmptyDoc',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testGetValueFromNewEmptyDoc',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSaveThenGetFromAnotherDB(): Promise<ITestResult> {
    return {
      testName: 'testSaveThenGetFromAnotherDB',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testNoCacheNoLive(): Promise<ITestResult> {
    return {
      testName: 'testNoCacheNoLive',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetString(): Promise<ITestResult> {
    try {
      // Create and save the initial document
      const doc = new MutableDocument('doc1');
      doc.setValue('string1', 'string1');
      doc.setValue('string2', 'string2');
      await this.defaultCollection.save(doc);

      // Retrieve and assert the saved document
      const savedDoc = await this.defaultCollection.document(doc.getId());
      expect(savedDoc).to.not.be.null;
      expect(savedDoc.getValue('string1')).to.equal('string1');
      expect(savedDoc.getValue('string2')).to.equal('string2');

      // Update the document with new values
      doc.setValue('string1', 'string1a');
      doc.setValue('string2', 'string2a');
      await this.defaultCollection.save(doc);

      // Retrieve and assert the updated document
      const savedDoc2 = await this.defaultCollection.document(doc.getId());
      expect(savedDoc2).to.not.be.null;
      expect(savedDoc2.getValue('string1')).to.equal('string1a');
      expect(savedDoc2.getValue('string2')).to.equal('string2a');

      return {
        testName: 'testSetString',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetString',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }
  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetString(): Promise<ITestResult> {
    try {
      const doc = new MutableDocument('doc1');
      this.populateData(doc);
      await this.defaultCollection.save(doc);
      const retrievedDoc = await this.defaultCollection.document('doc1');

      expect(retrievedDoc.getString('nullValue')).to.be.null;
      expect(retrievedDoc.getString('dataValue')).to.equal('value');
      expect(retrievedDoc.getBoolean('booleanTrue')).to.equal(true);
      expect(retrievedDoc.getBoolean('booleanFalse')).to.equal(false);
      expect(retrievedDoc.getLong('longZero')).to.equal(0);
      expect(retrievedDoc.getLong('longBig')).to.equal(4000000000);
      expect(retrievedDoc.getLong('longSmall')).to.equal(-4000000000);
      expect(retrievedDoc.getDouble('doubleBig')).to.equal(1.0e200);
      expect(retrievedDoc.getDouble('doubleSmall')).to.equal(-1.0e200);
      expect(retrievedDoc.getString('stringNull')).to.be.null;
      expect(retrievedDoc.getString('stringPunk')).to.equal('Jett');
      expect(retrievedDoc.getDate('dateNull')).to.be.null;
      expect(retrievedDoc.getDate('dateCB')).to.eql('2020-01-01T00:00:00.000Z');
      expect(retrievedDoc.getDictionary('dict')).to.eql({
        street: '1 Main st.',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        code: '90210',
      });
      expect(retrievedDoc.getArray('array')).to.eql([
        '650-000-0000',
        '650-000-0001',
      ]);
      expect(retrievedDoc.getBlob('blob')).to.be.null;

      return {
        testName: 'testGetString',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testGetString',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetNumber(): Promise<ITestResult> {
    try {
      const doc = new MutableDocument('doc1');

      // Initial set of values
      doc.setInt('number1', 1);
      doc.setInt('number2', 0);
      doc.setInt('number3', -1);
      doc.setFloat('number4', 1.1);
      doc.setInt('number5', 12345678);
      await this.defaultCollection.save(doc);

      let retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions after initial save
      expect(retrievedDoc.getInt('number1')).to.equal(1);
      expect(retrievedDoc.getInt('number2')).to.equal(0);
      expect(retrievedDoc.getInt('number3')).to.equal(-1);
      expect(retrievedDoc.getFloat('number4')).to.equal(1.1);
      expect(retrievedDoc.getDouble('number4')).to.equal(1.1);
      expect(retrievedDoc.getInt('number5')).to.equal(12345678);

      // Update values
      doc.setInt('number1', 0);
      doc.setInt('number2', 1);
      doc.setFloat('number3', 1.1);
      doc.setInt('number4', -1);
      doc.setInt('number5', -12345678);
      await this.defaultCollection.save(doc);

      retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions after update
      expect(retrievedDoc.getInt('number1')).to.equal(0);
      expect(retrievedDoc.getInt('number2')).to.equal(1);
      expect(retrievedDoc.getFloat('number3')).to.equal(1.1);
      expect(retrievedDoc.getDouble('number3')).to.equal(1.1);
      expect(retrievedDoc.getInt('number4')).to.equal(-1);
      expect(retrievedDoc.getInt('number5')).to.equal(-12345678);

      return {
        testName: 'testSetNumber',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetNumber',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetInteger(): Promise<ITestResult> {
    try {
      // Create and populate the document
      const doc = new MutableDocument('doc1');
      await this.populateData(doc);
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      const retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      expect(retrievedDoc.getInt('nullValue')).to.equal(0);
      expect(retrievedDoc.getInt('booleanTrue')).to.equal(1);
      expect(retrievedDoc.getInt('booleanFalse')).to.equal(0);
      expect(retrievedDoc.getInt('dataValue')).to.equal(0);
      expect(retrievedDoc.getInt('longZero')).to.equal(0);
      expect(retrievedDoc.getInt('longBig')).to.equal(0);
      expect(retrievedDoc.getInt('longSmall')).to.equal(0);
      expect(retrievedDoc.getInt('doubleBig')).to.equal(0);
      expect(retrievedDoc.getInt('doubleSmall')).to.equal(0);
      expect(retrievedDoc.getInt('stringNull')).to.equal(0);
      expect(retrievedDoc.getInt('stringPunk')).to.equal(0);
      expect(retrievedDoc.getInt('dateNull')).to.equal(0);
      expect(retrievedDoc.getInt('dateCB')).to.equal(0);
      expect(retrievedDoc.getInt('dict')).to.equal(0);
      expect(retrievedDoc.getInt('array')).to.equal(0);
      expect(retrievedDoc.getInt('blob')).to.equal(0);
      expect(retrievedDoc.getInt('non_existing_key')).to.equal(0);

      return {
        testName: 'testGetInteger',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testGetInteger',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetFloat(): Promise<ITestResult> {
    try {
      // Create and populate the document
      const doc = new MutableDocument('doc1');
      await this.populateData(doc);
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      const retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      expect(retrievedDoc.getFloat('nullValue')).to.equal(0.0);
      expect(retrievedDoc.getFloat('booleanTrue')).to.equal(1.0);
      expect(retrievedDoc.getFloat('booleanFalse')).to.equal(0.0);
      expect(retrievedDoc.getFloat('dataValue')).to.equal(0.0);
      expect(retrievedDoc.getFloat('longZero')).to.equal(0.0);
      expect(retrievedDoc.getFloat('longBig')).to.equal(0.0);
      expect(retrievedDoc.getFloat('longSmall')).to.equal(0.0);
      expect(retrievedDoc.getFloat('doubleBig')).to.equal(1.0e200);
      expect(retrievedDoc.getFloat('doubleSmall')).to.equal(-1.0e200);
      expect(retrievedDoc.getFloat('stringNull')).to.equal(0.0);
      expect(retrievedDoc.getFloat('stringPunk')).to.equal(0.0);
      expect(retrievedDoc.getFloat('dateNull')).to.equal(0.0);
      expect(retrievedDoc.getFloat('dateCB')).to.equal(0.0);
      expect(retrievedDoc.getFloat('dict')).to.equal(0.0);
      expect(retrievedDoc.getFloat('array')).to.equal(0.0);
      expect(retrievedDoc.getFloat('blob')).to.equal(0.0);
      expect(retrievedDoc.getFloat('non_existing_key')).to.equal(0.0);

      return {
        testName: 'testGetFloat',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testGetFloat',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetDouble(): Promise<ITestResult> {
    try {
      // Create and populate the document
      const doc = new MutableDocument('doc1');
      await this.populateData(doc);
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      const retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      expect(retrievedDoc.getDouble('nullValue')).to.equal(0.0);
      expect(retrievedDoc.getDouble('booleanTrue')).to.equal(1.0);
      expect(retrievedDoc.getDouble('booleanFalse')).to.equal(0.0);
      expect(retrievedDoc.getDouble('dataValue')).to.equal(0.0);
      expect(retrievedDoc.getDouble('longZero')).to.equal(0.0);
      expect(retrievedDoc.getDouble('longBig')).to.equal(0.0);
      expect(retrievedDoc.getDouble('longSmall')).to.equal(0.0);
      expect(retrievedDoc.getDouble('doubleBig')).to.equal(1.0e200);
      expect(retrievedDoc.getDouble('doubleSmall')).to.equal(-1.0e200);
      expect(retrievedDoc.getDouble('stringNull')).to.equal(0.0);
      expect(retrievedDoc.getDouble('stringPunk')).to.equal(0.0);
      expect(retrievedDoc.getDouble('dateNull')).to.equal(0.0);
      expect(retrievedDoc.getDouble('dateCB')).to.equal(0.0);
      expect(retrievedDoc.getDouble('dict')).to.equal(0.0);
      expect(retrievedDoc.getDouble('array')).to.equal(0.0);
      expect(retrievedDoc.getDouble('blob')).to.equal(0.0);
      expect(retrievedDoc.getDouble('non_existing_key')).to.equal(0.0);

      // Return success result
      return {
        testName: 'testGetDouble',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      // Return error result
      return {
        testName: 'testGetDouble',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetGetMinMaxNumbers(): Promise<ITestResult> {
    try {
      // Create and populate the document
      const doc = new MutableDocument('doc1');
      doc.setInt('min_int', Number.MIN_SAFE_INTEGER);
      doc.setInt('max_int', Number.MAX_SAFE_INTEGER);
      doc.setLong('min_int64', Number.MIN_SAFE_INTEGER);
      doc.setLong('max_int64', Number.MAX_SAFE_INTEGER);
      doc.setFloat('min_float', Number.MIN_VALUE);
      doc.setFloat('max_float', Number.MAX_VALUE);
      doc.setDouble('min_double', Number.MIN_VALUE);
      doc.setDouble('max_double', Number.MAX_VALUE);
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      const retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      expect(retrievedDoc.getInt('min_int')).to.equal(Number.MIN_SAFE_INTEGER);
      expect(retrievedDoc.getInt('max_int')).to.equal(Number.MAX_SAFE_INTEGER);
      expect(retrievedDoc.getValue('min_int')).to.equal(
        Number.MIN_SAFE_INTEGER
      );
      expect(retrievedDoc.getValue('max_int')).to.equal(
        Number.MAX_SAFE_INTEGER
      );

      expect(retrievedDoc.getLong('min_int64')).to.equal(
        Number.MIN_SAFE_INTEGER
      );
      expect(retrievedDoc.getLong('max_int64')).to.equal(
        Number.MAX_SAFE_INTEGER
      );
      expect(retrievedDoc.getValue('min_int64')).to.equal(
        Number.MIN_SAFE_INTEGER
      );
      expect(retrievedDoc.getValue('max_int64')).to.equal(
        Number.MAX_SAFE_INTEGER
      );

      expect(retrievedDoc.getFloat('min_float')).to.equal(Number.MIN_VALUE);
      expect(retrievedDoc.getFloat('max_float')).to.equal(Number.MAX_VALUE);
      expect(retrievedDoc.getValue('min_float')).to.equal(Number.MIN_VALUE);
      expect(retrievedDoc.getValue('max_float')).to.equal(Number.MAX_VALUE);

      expect(retrievedDoc.getDouble('min_double')).to.equal(Number.MIN_VALUE);
      expect(retrievedDoc.getDouble('max_double')).to.equal(Number.MAX_VALUE);
      expect(retrievedDoc.getValue('min_double')).to.equal(Number.MIN_VALUE);
      expect(retrievedDoc.getValue('max_double')).to.equal(Number.MAX_VALUE);

      return {
        testName: 'testSetGetMinMaxNumbers',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetGetMinMaxNumbers',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetGetFloatNumbers(): Promise<ITestResult> {
    try {
      // Create and populate the document
      const doc = new MutableDocument('doc1');
      doc.setDouble('number1', 1.0);
      doc.setDouble('number2', 1.49);
      doc.setDouble('number3', 1.5);
      doc.setDouble('number4', 1.51);
      doc.setDouble('number5', 1.99);
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      const retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      expect(retrievedDoc.getLong('number1')).to.equal(1);
      expect(retrievedDoc.getFloat('number1')).to.equal(1.0);
      expect(retrievedDoc.getDouble('number1')).to.equal(1.0);

      expect(retrievedDoc.getLong('number2')).to.equal(1);
      expect(retrievedDoc.getFloat('number2')).to.equal(1.49);
      expect(retrievedDoc.getDouble('number2')).to.equal(1.49);

      expect(retrievedDoc.getLong('number3')).to.equal(1);
      expect(retrievedDoc.getFloat('number3')).to.equal(1.5);
      expect(retrievedDoc.getDouble('number3')).to.equal(1.5);

      expect(retrievedDoc.getLong('number4')).to.equal(1);
      expect(retrievedDoc.getFloat('number4')).to.equal(1.51);
      expect(retrievedDoc.getDouble('number4')).to.equal(1.51);

      expect(retrievedDoc.getLong('number5')).to.equal(1);
      expect(retrievedDoc.getFloat('number5')).to.equal(1.99);
      expect(retrievedDoc.getDouble('number5')).to.equal(1.99);

      return {
        testName: 'testSetGetFloatNumbers',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetGetFloatNumbers',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetBoolean(): Promise<ITestResult> {
    try {
      // Create and populate the document
      const doc = new MutableDocument('doc1');
      doc.setBoolean('boolean1', true);
      doc.setBoolean('boolean2', false);
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      let retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      expect(retrievedDoc.getBoolean('boolean1')).to.equal(true);
      expect(retrievedDoc.getBoolean('boolean2')).to.equal(false);

      // Update
      doc.setBoolean('boolean1', false);
      doc.setBoolean('boolean2', true);
      await this.defaultCollection.save(doc);

      // Retrieve the updated document
      retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions after update
      expect(retrievedDoc.getBoolean('boolean1')).to.equal(false);
      expect(retrievedDoc.getBoolean('boolean2')).to.equal(true);

      return {
        testName: 'testSetBoolean',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetBoolean',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetBoolean(): Promise<ITestResult> {
    try {
      // Create a document and populate it
      const doc = new MutableDocument('doc1');
      await this.populateData(doc);

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      const retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      expect(retrievedDoc.getBoolean('null')).to.equal(false);
      expect(retrievedDoc.getBoolean('true')).to.equal(true);
      expect(retrievedDoc.getBoolean('false')).to.equal(false);
      expect(retrievedDoc.getBoolean('string')).to.equal(true);
      expect(retrievedDoc.getBoolean('zero')).to.equal(false);
      expect(retrievedDoc.getBoolean('one')).to.equal(true);
      expect(retrievedDoc.getBoolean('minus_one')).to.equal(true);
      expect(retrievedDoc.getBoolean('one_dot_one')).to.equal(true);
      expect(retrievedDoc.getBoolean('date')).to.equal(true);
      expect(retrievedDoc.getBoolean('dict')).to.equal(true);
      expect(retrievedDoc.getBoolean('array')).to.equal(true);
      expect(retrievedDoc.getBoolean('blob')).to.equal(true);
      expect(retrievedDoc.getBoolean('non_existing_key')).to.equal(false);

      return {
        testName: 'testGetBoolean',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testGetBoolean',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetDate(): Promise<ITestResult> {
    try {
      // Create a document
      const doc = new MutableDocument('doc1');

      // Get the current date
      const currentDate = new Date();

      // Convert date to JSON string
      const currentDateStr = this.jsonFromDate(currentDate);

      // Assertion: Check if the date string is not empty
      expect(currentDateStr.length).to.be.greaterThan(0);

      // Set the date value in the document
      doc.setDate('date', currentDate);

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      const retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      expect(retrievedDoc.getValue('date')).to.equal(currentDateStr);
      expect(retrievedDoc.getString('date')).to.equal(currentDateStr);

      // Update the date
      const newDate = new Date(currentDate.getTime() + 60000); // Add 60 seconds
      const newDateStr = this.jsonFromDate(newDate);
      doc.setDate('date', newDate);

      // Save the updated document
      await this.defaultCollection.save(doc);

      // Retrieve the updated document
      const updatedDoc = await this.defaultCollection.document('doc1');

      // Assertions for updated document
      expect(updatedDoc.getValue('date')).to.equal(newDateStr);
      expect(updatedDoc.getString('date')).to.equal(newDateStr);

      return {
        testName: 'testSetDate',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetDate',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetDate(): Promise<ITestResult> {
    try {
      const doc = new MutableDocument('doc1');
      this.populateData(doc);
      await this.defaultCollection.save(doc);
      const retrievedDoc = await this.defaultCollection.document('doc1');

      expect(retrievedDoc.getValue('null')).to.be.null;
      expect(retrievedDoc.getBoolean('true')).to.be.true;
      expect(retrievedDoc.getBoolean('false')).to.be.false;
      expect(retrievedDoc.getString('string')).to.be.null;
      expect(retrievedDoc.getValue('zero')).to.be.null;
      expect(retrievedDoc.getValue('one')).to.be.null;
      expect(retrievedDoc.getValue('minus_one')).to.be.null;
      expect(retrievedDoc.getValue('one_dot_one')).to.be.null;
      expect(retrievedDoc.getDate('date')).to.equal(this.kTestDate);
      expect(retrievedDoc.getValue('dict')).to.be.null;
      expect(retrievedDoc.getValue('array')).to.be.null;
      expect(retrievedDoc.getValue('blob')).to.be.null;
      expect(retrievedDoc.getValue('non_existing_key')).to.be.null;

      return {
        testName: 'testGetDate',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testGetDate',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetBlob(): Promise<ITestResult> {
    try {
      const doc = new MutableDocument('doc1');

      // Create a Blob with test content
      const content = this.kTestBlob;
      const encoder = new TextEncoder();
      const arrayBuffer = encoder.encode(content);
      const blob = new Blob('text/plain', arrayBuffer);

      // Set the Blob in the document
      doc.setBlob('blob', blob);

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      const retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      const retrievedBlob = retrievedDoc.getBlob('blob');
      expect(retrievedBlob.getContentType()).to.equal(blob.getContentType());
      expect(retrievedBlob.getLength()).to.equal(blob.getLength());

      // Update the Blob content
      const nuContent = '1234567890';
      const arrayBuffer2 = encoder.encode(nuContent);
      const nuBlob = new Blob('text/plain', arrayBuffer2);
      doc.setBlob('blob', nuBlob);

      // Save the updated document
      await this.defaultCollection.save(doc);

      // Retrieve the updated document
      const updatedDoc = await this.defaultCollection.document('doc1');

      // Assertions for updated document
      const updatedBlob = updatedDoc.getBlob('blob');
      expect(updatedBlob.getContentType()).to.equal(nuBlob.getContentType());
      expect(updatedBlob.getLength()).to.equal(nuBlob.getLength());

      return {
        testName: 'testSetBlob',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetBlob',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetBlob(): Promise<ITestResult> {
    try {
      // Create a document
      const doc = new MutableDocument('doc1');

      // Populate the document
      this.populateData(doc);

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      const retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      expect(retrievedDoc.getBlob('null')).to.be.null;
      expect(retrievedDoc.getBlob('true')).to.be.null;
      expect(retrievedDoc.getBlob('false')).to.be.null;
      expect(retrievedDoc.getBlob('string')).to.be.null;
      expect(retrievedDoc.getBlob('zero')).to.be.null;
      expect(retrievedDoc.getBlob('one')).to.be.null;
      expect(retrievedDoc.getBlob('minus_one')).to.be.null;
      expect(retrievedDoc.getBlob('one_dot_one')).to.be.null;
      expect(retrievedDoc.getBlob('date')).to.be.null;
      expect(retrievedDoc.getBlob('dict')).to.be.null;
      expect(retrievedDoc.getBlob('array')).to.be.null;
      expect(retrievedDoc.getBlob('blob')).to.not.be.null;
      // expect(retrievedDoc.getBlob("blob").content).to.eql(kTestBlob);

      // Return success
      return {
        testName: 'testGetBlob',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      // Return failure with error message
      return {
        testName: 'testGetBlob',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetDictionary(): Promise<ITestResult> {
    try {
      // Create a new MutableDocument instance
      const doc = new MutableDocument('doc1');

      // Populate the document as if it's a dictionary named 'dict'
      doc.setString('dict.street', '1 Main street');

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      let retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions for the saved document
      expect(retrievedDoc.getString('dict.street')).to.equal('1 Main street');

      // Update the document
      doc.setString('dict.city', 'Mountain View');

      // Save the updated document
      await this.defaultCollection.save(doc);

      // Retrieve the updated document
      retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions for the updated document
      expect(retrievedDoc.getString('dict.city')).to.equal('Mountain View');

      return {
        testName: 'testSetDictionary',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetDictionary',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetDictionary(): Promise<ITestResult> {
    try {
      // Create a new MutableDocument instance
      const doc = new MutableDocument('doc1');

      // Populate the document using the populateData method
      await this.populateData(doc);

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      const retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions for dictionary values
      expect(retrievedDoc.getDictionary('nullValue')).to.be.null;
      expect(retrievedDoc.getDictionary('booleanTrue')).to.be.null;
      expect(retrievedDoc.getDictionary('booleanFalse')).to.be.null;
      expect(retrievedDoc.getDictionary('dataValue')).to.be.null;
      expect(retrievedDoc.getDictionary('longZero')).to.be.null;
      expect(retrievedDoc.getDictionary('longBig')).to.be.null;
      expect(retrievedDoc.getDictionary('longSmall')).to.be.null;
      expect(retrievedDoc.getDictionary('doubleBig')).to.be.null;
      expect(retrievedDoc.getDictionary('doubleSmall')).to.be.null;
      expect(retrievedDoc.getDictionary('dateCB')).to.be.null;

      const expectedDict = {
        street: '1 Main st.',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        code: '90210',
      };

      expect(retrievedDoc.getDictionary('dict').toMap()).to.deep.equal(
        expectedDict
      );
      expect(retrievedDoc.getDictionary('array')).to.be.null;
      expect(retrievedDoc.getDictionary('blob')).to.be.null;
      expect(retrievedDoc.getDictionary('non_existing_key')).to.be.null;

      return {
        testName: 'testGetDictionary',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testGetDictionary',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetArray(): Promise<ITestResult> {
    try {
      // Create a new MutableDocument instance
      const doc = new MutableDocument('doc1');

      // Populate the array
      const array = ['item1', 'item2', 'item3'];

      // Set the array in the document
      doc.setArray('array', array);

      // Assertions
      expect(doc.getArray('array')).to.deep.equal(array);

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      let retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      let savedArray = retrievedDoc.getArray('array');
      expect(savedArray).to.deep.equal(array);

      // Update the array
      const updatedArray = ['item1', 'item2', 'item3', 'item4', 'item5'];
      doc.setArray('array', updatedArray);

      // Save the document again
      await this.defaultCollection.save(doc);

      // Retrieve the saved document again
      retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      savedArray = retrievedDoc.getArray('array');
      expect(savedArray).to.deep.equal(updatedArray);

      return {
        testName: 'testSetArray',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetArray',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetArray(): Promise<ITestResult> {
    try {
      // Create a document
      const doc = new MutableDocument('doc1');

      // Populate the document
      await this.populateData(doc);

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      const retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      expect(retrievedDoc.getArray('nullValue')).to.be.null;
      expect(retrievedDoc.getArray('booleanTrue')).to.be.null;
      expect(retrievedDoc.getArray('booleanFalse')).to.be.null;
      expect(retrievedDoc.getArray('dataValue')).to.be.null;
      expect(retrievedDoc.getArray('longZero')).to.be.null;
      expect(retrievedDoc.getArray('longBig')).to.be.null;
      expect(retrievedDoc.getArray('longSmall')).to.be.null;
      expect(retrievedDoc.getArray('doubleBig')).to.be.null;
      expect(retrievedDoc.getArray('doubleSmall')).to.be.null;
      expect(retrievedDoc.getArray('dateCB')).to.be.null;
      expect(retrievedDoc.getArray('dict')).to.be.null;
      expect(retrievedDoc.getArray('array')).to.deep.equal([
        '650-000-0000',
        '650-000-0001',
      ]);
      expect(retrievedDoc.getArray('blob')).to.be.null;
      expect(retrievedDoc.getArray('non_existing_key')).to.be.null;

      return {
        testName: 'testGetArray',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testGetArray',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetNull(): Promise<ITestResult> {
    try {
      // Create a document
      const doc = new MutableDocument('doc1');

      // Set a null value
      doc.setValue('null', null);

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve the saved document
      const retrievedDoc = await this.defaultCollection.document('doc1');

      // Assertions
      expect(retrievedDoc.getValue('null')).to.be.null;
      expect(Object.keys(retrievedDoc.getData()).length).to.equal(1);

      return {
        testName: 'testSetNSNull',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetNSNull',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testUpdateDictionaryInArray(): Promise<ITestResult> {
    try {
      // Create a document
      const doc = new MutableDocument('doc1');

      // Initialize and set arrays of dictionaries
      const group1 = { name: 'group1', members: ['a', 'b', 'c'] };
      const group2 = { name: 'group2', members: [1, 2, 3] };
      const groups = [group1, group2];
      doc.setArray('groups', groups);

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve and verify the saved document
      let retrievedDoc = await this.defaultCollection.document('doc1');
      expect(retrievedDoc.getData()).to.deep.equal({
        groups: [
          { name: 'group1', members: ['a', 'b', 'c'] },
          { name: 'group2', members: [1, 2, 3] },
        ],
      });

      // Update the dictionaries in the array
      const updatedGroups = retrievedDoc.getArray('groups') as any[];
      if (updatedGroups) {
        updatedGroups[0].name = 'updated_group1';
        updatedGroups[0].members = ['d', 'e', 'f'];
        updatedGroups[1].name = 'updated_group2';
        updatedGroups[1].members = [4, 5, 6];
        doc.setArray('groups', updatedGroups);
      }

      // Save the updated document
      await this.defaultCollection.save(doc);

      // Retrieve and verify the updated document
      retrievedDoc = await this.defaultCollection.document('doc1');
      expect(retrievedDoc.getData()).to.deep.equal({
        groups: [
          { name: 'updated_group1', members: ['d', 'e', 'f'] },
          { name: 'updated_group2', members: [4, 5, 6] },
        ],
      });

      return {
        testName: 'testUpdateDictionaryInArray',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testUpdateDictionaryInArray',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testUpdateNestedArray(): Promise<ITestResult> {
    try {
      // Create a document
      const doc = new MutableDocument('doc1');

      // Initialize and set nested arrays
      const groups: any[] = [];
      groups.push(['a', 'b', 'c']);
      groups.push([1, 2, 3]);
      doc.setArray('groups', groups);

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve and verify the saved document
      let retrievedDoc = await this.defaultCollection.document('doc1');
      expect(retrievedDoc.getData()).to.deep.equal({
        groups: [
          ['a', 'b', 'c'],
          [1, 2, 3],
        ],
      });

      // Update the nested arrays
      const updatedGroups = retrievedDoc.getArray('groups') as any[];

      updatedGroups[0][0] = 'd';
      updatedGroups[0][1] = 'e';
      updatedGroups[0][2] = 'f';

      updatedGroups[1][0] = 4;
      updatedGroups[1][1] = 5;
      updatedGroups[1][2] = 6;

      // Set the updated groups back into the document
      doc.setArray('groups', updatedGroups);

      // Save the updated document
      await this.defaultCollection.save(doc);

      // Retrieve and verify the updated document
      retrievedDoc = await this.defaultCollection.document('doc1');
      expect(retrievedDoc.getData()).to.deep.equal({
        groups: [
          ['d', 'e', 'f'],
          [4, 5, 6],
        ],
      });

      return {
        testName: 'testUpdateNestedArray',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testUpdateNestedArray',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testUpdateArrayInDictionary(): Promise<ITestResult> {
    try {
      // Create a document
      const doc = new MutableDocument('doc1');

      // Initialize and set nested arrays within dictionaries
      const group1: { member: string[] } = { member: ['a', 'b', 'c'] };
      doc.setDictionary('group1', group1);

      const group2: { member: number[] } = { member: [1, 2, 3] };
      doc.setDictionary('group2', group2);

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve and verify the saved document
      let retrievedDoc = await this.defaultCollection.document('doc1');
      expect(retrievedDoc.getData()).to.deep.equal({
        group1: { member: ['a', 'b', 'c'] },
        group2: { member: [1, 2, 3] },
      });

      // Update the nested arrays within the dictionaries
      const updatedGroup1 = retrievedDoc.getDictionary('group1');
      if (updatedGroup1) {
        const updatedMember1 = updatedGroup1.member as string[];
        updatedMember1[0] = 'd';
        updatedMember1[1] = 'e';
        updatedMember1[2] = 'f';
        doc.setDictionary('group1', { member: updatedMember1 });
      }

      const updatedGroup2 = retrievedDoc.getDictionary('group2');
      if (updatedGroup2) {
        const updatedMember2 = updatedGroup2.member as number[];
        updatedMember2[0] = 4;
        updatedMember2[1] = 5;
        updatedMember2[2] = 6;
        doc.setDictionary('group2', { member: updatedMember2 });
      }

      // Save the updated document
      await this.defaultCollection.save(doc);

      // Retrieve and verify the updated document
      retrievedDoc = await this.defaultCollection.document('doc1');
      expect(retrievedDoc.getData()).to.deep.equal({
        group1: { member: ['d', 'e', 'f'] },
        group2: { member: [4, 5, 6] },
      });

      return {
        testName: 'testUpdateArrayInDictionary',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testUpdateArrayInDictionary',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetDictionaryToMultipleKeys(): Promise<ITestResult> {
    try {
      // Create a document
      const doc = new MutableDocument('doc1');

      // Initialize and set the address dictionary
      const address: { [key: string]: string } = {
        street: '1 Main street',
        city: 'Mountain View',
        state: 'CA',
      };
      doc.setDictionary('shipping', address);
      doc.setDictionary('billing', address);

      // Verify the initial setting
      expect(doc.getDictionary('shipping')).to.equal(address);
      expect(doc.getDictionary('billing')).to.equal(address);

      // Update address: both shipping and billing should get the update
      address.zip = '94042';
      expect(doc.getDictionary('shipping')?.zip).to.equal('94042');
      expect(doc.getDictionary('billing')?.zip).to.equal('94042');

      // Save the document
      await this.defaultCollection.save(doc);

      // Verify after save: both shipping and billing should still be the same instance
      const shipping = doc.getDictionary('shipping');
      const billing = doc.getDictionary('billing');
      expect(shipping).to.equal(address);
      expect(billing).to.equal(address);

      // After save: both shipping and billing address should now be independent
      const savedDoc = await this.defaultCollection.document(doc.getId());
      const savedShipping = savedDoc.getDictionary('shipping');
      const savedBilling = savedDoc.getDictionary('billing');
      expect(savedShipping).to.not.equal(address);
      expect(savedBilling).to.not.equal(address);
      expect(savedShipping).to.not.equal(savedBilling);

      return {
        testName: 'testSetDictionaryToMultipleKeys',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetDictionaryToMultipleKeys',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSetArrayToMultipleKeys(): Promise<ITestResult> {
    try {
      // Create a document
      const doc = new MutableDocument('doc1');

      // Initialize and set the phones array
      const phones: string[] = ['650-000-0001', '650-000-0002'];
      doc.setArray('mobile', phones);
      doc.setArray('home', phones);

      // Verify the initial setting
      expect(doc.getArray('mobile')).to.equal(phones);
      expect(doc.getArray('home')).to.equal(phones);

      // Update phones: both mobile and home should get the update
      phones.push('650-000-0003');
      expect(doc.getArray('mobile')).to.deep.equal([
        '650-000-0001',
        '650-000-0002',
        '650-000-0003',
      ]);
      expect(doc.getArray('home')).to.deep.equal([
        '650-000-0001',
        '650-000-0002',
        '650-000-0003',
      ]);

      // Save the document
      await this.defaultCollection.save(doc);

      // Verify after save: both mobile and home should still be the same instance
      const mobile = doc.getArray('mobile');
      const home = doc.getArray('home');
      expect(mobile).to.equal(phones);
      expect(home).to.equal(phones);

      // After getting the document from the database, mobile and home should now be independent
      const savedDoc = await this.defaultCollection.document(doc.getId());
      const savedMobile = savedDoc.getArray('mobile');
      const savedHome = savedDoc.getArray('home');
      expect(savedMobile).to.not.equal(phones);
      expect(savedHome).to.not.equal(phones);
      expect(savedMobile).to.not.equal(savedHome);

      return {
        testName: 'testSetArrayToMultipleKeys',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSetArrayToMultipleKeys',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCount(): Promise<ITestResult> {
    try {
      // Create a new document
      const doc = new MutableDocument('doc1');

      // Populate the document with data
      await this.populateData(doc);

      // Save the document
      await this.defaultCollection.save(doc);

      // Retrieve the document from the collection
      const savedDoc = await this.defaultCollection.document(doc.getId());

      // Assert the count of the document's keys
      expect(Object.keys(savedDoc.toDictionary()).length).to.equal(19);
      expect(Object.keys(savedDoc.toDictionary()).length).to.equal(
        savedDoc.count()
      );

      return {
        testName: 'testCount',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testCount',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testContainsKey(): Promise<ITestResult> {
    return {
      testName: 'testContainsKey',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRemoveKeys(): Promise<ITestResult> {
    try {
      // Create a new document
      const doc = new MutableDocument('doc1');

      // Define a dictionary with initial data
      const dict = {
        type: 'profile',
        name: 'Jason',
        weight: 130.5,
        active: true,
        age: 30,
        address: {
          street: '1 milky way.',
          city: 'galaxy city',
          zip: 12345,
        },
      };

      // Set the data to the document
      doc.setData(dict);

      // Save the document
      await this.defaultCollection.save(doc);

      // Remove specific keys
      doc.remove('name');
      doc.remove('weight');
      doc.remove('age');
      doc.remove('active');
      doc.remove('address.city');

      // Assertions to check the keys have been removed
      expect(doc.getString('name')).to.be.null;
      expect(doc.getFloat('weight')).to.equal(0.0);
      expect(doc.getDouble('weight')).to.equal(0.0);
      expect(doc.getInt('age')).to.equal(0);
      expect(doc.getBoolean('active')).to.be.false;

      expect(doc.getValue('name')).to.be.null;
      expect(doc.getValue('weight')).to.be.null;
      expect(doc.getValue('age')).to.be.null;
      expect(doc.getValue('active')).to.be.null;
      expect(doc.getDictionary('address')?.getValue('city')).to.be.null;

      const docDict = {
        type: 'profile',
        address: {
          street: '1 milky way.',
          zip: 12345,
        },
      };
      expect(doc.toDictionary()).to.deep.equal(docDict);

      // Remove the rest of the keys
      doc.remove('type');
      doc.remove('address');
      expect(doc.getValue('type')).to.be.null;
      expect(doc.getValue('address')).to.be.null;

      expect(doc.toDictionary()).to.deep.equal({});

      return {
        testName: 'testRemoveKeys',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testRemoveKeys',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testBlob(): Promise<ITestResult> {
    return {
      testName: 'testBlob',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testMultipleBlobRead(): Promise<ITestResult> {
    return {
      testName: 'testMultipleBlobRead',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testReadingExistingBlob(): Promise<ITestResult> {
    return {
      testName: 'testReadingExistingBlob',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testEnumeratingKeys(): Promise<ITestResult> {
    try {
      // Create a new document
      const doc = new MutableDocument('doc1');

      // Populate the document with data
      for (let i = 0; i < 20; i++) {
        doc.setValue(`key${i}`, i);
      }
      let content = doc.toDictionary();

      // Iterate over the document keys and values
      let result: { [key: string]: any } = {};
      let count = 0;
      for (const key of Object.keys(content)) {
        result[key] = doc.getInt(key);
        count++;
      }

      // Assertions
      expect(result).to.deep.equal(content);
      expect(count).to.equal(Object.keys(content).length);

      // Update the document
      doc.remove('key2');
      doc.setValue('key20', 20);
      doc.setValue('key21', 21);
      content = doc.toDictionary();

      // Save the updated document
      await this.defaultCollection.save(doc);

      // Retrieve the updated document
      const updatedDoc = await this.defaultCollection.document('doc1');
      result = {};
      count = 0;
      const updatedContent = updatedDoc.toDictionary();
      for (const key of Object.keys(updatedContent)) {
        result[key] = updatedDoc.getInt(key);
        count++;
      }

      // Assertions for the updated document
      expect(result).to.deep.equal(updatedContent);
      expect(count).to.equal(Object.keys(updatedContent).length);

      return {
        testName: 'testEnumeratingKeys',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testEnumeratingKeys',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testEqualityDifferentDocID(): Promise<ITestResult> {
    try {
      // Create and populate document doc1
      const doc1 = new MutableDocument('doc1');
      doc1.setInt('answer', 42);
      await this.defaultCollection.save(doc1);

      // Retrieve the saved document doc1 from the database
      const sdoc1 = await this.defaultCollection.document('doc1');

      // Assertions for equality with itself and with another document with different ID
      expect(sdoc1.toDictionary()).to.eql(doc1.toDictionary());
      expect(doc1.toDictionary()).to.eql(doc1.toDictionary());
      expect(doc1.toDictionary()).to.not.eql(
        new MutableDocument('different_id').toDictionary()
      );

      // Create and populate document doc2
      const doc2 = new MutableDocument('doc2');
      doc2.setInt('answer', 42);
      await this.defaultCollection.save(doc2);

      // Retrieve the saved document doc2 from the database
      const sdoc2 = await this.defaultCollection.document('doc2');

      // Assertions for equality with itself and with another document with different ID
      expect(sdoc2.toDictionary()).to.eql(doc2.toDictionary());
      expect(doc2.toDictionary()).to.eql(doc2.toDictionary());
      expect(doc2.toDictionary()).to.not.eql(
        new MutableDocument('different_id').toDictionary()
      );

      // Check if doc1 and doc2 have different IDs
      expect(doc1.getId()).to.not.equal(doc2.getId());
      expect(sdoc1.getId()).to.not.equal(sdoc2.getId());

      // Check if doc1 and doc2 are not strictly equal (different references)
      expect(doc1).to.not.equal(doc2);
      expect(sdoc1).to.not.equal(sdoc2);

      // Check if the content of doc1 and doc2 is equal
      expect(doc1.toDictionary()).to.eql(doc2.toDictionary());
      expect(sdoc1.toDictionary()).to.eql(sdoc2.toDictionary());

      // Return success
      return {
        testName: 'testEqualityDifferentDocID',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      // Return failure with error message
      return {
        testName: 'testEqualityDifferentDocID',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testEqualityDifferentDB(): Promise<ITestResult> {
    return {
      testName: 'testEqualityDifferentDB',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRevisionIDNewDoc(): Promise<ITestResult> {
    return {
      testName: 'testRevisionIDNewDoc',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRevisionIDExistingDoc(): Promise<ITestResult> {
    return {
      testName: 'testRevisionIDExistingDoc',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testJSONNumber(): Promise<ITestResult> {
    return {
      testName: 'testJSONNumber',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentToJSON(): Promise<ITestResult> {
    return {
      testName: 'testDocumentToJSON',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testUnsavedMutableDocumentToJSON(): Promise<ITestResult> {
    return {
      testName: 'testUnsavedMutableDocumentToJSON',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSpecialJSONStrings(): Promise<ITestResult> {
    return {
      testName: 'testSpecialJSONStrings',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testBlobToJSON(): Promise<ITestResult> {
    return {
      testName: 'testBlobToJSON',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetBlobFromProps(): Promise<ITestResult> {
    return {
      testName: 'testGetBlobFromProps',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testUnsavedBlob(): Promise<ITestResult> {
    return {
      testName: 'testUnsavedBlob',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testGetBlobWithInvalidProps(): Promise<ITestResult> {
    return {
      testName: 'testGetBlobWithInvalidProps',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testSaveBlobAndCompactDB(): Promise<ITestResult> {
    return {
      testName: 'testSaveBlobAndCompactDB',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }
}
