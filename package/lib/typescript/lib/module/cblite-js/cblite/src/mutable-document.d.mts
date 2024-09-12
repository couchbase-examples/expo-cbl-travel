export class MutableDocument extends Document {
    static fromDocument(document: any): MutableDocument;
    remove(key: any): this;
    _set(key: any, value: any): void;
    setId(id: any): void;
    setArray(key: any, value: any): this;
    setBlob(key: any, value: any): this;
    setBoolean(key: any, value: any): this;
    setData(data: any): this;
    setDate(key: any, value: any): this;
    setDictionary(key: any, value: any): this;
    setDouble(key: any, value: any): this;
    setFloat(key: any, value: any): this;
    setInt(key: any, value: any): this;
    setLong(key: any, value: any): this;
    setNumber(key: any, value: any): this;
    setString(key: any, value: any): this;
    setValue(key: any, value: any): this;
}
import { Document } from "./document.mjs";
//# sourceMappingURL=mutable-document.d.mts.map