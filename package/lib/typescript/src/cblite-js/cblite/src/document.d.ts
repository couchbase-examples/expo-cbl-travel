import { Dictionary } from './definitions';
import { Blob } from './blob';
import { Collection } from './collection';
export declare class Document {
    protected id: string;
    protected sequenceNo: number;
    protected doc: Dictionary;
    constructor(id?: string, sequenceNo?: number, data?: Dictionary);
    count(): number;
    getData(): Dictionary;
    private _get;
    getArray(key: string): any;
    getBlob(key: string): Blob;
    getBlobContent(key: string, collection: Collection): Promise<ArrayBuffer>;
    getBoolean(key: string): any;
    getDate(key: string): any;
    getDictionary(key: string): any;
    getDouble(key: string): any;
    getFloat(key: string): any;
    getId(): string;
    getInt(key: string): any;
    getKeys(): string[];
    getLong(key: string): any;
    getSequence(): number;
    getString(key: string): any;
    getValue(key: string): any;
    toDictionary(): Dictionary;
}
//# sourceMappingURL=document.d.ts.map