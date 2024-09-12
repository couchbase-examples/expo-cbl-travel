import { Dictionary } from './definitions';
/**
 * A Parameters object used for setting values to the query parameters defined in the query.
 */
export declare class Parameters {
    private _parameters;
    setValue(name: string, value: any): void;
    setString(name: string, value: string): void;
    setBoolean(name: string, value: boolean): void;
    setFloat(name: string, value: number): void;
    setDouble(name: string, value: number): void;
    setLong(name: string, value: number): void;
    setInt(name: string, value: number): void;
    setDate(name: string, value: Date): void;
    remove(name: string): void;
    get(): Dictionary;
}
//# sourceMappingURL=parameters.d.ts.map