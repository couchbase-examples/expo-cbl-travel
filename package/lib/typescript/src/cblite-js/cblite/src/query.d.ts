import { QueryChangeListener } from '../core-types';
import { Database } from './database';
import { ResultSet } from './result';
import { Parameters } from './parameters';
/**
 * A database query. A Query instance can be constructed by calling
 * execute or explain.
 */
export declare class Query {
    private readonly _queryString;
    parameters: Parameters;
    private _database;
    private _engine;
    private _changeListener;
    private _didStartQueryListener;
    constructor(queryString: string, database: Database);
    /**
     * Adds a query change listener.
     *
     * @function
     */
    addChangeListener(listener: QueryChangeListener): Promise<string>;
    /**
     * Adds a Parameter object used for setting values to the query parameters defined in the query. All parameters defined in the query must be given values before running the query, or the query will fail.
     *
     * @function
     */
    addParameter(parameters: Parameters): void;
    /**
     * Executes the query. The returning an enumerator that returns result rows one at a time.
     *
     * The results come from a snapshot of the database taken at the moment -run: is called, so they will not reflect any changes made to the database afterward.
     *
     * @function
     */
    execute(): Promise<ResultSet>;
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
    explain(): Promise<string>;
    getDatabase(): Database;
    /**
     * A Parameters object used for setting values to the query parameters defined in the query. All parameters defined in the query must be given values before running the query, or the query will fail.
     *
     * The returned Parameters object will be readonly.
     *
     * @function
     */
    getParameters(): Parameters;
    /**
     * send data to the listener
     *
     * @function
     */
    private notifyChangeListeners;
    /**
     * Removes a change listener wih the given listener token.
     *
     * @function
     */
    removeChangeListener(token: string): Promise<void>;
    setDatabase(database: Database): void;
    toString(): string;
}
//# sourceMappingURL=query.d.ts.map