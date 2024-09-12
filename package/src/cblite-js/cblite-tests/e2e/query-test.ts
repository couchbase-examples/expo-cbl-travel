import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
//import * as namesData from "./names_100.json";
import {
  Collection,
  FullTextIndexItem,
  IndexBuilder,
  MutableDocument,
  Parameters,
  Query,
} from '../../cblite';

import { expect } from 'chai';

/**
 * QueryTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class QueryTests extends TestCase {
  constructor() {
    super();
  }

  async testQueryDefaultCollection(): Promise<ITestResult> {
    const queries = [
      'SELECT name.first FROM _ ORDER BY name.first LIMIT 1',
      'SELECT name.first FROM _default ORDER BY name.first limit 1',
      `SELECT name.first
             FROM \`${this.database.getName()}\`
             ORDER BY name.first limit 1`,
    ];
    return await this.queryCollectionNamesData(
      this.defaultCollection,
      queries,
      'testQueryDefaultCollection'
    );
  }

  async testQueryDefaultScope(): Promise<ITestResult> {
    const collection = await this.database.createCollection('names');
    const queries = [
      'SELECT name.first FROM _default.names ORDER BY name.first LIMIT 1',
      'SELECT name.first FROM names ORDER BY name.first LIMIT 1',
    ];
    return await this.queryCollectionNamesData(
      collection,
      queries,
      'testQueryDefaultScope'
    );
  }

  async testQueryCollection(): Promise<ITestResult> {
    const collection = await this.database.createCollection('names', 'people');
    const queries = [
      'SELECT name.first FROM people.names ORDER BY name.first LIMIT 1',
    ];
    return await this.queryCollectionNamesData(
      collection,
      queries,
      'testQueryCollection'
    );
  }

  async testQueryInvalidCollection(): Promise<ITestResult> {
    const collection = await this.database.createCollection('names', 'people');
    const queries = [
      'SELECT name.first FROM person.names ORDER BY name.first LIMIT 11',
    ];
    const result = await this.queryCollectionNamesData(
      collection,
      queries,
      'testQueryInvalidCollection'
    );
    if (!result.success) {
      return {
        testName: 'testQueryInvalidCollection',
        success: true,
        message: 'success',
        data: undefined,
      };
    } else {
      return {
        testName: '',
        success: false,
        message: 'Error - expected query to fail',
        data: undefined,
      };
    }
  }

  async testJoinWithCollections(): Promise<ITestResult> {
    try {
      const flowersCol = await this.database.createCollection(
        'flowers',
        'test'
      );
      const colorsCol = await this.database.createCollection('colors', 'test');

      //add documents
      await flowersCol.save(
        new MutableDocument('c1', null, { name: 'rose', cid: 1 })
      );
      await flowersCol.save(
        new MutableDocument('c2', null, { name: 'hydrangea', cid: 2 })
      );

      await colorsCol.save(
        new MutableDocument('c1', null, { color: 'red', cid: 1 })
      );
      await colorsCol.save(
        new MutableDocument('c2', null, { color: 'blue', cid: 2 })
      );
      await colorsCol.save(
        new MutableDocument('c3', null, { color: 'white', cid: 3 })
      );

      const strQuery =
        'SELECT a.name, b.color FROM test.flowers a JOIN test.colors b ON a.cid = b.cid ORDER BY a.name';

      const query = this.database.createQuery(strQuery);
      const result = await query.execute();

      expect(result.length).to.be.equal(2);
      expect(result[0].name).to.be.equal('hydrangea');
      expect(result[0].color).to.be.equal('blue');
      expect(result[1].name).to.be.equal('rose');
      expect(result[1].color).to.be.equal('red');

      return {
        testName: 'testJoinWithCollections',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testJoinWithCollections',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testFTSWithFTSIndexDefaultCol(): Promise<ITestResult> {
    try {
      await this.loadNamesData(this.defaultCollection);
      const indexProperty = FullTextIndexItem.property('name.first');
      const index = IndexBuilder.fullTextIndex(indexProperty);
      await this.defaultCollection.createIndex('index', index);

      const indexes: string[] = [
        'index',
        '_.index',
        '_default.index',
        'd.index',
      ];
      const froms: string[] = [
        '_',
        '_',
        '_default',
        `\`${this.database.getName()}\``,
      ];

      for (let i = 0; i < indexes.length; i++) {
        let qStr = '';
        if (indexes[i] !== indexes[indexes.length - 1]) {
          qStr = `SELECT name
                            FROM ${froms[i]}
                            WHERE match (${indexes[i]}, "Jasper")
                            ORDER BY rank(${indexes[i]})`;
        } else {
          qStr = `SELECT name
                            FROM _ as d
                            WHERE match (${indexes[i]}, "Jasper")
                            ORDER BY rank(${indexes[i]})`;
        }
        // Use qStr here
        const q = this.database.createQuery(qStr);
        const rs = await q.execute();
        expect(rs.length).to.be.equal(2);
        expect(rs[0].name.last).to.be.equal('Grebel');
        expect(rs[1].name.last).to.be.equal('Okorududu');
      }
      return {
        testName: 'testFTSWithFTSIndexDefaultCol',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testFTSWithFTSIndexDefaultCol',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testFTSWithFTSIndexNamedCol(): Promise<ITestResult> {
    try {
      const col = await this.database.createCollection('people', 'test');
      //add documents
      await col.save(
        new MutableDocument('person1', null, {
          name: { first: 'Jasper', last: 'Grebel' },
          random: '4',
        })
      );
      await col.save(
        new MutableDocument('person2', null, {
          name: { first: 'Jasper', last: 'Okorududu' },
          random: '1',
        })
      );
      await col.save(
        new MutableDocument('person3', null, {
          name: { first: 'Monica', last: 'Polina' },
          random: '2',
        })
      );

      const indexProperty = FullTextIndexItem.property('name.first');
      const index = IndexBuilder.fullTextIndex(indexProperty);
      await col.createIndex('index', index);

      const indexes: string[] = ['index', 'people.index', 'p.index'];
      for (let counter = 0; counter < indexes.length; counter++) {
        let qStr = '';
        if (indexes[counter] !== indexes[indexes.length - 1]) {
          qStr = `SELECT name
                            FROM test.people
                            WHERE match (${indexes[counter]}, "Jasper")
                            ORDER BY rank(${indexes[counter]})`;
        } else {
          qStr = `SELECT name
                            FROM test.people as p
                            WHERE match (${indexes[counter]}, "Jasper")
                            ORDER BY rank(${indexes[counter]})`;
        }
        // Use qStr here
        const q = this.database.createQuery(qStr);
        const rs = await q.execute();
        expect(rs.length).to.be.equal(2);
        expect(rs[0].name.last).to.be.equal('Grebel');
        expect(rs[1].name.last).to.be.equal('Okorududu');
      }
      return {
        testName: 'testFTSWithFTSIndexNamedCol',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testFTSWithFTSIndexNamedCol',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testFtsJoinCollection(): Promise<ITestResult> {
    try {
      const flowersCol = await this.database.createCollection(
        'flowers',
        'test'
      );
      const colorsCol = await this.database.createCollection('colors', 'test');

      //add documents
      await flowersCol.save(
        new MutableDocument('c1', null, {
          name: 'rose',
          cid: 1,
          description: 'Red flowers',
        })
      );
      await flowersCol.save(
        new MutableDocument('c2', null, {
          name: 'hydrangea',
          cid: 2,
          description: 'Blue flowers',
        })
      );

      await colorsCol.save(
        new MutableDocument('c1', null, { color: 'red', cid: 1 })
      );
      await colorsCol.save(
        new MutableDocument('c2', null, { color: 'blue', cid: 2 })
      );
      await colorsCol.save(
        new MutableDocument('c3', null, { color: 'white', cid: 3 })
      );

      const indexProperty = FullTextIndexItem.property('description');
      const index = IndexBuilder.fullTextIndex(indexProperty);
      await flowersCol.createIndex('descIndex', index);

      const strQuery =
        "SELECT f.name, f.description, c.color FROM test.flowers f JOIN test.colors c ON f.cid = c.cid WHERE match(f.descIndex, 'red') ORDER BY f.name";

      const query = this.database.createQuery(strQuery);
      const result = await query.execute();

      expect(result.length).to.be.equal(1);
      expect(result[0].name).to.be.equal('rose');
      expect(result[0].color).to.be.equal('red');
      expect(result[0].description).to.be.equal('Red flowers');

      return {
        testName: 'testFtsJoinCollection',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testFtsJoinCollection',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testSelectAllResultKey(): Promise<ITestResult> {
    try {
      const flowersCol = await this.database.createCollection(
        'flowers',
        'test'
      );

      //add documents
      await flowersCol.save(
        new MutableDocument('c1', null, { name: 'rose', cid: 1 })
      );
      await this.defaultCollection.save(
        new MutableDocument('c1', null, { name: 'rose', cid: 1 })
      );

      const froms = [
        `\`${this.database.getName()}\``,
        '_',
        '_default._default',
        'test.flowers',
        'test.flowers as f',
      ];
      const expectedKeyNames = [
        this.database.getName(),
        '_',
        '_default',
        'flowers',
        'f',
      ];

      for (let counter = 0; counter < froms.length; counter++) {
        const qStr = `SELECT *
                              FROM ${froms[counter]}`;
        const q = this.database.createQuery(qStr);
        const rs = await q.execute();
        const obj = rs[0];
        const keyValue = Object.keys(obj)[0];
        expect(rs.length).to.be.equal(1);
        expect(keyValue).to.be.equal(expectedKeyNames[counter]);
      }
      return {
        testName: 'testSelectAllResultKey',
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: 'testSelectAllResultKey',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testQueryDateParameter(): Promise<ITestResult> {
    try {
      const col = await this.database.createCollection('people', 'test');
      //add documents
      await this.loadDocumentsIntoCollection(20, col);
      const date = new Date('2020-01-01T00:00:00.000Z');
      //test null value
      const valueQuery = this.database.createQuery(
        'SELECT * FROM test.people WHERE dateCB = $param limit 1'
      );
      const parameters = new Parameters();
      parameters.setDate('param', date);
      valueQuery.parameters = parameters;
      return await this.runQueryParameterTest(
        valueQuery,
        'dateCB',
        '2020-01-01T00:00:00.000Z',
        'testQueryDateParameter'
      );
    } catch (error) {
      return {
        testName: 'testQueryDateParameter',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testQueryStringParameter(): Promise<ITestResult> {
    try {
      const col = await this.database.createCollection('people', 'test');
      //add documents
      await this.loadDocumentsIntoCollection(20, col);
      //test null value
      const valueQuery = this.database.createQuery(
        'SELECT * FROM test.people WHERE stringPunk = $param limit 1'
      );
      const parameters = new Parameters();
      parameters.setString('param', 'Jett');
      valueQuery.parameters = parameters;
      return await this.runQueryParameterTest(
        valueQuery,
        'stringPunk',
        'Jett',
        'testQueryStringParameter'
      );
    } catch (error) {
      return {
        testName: 'testQueryStringParameter',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testQueryDoubleSmallParameter(): Promise<ITestResult> {
    try {
      const col = await this.database.createCollection('people', 'test');
      //add documents
      await this.loadDocumentsIntoCollection(20, col);
      //test null value
      const valueQuery = this.database.createQuery(
        'SELECT * FROM test.people WHERE doubleSmall = $param limit 1'
      );
      const parameters = new Parameters();
      parameters.setDouble('param', -1.0e200);
      valueQuery.parameters = parameters;
      return await this.runQueryParameterTest(
        valueQuery,
        'doubleSmall',
        -1.0e200,
        'testQueryDoubleSmallParameter'
      );
    } catch (error) {
      return {
        testName: 'testQueryDoubleSmallParameter',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testQueryDoubleBigParameter(): Promise<ITestResult> {
    try {
      const col = await this.database.createCollection('people', 'test');
      //add documents
      await this.loadDocumentsIntoCollection(20, col);
      //test null value
      const valueQuery = this.database.createQuery(
        'SELECT * FROM test.people WHERE doubleBig = $param limit 1'
      );
      const parameters = new Parameters();
      parameters.setDouble('param', 1.0e200);
      valueQuery.parameters = parameters;
      return await this.runQueryParameterTest(
        valueQuery,
        'doubleBig',
        1.0e200,
        'testQueryDoubleBigParameter'
      );
    } catch (error) {
      return {
        testName: 'testQueryDoubleBigParameter',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testQueryLongSmallParameter(): Promise<ITestResult> {
    try {
      const col = await this.database.createCollection('people', 'test');
      //add documents
      await this.loadDocumentsIntoCollection(20, col);
      //test null value
      const valueQuery = this.database.createQuery(
        'SELECT * FROM test.people WHERE longSmall = $param limit 1'
      );
      const parameters = new Parameters();
      parameters.setLong('param', -4000000000);
      valueQuery.parameters = parameters;
      return await this.runQueryParameterTest(
        valueQuery,
        'longSmall',
        -4000000000,
        'testQueryLongSmallParameter'
      );
    } catch (error) {
      return {
        testName: 'testQueryLongSmallParameter',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testQueryLongBigParameter(): Promise<ITestResult> {
    try {
      const col = await this.database.createCollection('people', 'test');
      //add documents
      await this.loadDocumentsIntoCollection(20, col);
      //test null value
      const valueQuery = this.database.createQuery(
        'SELECT * FROM test.people WHERE longBig = $param limit 1'
      );
      const parameters = new Parameters();
      parameters.setLong('param', 4000000000);
      valueQuery.parameters = parameters;
      return await this.runQueryParameterTest(
        valueQuery,
        'longBig',
        4000000000,
        'testQueryLongBigParameter'
      );
    } catch (error) {
      return {
        testName: 'testQueryLongBigParameter',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testQueryLongZeroParameter(): Promise<ITestResult> {
    try {
      const col = await this.database.createCollection('people', 'test');
      //add documents
      await this.loadDocumentsIntoCollection(20, col);
      //test null value
      const valueQuery = this.database.createQuery(
        'SELECT * FROM test.people WHERE longZero = $param limit 1'
      );
      const parameters = new Parameters();
      parameters.setLong('param', 0);
      valueQuery.parameters = parameters;
      return await this.runQueryParameterTest(
        valueQuery,
        'longZero',
        0,
        'testQueryLongZeroParameter'
      );
    } catch (error) {
      return {
        testName: 'testQueryLongZeroParameter',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testQueryBooleanTrueParameter(): Promise<ITestResult> {
    try {
      const col = await this.database.createCollection('people', 'test');
      //add documents
      await this.loadDocumentsIntoCollection(20, col);
      //test null value
      const valueQuery = this.database.createQuery(
        'SELECT * FROM test.people WHERE booleanTrue = $param limit 1'
      );
      const parameters = new Parameters();
      parameters.setBoolean('param', true);
      valueQuery.parameters = parameters;
      return await this.runQueryParameterTest(
        valueQuery,
        'booleanTrue',
        true,
        'testQueryBooleanTrueParameter'
      );
    } catch (error) {
      return {
        testName: 'testQueryBooleanTrueParameter',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testQueryBooleanFalseParameter(): Promise<ITestResult> {
    try {
      const col = await this.database.createCollection('people', 'test');
      //add documents
      await this.loadDocumentsIntoCollection(20, col);
      //test null value
      const valueQuery = this.database.createQuery(
        'SELECT * FROM test.people WHERE booleanFalse = $param limit 1'
      );
      const parameters = new Parameters();
      parameters.setBoolean('param', false);
      valueQuery.parameters = parameters;
      return await this.runQueryParameterTest(
        valueQuery,
        'booleanFalse',
        false,
        'testQueryBooleanFalseParameter'
      );
    } catch (error) {
      return {
        testName: 'testQueryBooleanFalseParameter',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async testQueryValueParameter(): Promise<ITestResult> {
    try {
      const col = await this.database.createCollection('people', 'test');
      //add documents
      await this.loadDocumentsIntoCollection(20, col);
      //test null value
      const valueQuery = this.database.createQuery(
        'SELECT * FROM test.people WHERE dataValue = $param limit 1'
      );
      const parameters = new Parameters();
      parameters.setValue('param', 'value');
      valueQuery.parameters = parameters;
      return await this.runQueryParameterTest(
        valueQuery,
        'dataValue',
        'value',
        'testQueryValueParameter'
      );
    } catch (error) {
      return {
        testName: 'testQueryValueParameter',
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async runQueryParameterTest(
    query: Query,
    paraName: string,
    paraValue: any,
    testName: string
  ): Promise<ITestResult> {
    try {
      const rs = await query.execute();
      const item = rs[0].people;
      expect(rs.length).to.be.equal(1);
      expect(item[paraName]).to.be.equal(paraValue);
      return {
        testName: testName,
        success: true,
        message: 'success',
        data: undefined,
      };
    } catch (error) {
      return {
        testName: testName,
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
  }

  async queryCollectionNamesData(
    collection: Collection,
    queries: string[],
    testName: string
  ): Promise<ITestResult> {
    try {
      await this.loadNamesData(collection);
      for (const query of queries) {
        const dbQuery = this.database.createQuery(query);
        const result = await dbQuery.execute();
        expect(result.length).to.be.equal(1);
      }
    } catch (error) {
      return {
        testName: testName,
        success: false,
        message: JSON.stringify(error),
        data: undefined,
      };
    }
    return {
      testName: testName,
      success: true,
      message: 'success',
      data: undefined,
    };
  }
}
