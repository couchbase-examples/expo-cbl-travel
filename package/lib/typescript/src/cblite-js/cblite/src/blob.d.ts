export declare class Blob {
    private contentType;
    private bytes;
    digest: string;
    length: number;
    constructor(contentType: string, bytes: ArrayBuffer);
    getContentType(): string;
    getDigest(): string;
    getLength(): number;
    toDictionary(): {
        contentType: string;
        data: number[];
    };
}
//# sourceMappingURL=blob.d.ts.map