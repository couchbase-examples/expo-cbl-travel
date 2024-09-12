"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Query = void 0;
var _engineLocator = require("./engine-locator.cjs");
var _parameters = require("./parameters.cjs");
/**
 * A database query. A Query instance can be constructed by calling
 * execute or explain.
 */
class Query {
  //used for engine calls
  _engine = _engineLocator.EngineLocator.getEngine(_engineLocator.EngineLocator.key);

  //query change listener support

  constructor(queryString, database) {
    this._queryString = queryString;
    this._database = database;
    this._didStartQueryListener = false;
  }

  /**
   * Adds a query change listener.
   *
   * @function
   */
  async addChangeListener(listener) {
    this._changeListener = listener;
    const token = this._engine.getUUID();
    if (!this._didStartQueryListener) {
      await this._engine.query_AddChangeListener({
        name: this._database.getName(),
        query: this._queryString,
        parameters: this.parameters,
        changeListenerToken: token
      }, (data, err) => {
        if (err) {
          throw err;
        }
        this.notifyChangeListeners(data);
      });
      this._didStartQueryListener = true;
      return token;
    } else {
      throw new Error(`Listener for query ${this._queryString} already started`);
    }
  }

  /**
   * Adds a Parameter object used for setting values to the query parameters defined in the query. All parameters defined in the query must be given values before running the query, or the query will fail.
   *
   * @function
   */
  addParameter(parameters) {
    this.parameters = parameters;
  }

  /**
   * Executes the query. The returning an enumerator that returns result rows one at a time.
   *
   * The results come from a snapshot of the database taken at the moment -run: is called, so they will not reflect any changes made to the database afterward.
   *
   * @function
   */
  async execute() {
    if (this.parameters === undefined) {
      this.parameters = new _parameters.Parameters();
    }
    const queryResults = await this._database.getEngine().query_Execute({
      name: this._database.getName(),
      query: this._queryString,
      parameters: this.parameters.get()
    });
    const data = queryResults.data;
    return JSON.parse(data);
  }

  /**
   *
   * Returns a string describing the implementation of the compiled query. This is intended to be read by a developer for purposes of optimizing the query, especially to add database indexes. It’s not machine-readable and its format may change.
   *
   * As currently implemented, the result is two or more lines separated by newline characters:
   *
   * The first line is the SQLite SELECT statement.
   * The subsequent lines are the output of SQLite’s “EXPLAIN QUERY PLAN” command applied to that statement; for help interpreting this, see https://www.sqlite.org/eqp.html . The most important thing to know is that if you see “SCAN TABLE”, it means that SQLite is doing a slow linear scan of the documents instead of using an index.
   *
   * @function
   */
  async explain() {
    if (this.parameters === undefined) {
      this.parameters = new _parameters.Parameters();
    }
    const queryResults = await this._database.getEngine().query_Explain({
      name: this._database.getName(),
      query: this._queryString,
      parameters: this.parameters.get()
    });
    return queryResults.data;
  }
  getDatabase() {
    return this._database;
  }

  /**
   * A Parameters object used for setting values to the query parameters defined in the query. All parameters defined in the query must be given values before running the query, or the query will fail.
   *
   * The returned Parameters object will be readonly.
   *
   * @function
   */
  getParameters() {
    return this.parameters;
  }

  /**
   * send data to the listener
   *
   * @function
   */
  notifyChangeListeners(data) {
    const stringData = data.data;
    this._changeListener({
      query: this,
      error: data.error,
      results: JSON.parse(stringData)
    });
  }

  /**
   * Removes a change listener wih the given listener token.
   *
   * @function
   */
  async removeChangeListener(token) {
    try {
      await this._database.getEngine().query_RemoveChangeListener({
        changeListenerToken: token,
        name: this._database.getName()
      });
    } catch (error) {
      throw error;
    }
  }
  setDatabase(database) {
    this._database = database;
  }
  toString() {
    return this._queryString;
  }
}
exports.Query = Query;
//# sourceMappingURL=query.cjs.map