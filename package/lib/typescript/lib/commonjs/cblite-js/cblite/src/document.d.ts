export const __esModule: boolean;
export class Document {
    constructor(id?: any, sequenceNo?: any, revisionID?: any, collection?: any, data?: {});
    doc: {};
    _engine: ICoreEngine;
    id: any;
    sequenceNo: any;
    revisionID: any;
    collection: any;
    /**
     * The number of properties in the document.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    count(): number;
    /**
     * Returns the document data as a dictionary.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getData(): {};
    _get(key: any): any;
    /**
     * Get a property’s value as a ArrayObject, which is a mapping object of an array value.
     * Returns null if the property doesn’t exists, or its value is not an array.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getArray(key: any): any[];
    /**
     * Returns the Blob associated with the given key, including its content.
     * Returns null if the property doesn’t exist, or its value is not a blob.
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getBlob(key: any): Promise<_blob.Blob>;
    /**
     * Get a property’s value as a ArrayBuffer. Returns null if the property doesn’t exist,
     * or its value is not a blob.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getBlobContent(key: any): Promise<any>;
    /**
     * Gets a property’s value as a boolean value. Returns true if the value exists,
     * and is either true or a nonzero number.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getBoolean(key: any): boolean;
    /**
     * The collection that the document belongs to.
     *
     * Throws an error if the database is closed.
     *
     * @function
     */
    getCollection(): any;
    /**
     * Gets a property’s value as a Date value. JSON does not directly support dates, so
     * the actual property value must be a string, which is then parsed according to the
     *  ISO-8601 date format (the default used in JSON.) Returns null if the value doesn’t
     *  exist, is not a string, or is not parseable as a date. NOTE: This is not a generic
     *  date parser! It only recognizes the ISO-8601 format, with milliseconds.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getDate(key: any): Date;
    /**
     * Get a property’s value as a Dictionary, which is a mapping object of a dictionary
     * value. Returns null if the property doesn’t exists, or its value is not a dictionary.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getDictionary(key: any): any;
    /**
     * Gets a property’s value as a double value. Integers will be converted to double.
     * The value true is returned as 1.0, false as 0.0. Returns 0.0 if the property doesn’t
     * exist or does not have a numeric value.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getDouble(key: any): number;
    /**
     * Gets a property’s value as a float value. Integers will be converted to float.
     * The value true is returned as 1.0, false as 0.0. Returns 0.0 if the property doesn’t
     * exist or does not have a numeric value.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getFloat(key: any): number;
    /**
     * Returns the document’s ID.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getId(): any;
    /**
     * Gets a property’s value as an int value. Floating point values will be rounded.
     * The value true is returned as 1, false as 0. Returns 0 if the property doesn’t
     * exist or does not have a numeric value.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getInt(key: any): number;
    /**
     * returns an array containing all keys, or an empty array if the document
     * has no properties.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getKeys(): string[];
    /**
     * Gets a property’s value as an number value. Floating point values will be rounded.
     * The value true is returned as 1, false as 0. Returns 0 if the property doesn’t
     * exist or does not have a numeric value.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getLong(key: any): any;
    /**
     * The ID representing a document’s revision.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getRevisionID(): any;
    /**
     * Sequence number of the document in the database. This indicates how recently the
     * document has been changed: every time any document is updated, the database assigns it
     * the next sequential sequence number. Thus, if a document’s sequence property changes
     * that means it’s been changed (on-disk); and if one document’s sequence is greater than
     * another’s, that means it was changed more recently.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getSequence(): any;
    /**
     * Gets a property’s value as a string. Returns nil if the property doesn’t exist, i
     * or its value is not a string.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    getString(key: any): string;
    /**
     * @deprecated getValue is deprecated.  Returns values as any.
     */
    getValue(key: any): any;
    /**
     * Returns the document data as a dictionary.
     *
     * Throws an error if the collection is deleted or the database is closed.
     *
     * @function
     */
    toDictionary(): {};
    /**
    * Converts the document content to a JSON string representation
    * @returns {string} A JSON string
    *
    * @function
    */
    toJsonString(): string;
}
import _blob = require("./blob.js");
//# sourceMappingURL=document.d.ts.map