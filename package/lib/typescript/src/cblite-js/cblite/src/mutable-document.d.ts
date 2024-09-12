import { Document } from './document';
import { Dictionary } from './definitions';
import { Blob } from './blob';
export declare class MutableDocument extends Document {
    constructor(id?: string, sequenceNo?: number, data?: Dictionary);
    static fromDocument(document: Document): MutableDocument;
    remove(key: string): MutableDocument;
    _set(key: string, value: any | null): void;
    setId(id: string): void;
    setArray(key: string, value: any[]): MutableDocument;
    setBlob(key: string, value: Blob | null): MutableDocument;
    setBoolean(key: string, value: boolean): MutableDocument;
    setData(data: Dictionary): MutableDocument;
    setDate(key: string, value: Date | null): MutableDocument;
    setDictionary(key: string, value: Dictionary | null): MutableDocument;
    setDouble(key: string, value: number): MutableDocument;
    setFloat(key: string, value: number): MutableDocument;
    setInt(key: string, value: number): MutableDocument;
    setLong(key: string, value: number): MutableDocument;
    setNumber(key: string, value: number): MutableDocument;
    setString(key: string, value: string | null): MutableDocument;
    setValue(key: string, value: any): MutableDocument;
}
//# sourceMappingURL=mutable-document.d.ts.map