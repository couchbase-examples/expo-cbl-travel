/**
 * A Parameters object used for setting values to the query parameters defined in the query.
 */
export declare class Parameter {
    name: string;
    value: any;
    type: string;
    private _set;
    setValue(name: string, value: any | null): void;
    setString(name: string, value: string | null): void;
    setBoolean(name: string, value: boolean): void;
    setFloat(name: string, value: number): void;
    setDouble(name: string, value: number): void;
    setLong(name: string, value: number): void;
    setInt(name: string, value: number): void;
    setDate(name: string, value: string | null): void;
    get(): this;
}
//# sourceMappingURL=parameter.d.ts.map