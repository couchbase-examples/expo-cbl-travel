export declare class FileSystem {
    private _engine;
    getDefaultPath(): Promise<string>;
    getFilesInDirectory(path: string): Promise<{
        files: string[];
    }>;
}
//# sourceMappingURL=file-system.d.ts.map